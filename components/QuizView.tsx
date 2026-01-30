
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PALLIATIVE_TOPICS } from '../constants';
import { getQuizForTopic } from '../services/gemini';
import { Topic, QuizQuestion } from '../types';

const QuizView: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const found = PALLIATIVE_TOPICS.find(t => t.id === topicId);
    if (found) {
      setTopic(found);
      fetchQuiz(found);
    }
  }, [topicId]);

  const fetchQuiz = async (t: Topic) => {
    setLoading(true);
    try {
      const data = await getQuizForTopic(t);
      setQuestions(data.questions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    if (idx === questions[currentIndex].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Generating evidence-based questions...</p>
    </div>
  );

  if (!topic || questions.length === 0) return <div>Failed to load quiz.</div>;

  if (isFinished) {
    const passed = score / questions.length >= 0.7;
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        <div className={`p-8 text-center ${passed ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <div className="text-5xl font-black mb-4">{score} / {questions.length}</div>
          <p className="opacity-90">{passed ? "Excellent work! You've mastered this topic." : "Good effort. Consider reviewing the material once more."}</p>
        </div>
        <div className="p-8 flex flex-col space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
        <span>{topic.title}</span>
        <span>Question {currentIndex + 1} of {questions.length}</span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-8 leading-snug">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let stateClass = "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700";
            if (showFeedback) {
              if (idx === currentQ.correctIndex) {
                stateClass = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500";
              } else if (idx === selectedAnswer) {
                stateClass = "border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500";
              } else {
                stateClass = "border-slate-100 bg-white text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex items-center justify-between ${stateClass}`}
              >
                <span>{option}</span>
                {showFeedback && idx === currentQ.correctIndex && (
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-8 animate-fadeIn">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Rationale</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{currentQ.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg transition"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
