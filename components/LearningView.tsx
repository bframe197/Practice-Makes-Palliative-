
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PALLIATIVE_TOPICS } from '../constants';
import { getLearningContent } from '../services/gemini';
import { Topic } from '../types';

const LearningView: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    const found = PALLIATIVE_TOPICS.find(t => t.id === topicId);
    if (found) {
      setTopic(found);
      fetchContent(found);
    }
  }, [topicId]);

  const fetchContent = async (t: Topic) => {
    setLoading(true);
    try {
      const { content, sources } = await getLearningContent(t);
      setContent(content);
      setSources(sources);
    } catch (error) {
      console.error(error);
      setContent("Error loading content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!topic) return <div>Topic not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/')}
        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span>Back to Schedule</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b p-6 md:p-8">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{topic.title}</h2>
          <div className="flex flex-wrap gap-2">
            {topic.learningObjectives.map((obj, i) => (
              <span key={i} className="text-[10px] bg-indigo-100 text-indigo-700 font-bold uppercase tracking-wider px-2 py-1 rounded">
                {obj}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-medium">Synthesizing Clinical Wisdom...</p>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg font-normal font-sans">
              {content}
            </div>
          )}
        </div>

        {!loading && sources.length > 0 && (
          <div className="bg-slate-50 border-t p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Supporting Evidence</h4>
            <div className="grid gap-2">
              {sources.map((chunk: any, i) => {
                const webSource = chunk.web;
                if (!webSource) return null;
                return (
                  <a 
                    key={i} 
                    href={webSource.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    <span className="truncate underline decoration-indigo-200 underline-offset-2">{webSource.title || webSource.uri}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
        <button 
          onClick={() => navigate(`/quiz/${topic.id}`)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Take Topic Quiz</span>
        </button>
        <button 
          onClick={() => navigate(`/practice/${topic.id}`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span>Start Practice Simulation</span>
        </button>
      </div>
    </div>
  );
};

export default LearningView;
