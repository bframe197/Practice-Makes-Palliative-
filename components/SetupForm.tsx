
import React, { useState } from 'react';
import { RotationLength } from '../types';

interface SetupFormProps {
  onSetup: (config: { startDate: string; length: RotationLength }) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onSetup }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [length, setLength] = useState<RotationLength>(RotationLength.FOUR_WEEKS);

  // Empathetic clinical consultation background image
  const bgUrl = "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=2070";

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${bgUrl}')` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Palliative Care</h2>
          <p className="text-indigo-100 opacity-90 text-sm">Organize your palliative care learning path.</p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Duration</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLength(RotationLength.TWO_WEEKS)}
                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                  length === RotationLength.TWO_WEEKS 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                2 Weeks
              </button>
              <button
                onClick={() => setLength(RotationLength.FOUR_WEEKS)}
                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                  length === RotationLength.FOUR_WEEKS 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                4 Weeks
              </button>
            </div>
          </div>

          <button
            onClick={() => onSetup({ startDate, length })}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Initialize Curriculum</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed italic">
            "Palliative care is a philosophy of care that focuses on quality of life and relief of suffering."
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
