import React from 'react';
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  ChevronRight,
  Zap,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react';
import { ExampleTrace } from '../../types';
import { useAlgorithmTrace } from '../../hooks/useAlgorithmTrace';

interface InteractiveTraceVisualizerProps {
  exampleTrace: ExampleTrace;
  algorithmId: string;
}

export const InteractiveTraceVisualizer: React.FC<InteractiveTraceVisualizerProps> = ({
  exampleTrace,
  algorithmId,
}) => {
  const totalSteps = exampleTrace.traceSteps.length;
  const {
    currentStepIdx,
    isPlaying,
    togglePlay,
    traceMode,
    setTraceMode,
    handleNext,
    handlePrev,
    handleReset,
    setCurrentStepIdx,
    setIsPlaying,
  } = useAlgorithmTrace(totalSteps);

  const handleJumpStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setIsPlaying(false);
  };

  const activeStepText = exampleTrace.traceSteps[currentStepIdx] || '';
  const isFinalStep =
    currentStepIdx === totalSteps - 1 ||
    activeStepText.toLowerCase().includes('final') ||
    activeStepText.toLowerCase().includes('result');

  return (
    <div className="space-y-3 pt-3 border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
            <Terminal size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-2">
              <span>🧪 Interactive Step-by-Step Dry Run</span>
              {isPlaying && (
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Auto Playing
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">Step-by-step state trace on sample input</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800">
            Step {currentStepIdx + 1} / {totalSteps}
          </span>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => setTraceMode('stepper')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                traceMode === 'stepper'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap size={12} /> Stepper
            </button>
            <button
              onClick={() => setTraceMode('grid')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                traceMode === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={12} /> Grid
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#090E1A] via-[#0D1527] to-[#080C17] border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Play size={12} className="text-cyan-400" /> Sample Input
            </div>
            <div className="text-xs font-mono font-bold text-cyan-100 bg-slate-900/90 px-3 py-2 rounded-lg border border-cyan-500/20 break-all select-all shadow-inner">
              {exampleTrace.input}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/40 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-400" /> Final Output
            </div>
            <div className="text-xs font-mono font-bold text-emerald-200 bg-slate-900/90 px-3 py-2 rounded-lg border border-emerald-500/20 break-all select-all shadow-inner">
              {exampleTrace.output}
            </div>
          </div>
        </div>

        {traceMode === 'stepper' && (
          <div className="space-y-3.5 pt-1">
            <div className="p-2.5 rounded-xl bg-[#060A14] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleJumpStep(0)}
                  disabled={currentStepIdx === 0}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition-all text-xs"
                  title="First Step"
                >
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={handlePrev}
                  disabled={currentStepIdx === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs disabled:opacity-40 border border-slate-800 transition-all"
                >
                  <ChevronRight size={14} className="rotate-180" /> Prev
                </button>

                <button
                  onClick={togglePlay}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                    isPlaying
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={14} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={14} /> Auto Play
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStepIdx === totalSteps - 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs disabled:opacity-40 border border-slate-800 transition-all"
                >
                  Next <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => handleJumpStep(totalSteps - 1)}
                  disabled={currentStepIdx === totalSteps - 1}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition-all text-xs"
                  title="Last Step"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs font-medium transition-all"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 rounded-full shadow-md shadow-cyan-500/30"
                  style={{ width: `${((currentStepIdx + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar text-xs">
              {exampleTrace.traceSteps.map((_, idx) => {
                const isCurrent = idx === currentStepIdx;
                const isPassed = idx < currentStepIdx;
                const isFinal = idx === totalSteps - 1;

                return (
                  <button
                    key={idx}
                    onClick={() => handleJumpStep(idx)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-extrabold shrink-0 transition-all ${
                      isCurrent
                        ? isFinal
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-105'
                          : 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-105'
                        : isPassed
                        ? 'bg-slate-900 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-950 text-slate-500 border border-slate-800/80 hover:text-slate-300'
                    }`}
                  >
                    Step {idx + 1}
                  </button>
                );
              })}
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all animate-fadeIn ${
                isFinalStep
                  ? 'bg-gradient-to-br from-[#061D15] via-[#0A261C] to-[#05140F] border-emerald-500/60 shadow-2xl shadow-emerald-500/10'
                  : 'bg-gradient-to-br from-[#060D1A] via-[#0A1428] to-[#070D19] border-cyan-500/50 shadow-2xl shadow-cyan-500/10'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-1.5 font-mono ${
                    isFinalStep
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {isFinalStep ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Step {currentStepIdx + 1}: Final Execution Result</span>
                    </>
                  ) : (
                    <>
                      <Zap size={13} className="text-cyan-400" />
                      <span>Step {currentStepIdx + 1} of {totalSteps}</span>
                    </>
                  )}
                </span>

                <span className="text-[11px] text-slate-400 font-mono">
                  Progress: {Math.round(((currentStepIdx + 1) / totalSteps) * 100)}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm font-mono text-slate-100 leading-relaxed tracking-wide shadow-inner select-all">
                {activeStepText}
              </div>
            </div>
          </div>
        )}

        {traceMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
            {exampleTrace.traceSteps.map((tStep, tIdx) => {
              const isFinal = tIdx === totalSteps - 1;
              return (
                <div
                  key={tIdx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                    isFinal
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 border-l-4 border-l-emerald-400'
                      : 'bg-[#060A14]/90 border-slate-800/90 border-l-4 border-l-cyan-500/60 text-slate-200'
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold shrink-0 mt-0.5 ${
                      isFinal ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    Step {tIdx + 1}
                  </span>
                  <span className="text-xs font-mono leading-relaxed">{tStep}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
