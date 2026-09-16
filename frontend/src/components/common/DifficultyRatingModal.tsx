import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { RatingDifficulty, TopicItem, RevisionRecord } from '../../types';
import { X, Sparkles, Calendar, CheckCircle2, Clock, Brain, RefreshCw, Zap } from 'lucide-react';

interface DifficultyRatingModalProps {
  topic: TopicItem;
  isOpen: boolean;
  onClose: () => void;
  onRatingCompleted?: (record: RevisionRecord) => void;
}

export const DifficultyRatingModal: React.FC<DifficultyRatingModalProps> = ({
  topic,
  isOpen,
  onClose,
  onRatingCompleted
}) => {
  const { recordRevision, progress } = useProgress();
  const [ratedRecord, setRatedRecord] = useState<RevisionRecord | null>(null);

  if (!isOpen) return null;

  const handleRate = (rating: RatingDifficulty) => {
    const record = recordRevision(topic.id, rating, topic);
    setRatedRecord(record);
    if (onRatingCompleted) {
      onRatingCompleted(record);
    }
  };

  const getAlgoName = () => {
    switch (progress.activeAlgorithm) {
      case 'sm2': return 'SuperMemo SM-2';
      case 'leitner': return 'Leitner 5-Box';
      default: return 'Smart Adaptive (Ebbinghaus + Meta)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border border-purple-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                Question Evaluation
              </span>
              <span className="text-[10px] text-slate-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {getAlgoName()}
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1.5 leading-snug">
              How difficult was this question?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your level of understanding for <span className="text-purple-300 font-semibold">{topic.title}</span>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Evaluation Prompt / Feedback Confirmation */}
        {!ratedRecord ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Easy Option */}
            <button
              onClick={() => handleRate('easy')}
              className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">😎</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                  Easy
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                  Pura Samajh Aa Gaya
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  100% clear logic & code. Schedule long review interval.
                </p>
              </div>
            </button>

            {/* Medium Option */}
            <button
              onClick={() => handleRate('medium')}
              className="p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🙂</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase">
                  Medium
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                  Aadha Samajh Aaya
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ~50% clear. Standard periodic spaced revision.
                </p>
              </div>
            </button>

            {/* Hard Option */}
            <button
              onClick={() => handleRate('hard')}
              className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">😵</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                  Hard
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                  Kam Samajh Aaya
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Struggled with logic. Schedule quick review soon.
                </p>
              </div>
            </button>

            {/* Couldn't Solve Option */}
            <button
              onClick={() => handleRate('failed')}
              className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">❌</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase">
                  Failed
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors">
                  Nahi Samajh Aaya
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Could not solve. Resets interval to 1 day.
                </p>
              </div>
            </button>
          </div>
        ) : (
          /* Confirmation & Scheduled Revision Timeline */
          <div className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Revision Recorded! 🔥</h3>
              <p className="text-xs text-slate-300">
                Next revision scheduled for <span className="text-emerald-400 font-extrabold">{ratedRecord.nextRevisionDateFormatted}</span> ({ratedRecord.interval} day interval).
              </p>
            </div>

            {/* Upcoming Revision Timeline Preview */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Calculated Revision Schedule:</span>
                <span className="text-purple-400 text-[11px]">Last Attempt: {ratedRecord.lastAttemptedFormatted}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
                {ratedRecord.scheduledDates.map((dateStr, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl border shrink-0 text-center space-y-0.5 ${
                      idx === 0
                        ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 text-xs'
                    }`}
                  >
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Step {idx + 1}</div>
                    <div className="text-xs font-extrabold">{dateStr}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/20"
            >
              Continue Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
