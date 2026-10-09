import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

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

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white border border-purple-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                Question Evaluation
              </span>
              <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                {getAlgoName()}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1.5 leading-snug">
              How difficult was this question?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your level of understanding for <span className="text-purple-700 font-semibold">{topic.title}</span>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-900 border border-slate-200 transition-all shrink-0"
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
              className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">😎</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  Easy
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-emerald-700 transition-colors">
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
              className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-50 border border-blue-200 hover:border-blue-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🙂</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                  Medium
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-blue-700 transition-colors">
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
              className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-50 border border-amber-200 hover:border-amber-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">😵</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 uppercase">
                  Hard
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-amber-700 transition-colors">
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
              className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-500/20 border border-rose-200 hover:border-rose-500/60 text-left space-y-2 group transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">❌</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 uppercase">
                  Failed
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-rose-700 transition-colors">
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
            <div className="p-4 rounded-2xl bg-white border border-emerald-500/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Revision Recorded! 🔥</h3>
              <p className="text-xs text-slate-500">
                Next revision scheduled for <span className="text-emerald-600 font-extrabold">{ratedRecord.nextRevisionDateFormatted}</span> ({ratedRecord.interval} day interval).
              </p>
            </div>

            {/* Upcoming Revision Timeline Preview */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Calculated Revision Schedule:</span>
                <span className="text-purple-600 text-[11px]">Last Attempt: {ratedRecord.lastAttemptedFormatted}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1">
                {ratedRecord.scheduledDates.map((dateStr, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl border shrink-0 text-center space-y-0.5 ${
                      idx === 0
                        ? 'bg-purple-50 border-purple-500/50 text-purple-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-500 text-xs'
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
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-200"
            >
              Continue Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
