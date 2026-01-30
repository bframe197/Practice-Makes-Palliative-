
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRotation } from '../types';
import { PALLIATIVE_TOPICS } from '../constants';

interface DashboardProps {
  rotation: UserRotation;
  toggleComplete: (topicId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ rotation, toggleComplete }) => {
  const navigate = useNavigate();
  const completedCount = rotation.schedule.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / PALLIATIVE_TOPICS.length) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Your Progress</h2>
            <p className="text-slate-500">Currently in a {rotation.length} rotation</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="block text-3xl font-bold text-indigo-600">{progressPercent}%</span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Curriculum Complete</span>
            </div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rotation.schedule.map((item, idx) => {
          const topic = PALLIATIVE_TOPICS.find(t => t.id === item.topicId)!;
          const topicDate = new Date(item.date);
          const isToday = topicDate.toDateString() === new Date().toDateString();
          const isFuture = topicDate > new Date() && !isToday;

          return (
            <div 
              key={item.topicId}
              className={`group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md ${
                isToday ? 'ring-2 ring-indigo-500' : ''
              } ${item.completed ? 'opacity-75' : ''}`}
            >
              {isToday && (
                <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                  Today's Topic
                </span>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400">
                  {topicDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => toggleComplete(item.topicId)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200'
                  }`}
                >
                  {item.completed && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                {topic.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2 mb-6">
                {topic.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button 
                  onClick={() => navigate(`/learn/${topic.id}`)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition text-center"
                >
                  Learn
                </button>
                <button 
                  onClick={() => navigate(`/practice/${topic.id}`)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 px-3 rounded-lg text-sm transition text-center"
                >
                  Practice
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
