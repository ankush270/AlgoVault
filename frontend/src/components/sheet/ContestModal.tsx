import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, Timer, CheckCircle2, Circle, Flame, ArrowRight } from 'lucide-react';
import { StriverProblem } from './types';

interface ContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  problems: StriverProblem[];
  contestInfo?: { title?: string; problemCount: number; duration: string };
  solvedStatus: Record<string, boolean>;
  toggleSolved: (id: string) => void;
}

export const ContestModal: React.FC<ContestModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  problems,
  contestInfo,
  solvedStatus,
  toggleSolved,
}) => {
  const problemCount = contestInfo?.problemCount || Math.min(3, problems.length);
  const [contestStarted, setContestStarted] = useState(false);
  const [contestProblems, setContestProblems] = useState<StriverProblem[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(7200); // 2 hours default in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pick random problem set for contest
      const shuffled = [...problems].sort(() => 0.5 - Math.random());
      setContestProblems(shuffled.slice(0, problemCount));
      setContestStarted(false);
      setTimeLeft(7200);
      setIsSubmitted(false);
    }
  }, [isOpen, problems, problemCount]);

  useEffect(() => {
    let timer: any = null;
    if (contestStarted && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [contestStarted, timeLeft, isSubmitted]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const solvedInContest = contestProblems.filter((p) => solvedStatus[p.id]).length;
  const contestScore = Math.round((solvedInContest / Math.max(1, contestProblems.length)) * 100);

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-cyan-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-600 shrink-0">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{topicTitle} Contest</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 font-bold border border-cyan-200">
                  Striver Official
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {problemCount} Problems • {contestInfo?.duration || '2 hours'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!contestStarted ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-200 flex items-center justify-center text-amber-600">
                <Flame size={40} className="animate-pulse" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Ready for the Striver Assessment?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Test your real speed and problem solving accuracy on {topicTitle}. You will be assigned {problemCount} curated problems with a {contestInfo?.duration || '2 hours'} timer.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <Timer size={14} className="text-cyan-600" /> 2 Hours Time
                </span>
                <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <Trophy size={14} className="text-amber-600" /> {problemCount} Target Problems
                </span>
              </div>

              <button
                onClick={() => setContestStarted(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-cyan-200 transition-all hover:scale-105"
              >
                <span>Start Contest Now</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timer Bar */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <Timer className="text-cyan-600 animate-spin" size={18} />
                  <span>Time Remaining:</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-cyan-600 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-200">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Problem List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contest Problem Set ({solvedInContest}/{contestProblems.length} Completed)</h4>
                {contestProblems.map((prob, index) => {
                  const isDone = !!solvedStatus[prob.id];
                  return (
                    <div
                      key={prob.id}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSolved(prob.id)}
                          className="shrink-0 p-1 hover:bg-slate-100 rounded-xl"
                        >
                          {isDone ? (
                            <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-500/20" />
                          ) : (
                            <Circle size={22} className="text-slate-500" />
                          )}
                        </button>
                        <div>
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-slate-600 hover:text-cyan-700 hover:underline"
                          >
                            {index + 1}. {prob.title}
                          </a>
                          <div className="flex items-center gap-2 pt-1">
                            {prob.striver_level && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-700">
                                {prob.striver_level}
                              </span>
                            )}
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400">
                              {prob.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={prob.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-bold bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-xl hover:bg-cyan-500/20 transition-all shrink-0"
                      >
                        Solve
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Contest Finish Summary */}
              {isSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <h4 className="text-base font-extrabold text-emerald-600">Contest Submitted! 🎉</h4>
                  <p className="text-xs text-slate-500">
                    You scored {contestScore}% ({solvedInContest}/{contestProblems.length} solved).
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setIsSubmitted(true)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl transition-all shadow-lg shadow-emerald-200"
                >
                  Submit Contest
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
