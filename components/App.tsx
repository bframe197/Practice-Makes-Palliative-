
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { UserRotation, RotationLength } from './types';
import { PALLIATIVE_TOPICS } from './constants';
import Dashboard from './components/Dashboard';
import SetupForm from './components/SetupForm';
import LearningView from './components/LearningView';
import PracticeRoom from './components/PracticeRoom';
import QuizView from './components/QuizView';

const App: React.FC = () => {
  const [rotation, setRotation] = useState<UserRotation | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('palli_rotation');
    if (saved) {
      setRotation(JSON.parse(saved));
    }
  }, []);

  const handleSetup = (config: { startDate: string; length: RotationLength }) => {
    const schedule = [];
    const numTopics = PALLIATIVE_TOPICS.length;
    const daysInRotation = config.length === RotationLength.TWO_WEEKS ? 14 : 28;
    const interval = daysInRotation / numTopics;

    for (let i = 0; i < numTopics; i++) {
      const date = new Date(config.startDate);
      date.setDate(date.getDate() + Math.floor(i * interval));
      schedule.push({
        date: date.toISOString().split('T')[0],
        topicId: PALLIATIVE_TOPICS[i].id,
        completed: false,
      });
    }

    const newRotation = { ...config, schedule };
    setRotation(newRotation);
    localStorage.setItem('palli_rotation', JSON.stringify(newRotation));
  };

  const toggleComplete = (topicId: string) => {
    if (!rotation) return;
    const updated = {
      ...rotation,
      schedule: rotation.schedule.map(s => 
        s.topicId === topicId ? { ...s, completed: !s.completed } : s
      )
    };
    setRotation(updated);
    localStorage.setItem('palli_rotation', JSON.stringify(updated));
  };

  const resetRotation = () => {
    localStorage.removeItem('palli_rotation');
    setRotation(null);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <header className="bg-indigo-700 text-white shadow-lg p-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.hash = '/'}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h1 className="text-xl font-bold">Practice Makes Palliative</h1>
            </div>
            {rotation && (
              <button 
                onClick={resetRotation}
                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
              >
                Reset Rotation
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
          {!rotation ? (
            <SetupForm onSetup={handleSetup} />
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard rotation={rotation} toggleComplete={toggleComplete} />} />
              <Route path="/learn/:topicId" element={<LearningView />} />
              <Route path="/practice/:topicId" element={<PracticeRoom />} />
              <Route path="/quiz/:topicId" element={<QuizView />} />
            </Routes>
          )}
        </main>

        <footer className="bg-slate-100 border-t p-6 text-center text-slate-500 text-sm">
          &copy; 2024 Practice Makes Palliative - Medical Student Palliative Care Curriculum.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
