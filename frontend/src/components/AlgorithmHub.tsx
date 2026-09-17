import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  HelpCircle,
  Zap,
  Target,
  Clock,
  Cpu,
  Building,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  FolderTree,
  SlidersHorizontal,
  Filter,
  Terminal,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  LayoutGrid
} from 'lucide-react';
import { BigOComplexityChart } from './common/BigOComplexityChart';

export interface CodeTemplate {
  language: 'python' | 'cpp' | 'java' | 'javascript';
  code: string;
}

export interface WAnswers {
  whatItSolves: string;
  whenToUse: string;
  whereUsed: string;
  whyOptimal: string;
}

export interface PracticeProblem {
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ExampleTrace {
  input: string;
  output: string;
  traceSteps: string[];
}

export interface Algorithm {
  id: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  summary: string;
  explanation: string[];
  exampleTrace?: ExampleTrace;
  wAnswers: WAnswers;
  codeTemplates: CodeTemplate[];
  practiceProblems: PracticeProblem[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface AlgorithmsMasterData {
  categories: Category[];
  algorithms: Algorithm[];
}

interface InteractiveTraceVisualizerProps {
  exampleTrace: ExampleTrace;
  algorithmId: string;
}

export const InteractiveTraceVisualizer: React.FC<InteractiveTraceVisualizerProps> = ({ exampleTrace, algorithmId }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [traceMode, setTraceMode] = useState<'stepper' | 'grid'>('stepper');

  const totalSteps = exampleTrace.traceSteps.length;

  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [algorithmId]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, totalSteps]);

  const handleNextStep = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleJumpStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const toggleAutoPlay = () => {
    if (currentStepIdx >= totalSteps - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying((prev) => !prev);
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
                  onClick={handlePrevStep}
                  disabled={currentStepIdx === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs disabled:opacity-40 border border-slate-800 transition-all"
                >
                  <ChevronRight size={14} className="rotate-180" /> Prev
                </button>

                <button
                  onClick={toggleAutoPlay}
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
                  onClick={handleNextStep}
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

const renderCategoryIcon = (iconName?: string, size: number = 14) => {
  switch (iconName) {
    case 'Layers':
      return <Layers size={size} className="shrink-0 text-cyan-400" />;
    case 'Terminal':
      return <Terminal size={size} className="shrink-0 text-emerald-400" />;
    case 'Target':
      return <Target size={size} className="shrink-0 text-rose-400" />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal size={size} className="shrink-0 text-amber-400" />;
    case 'FolderTree':
      return <FolderTree size={size} className="shrink-0 text-indigo-400" />;
    case 'Cpu':
      return <Cpu size={size} className="shrink-0 text-blue-400" />;
    case 'Zap':
      return <Zap size={size} className="shrink-0 text-amber-300" />;
    case 'RotateCcw':
      return <RotateCcw size={size} className="shrink-0 text-pink-400" />;
    case 'Building':
      return <Building size={size} className="shrink-0 text-purple-400" />;
    default:
      return <Sparkles size={size} className="shrink-0 text-cyan-400" />;
  }
};

export const AlgorithmHub: React.FC = () => {
  const [data, setData] = useState<AlgorithmsMasterData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // View Mode: 'split' (Master-Detail Workbench) | 'accordion' (Category Accordions)
  const [viewMode, setViewMode] = useState<'split' | 'accordion'>('split');

  // Topic Category Filter ('all' or category ID like 'arrays_math', 'graphs', etc.)
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  
  // Currently selected algorithm for Split Master-Detail View
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('kadanes-algorithm');

  // Expanded Topic Categories state for Accordion mode (topic ID -> boolean)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    arrays_math: true,
    strings: true,
    linked_list: true,
    stack_queue: true,
    trees: true,
    graphs: true,
    dp: true,
    bit_manipulation: true
  });

  // Expanded Inner Algorithm Cards state for Accordion mode (algorithm ID -> boolean)
  const [expandedAlgos, setExpandedAlgos] = useState<Record<string, boolean>>({
    'kadanes-algorithm': true
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeCodeLang, setActiveCodeLang] = useState<Record<string, 'python' | 'cpp' | 'java' | 'javascript'>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Primary fetch: Load directly from modular category files in /data/algorithms/
  useEffect(() => {
    fetch('/data/algorithms/index.json')
      .then((res) => {
        if (!res.ok) {
          return fetch('data/algorithms/index.json').then((r) => {
            if (!r.ok) throw new Error(`HTTP error ${r.status}`);
            return r.json();
          });
        }
        return res.json();
      })
      .then(async (idx: { categories: (Category & { file: string })[] }) => {
        const allCategories: Category[] = idx.categories.map(({ id, title, icon, description }) => ({ id, title, icon, description }));
        const allAlgorithms: Algorithm[] = [];

        await Promise.all(
          idx.categories.map((cat) =>
            fetch(`/data/algorithms/${cat.file}`)
              .then((r) => {
                if (!r.ok) return fetch(`data/algorithms/${cat.file}`).then((res) => res.json());
                return r.json();
              })
              .then((catData: { algorithms: Algorithm[] }) => {
                if (catData && catData.algorithms) {
                  allAlgorithms.push(...catData.algorithms);
                }
              })
              .catch((e) => console.error(`Error loading category file ${cat.file}:`, e))
          )
        );

        setData({ categories: allCategories, algorithms: allAlgorithms });
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('/data/algorithms/index.json not found, attempting fallback to algorithms_master.json', err);
        fetch('/data/algorithms/algorithms_master.json')
          .then((res) => res.json())
          .then((json: AlgorithmsMasterData) => {
            setData(json);
            setIsLoading(false);
          })
          .catch((finalErr) => {
            console.error('Failed to load algorithms data:', finalErr);
            setIsLoading(false);
          });
      });
  }, []);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const expandAllCategories = () => {
    if (!data) return;
    const allState: Record<string, boolean> = {};
    data.categories.forEach((c) => {
      allState[c.id] = true;
    });
    setExpandedCategories(allState);
  };

  const collapseAllCategories = () => {
    setExpandedCategories({});
  };

  const toggleAlgoExpand = (algoId: string) => {
    setExpandedAlgos((prev) => ({
      ...prev,
      [algoId]: !prev[algoId]
    }));
  };

  const getCodeLang = (algoId: string): 'python' | 'cpp' | 'java' | 'javascript' => {
    return activeCodeLang[algoId] || 'python';
  };

  const setCodeLang = (algoId: string, lang: 'python' | 'cpp' | 'java' | 'javascript') => {
    setActiveCodeLang((prev) => ({ ...prev, [algoId]: lang }));
  };

  const handleCopyCode = (algoId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(algoId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Algorithm counts by category
  const categoryCounts = useMemo(() => {
    if (!data) return {};
    const counts: Record<string, number> = { all: data.algorithms.length };
    data.categories.forEach((cat) => {
      counts[cat.id] = data.algorithms.filter((a) => a.categoryId === cat.id).length;
    });
    return counts;
  }, [data]);

  // Filtered algorithms list for navigation
  const filteredAlgorithms = useMemo(() => {
    if (!data) return [];
    return data.algorithms.filter((algo) => {
      if (selectedTopicFilter !== 'all' && algo.categoryId !== selectedTopicFilter) {
        return false;
      }
      if (selectedDifficulty !== 'all' && algo.difficulty !== selectedDifficulty) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = algo.title.toLowerCase().includes(q);
        const matchesCategory = algo.categoryTitle.toLowerCase().includes(q);
        const matchesSummary = algo.summary.toLowerCase().includes(q);
        const matchesW =
          algo.wAnswers.whatItSolves.toLowerCase().includes(q) ||
          algo.wAnswers.whenToUse.toLowerCase().includes(q) ||
          algo.wAnswers.whereUsed.toLowerCase().includes(q);

        if (!matchesTitle && !matchesCategory && !matchesSummary && !matchesW) {
          return false;
        }
      }
      return true;
    });
  }, [data, selectedTopicFilter, selectedDifficulty, searchQuery]);

  // Ensure active selected algorithm is valid when filtered list changes
  useEffect(() => {
    if (filteredAlgorithms.length > 0) {
      const exists = filteredAlgorithms.some((a) => a.id === selectedAlgoId);
      if (!exists) {
        setSelectedAlgoId(filteredAlgorithms[0].id);
      }
    }
  }, [filteredAlgorithms]);

  // Currently active selected algorithm object
  const activeAlgorithm = useMemo(() => {
    if (!data) return null;
    return data.algorithms.find((a) => a.id === selectedAlgoId) || filteredAlgorithms[0] || data.algorithms[0];
  }, [data, selectedAlgoId, filteredAlgorithms]);

  // Group algorithms by Category & Filter by selectedTopicFilter (for Accordion view)
  const categoryGroupedData = useMemo(() => {
    if (!data) return [];
    
    return data.categories
      .filter((cat) => selectedTopicFilter === 'all' || cat.id === selectedTopicFilter)
      .map((cat) => {
        const catAlgos = data.algorithms.filter((algo) => {
          if (algo.categoryId !== cat.id) return false;
          if (selectedDifficulty !== 'all' && algo.difficulty !== selectedDifficulty) {
            return false;
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesTitle = algo.title.toLowerCase().includes(q);
            const matchesCategory = algo.categoryTitle.toLowerCase().includes(q);
            const matchesSummary = algo.summary.toLowerCase().includes(q);
            const matchesW =
              algo.wAnswers.whatItSolves.toLowerCase().includes(q) ||
              algo.wAnswers.whenToUse.toLowerCase().includes(q) ||
              algo.wAnswers.whereUsed.toLowerCase().includes(q);

            if (!matchesTitle && !matchesCategory && !matchesSummary && !matchesW) {
              return false;
            }
          }
          return true;
        });

        return {
          cat,
          algorithms: catAlgos
        };
      })
      .filter((group) => group.algorithms.length > 0);
  }, [data, selectedTopicFilter, selectedDifficulty, searchQuery]);

  const totalAlgorithmsCount = useMemo(() => {
    if (!data) return 0;
    return data.algorithms.length;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Loading Master Algorithms Encyclopedia...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
        Failed to load `algorithms_master.json`. Ensure the JSON file exists in `/data/`.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Sleek Compact Header & View Switcher Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0D1527] via-[#0B0F1B] to-[#141C36] border border-slate-800/90 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-extrabold">
              <Sparkles size={13} className="text-cyan-400 animate-pulse" />
              <span>Master Algorithm Encyclopedia</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-cyan-300 border border-slate-800 font-mono text-[11px] font-bold">
              {totalAlgorithmsCount} Algorithms
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Algorithm Workbench & W-Guide
          </h1>
          <p className="text-xs text-slate-300">
            Explore algorithms with intuition, step-by-step logic, multi-language code templates, and 4 W-Answers (What, When, Where, Why).
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="relative z-10 flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/90 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'split'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Interactive Split View</span>
          </button>
          <button
            onClick={() => setViewMode('accordion')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'accordion'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree size={14} />
            <span>Accordion List View</span>
          </button>
        </div>
      </div>

      {/* Visual Big-O Time Complexity Interactive Growth Graph */}
      <BigOComplexityChart />

      {/* 2. Topic Category Filter Pill Buttons */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0D1322]/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <FolderTree size={14} />
            <span>Filter by Topic Category:</span>
          </span>
          {selectedTopicFilter !== 'all' && (
            <button
              onClick={() => setSelectedTopicFilter('all')}
              className="text-[11px] text-cyan-400 hover:underline font-semibold"
            >
              Reset to All Topics
            </button>
          )}
        </div>

        {/* Clean Topic Buttons Grid */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedTopicFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              selectedTopicFilter === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 scale-[1.02] border border-cyan-400/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🌐 All Topics</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-950 text-[10px] font-mono border border-slate-700">
              {categoryCounts.all || 0}
            </span>
          </button>

          {data.categories.map((cat) => {
            const isSelected = selectedTopicFilter === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedTopicFilter(cat.id);
                  const firstAlgo = data.algorithms.find((a) => a.categoryId === cat.id);
                  if (firstAlgo) {
                    setSelectedAlgoId(firstAlgo.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02] border border-cyan-400/40'
                    : 'bg-slate-950/90 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/90'
                }`}
              >
                {renderCategoryIcon(cat.icon, 14)}
                <span>{cat.title}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono border font-bold ${
                    isSelected ? 'bg-slate-950 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE SPLIT WORKBENCH VIEW */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Algorithm Selector Navigation Menu (Width: 5/12 on lg, 4/12 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#0D1322]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-4.5 space-y-3.5 shadow-xl sticky top-20 max-h-[82vh] flex flex-col overflow-hidden">
            {/* Search & Difficulty Filter Header */}
            <div className="space-y-2 pb-2.5 border-b border-slate-800 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search algorithm or concept..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-xl pl-9 pr-7 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Difficulty Filter Pills */}
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`flex-1 py-1 rounded-lg text-center transition-all ${
                    selectedDifficulty === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedDifficulty('Easy')}
                  className={`flex-1 py-1 rounded-lg text-center transition-all ${
                    selectedDifficulty === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setSelectedDifficulty('Medium')}
                  className={`flex-1 py-1 rounded-lg text-center transition-all ${
                    selectedDifficulty === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Med
                </button>
                <button
                  onClick={() => setSelectedDifficulty('Hard')}
                  className={`flex-1 py-1 rounded-lg text-center transition-all ${
                    selectedDifficulty === 'Hard'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>

            {/* Algorithm Selector List (Pr-2 to avoid clipping borders with scrollbar) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-2 custom-scrollbar">
              {filteredAlgorithms.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No algorithms found for search/filter criteria.
                </div>
              ) : (
                filteredAlgorithms.map((algo) => {
                  const isSelected = algo.id === selectedAlgoId;
                  const catObj = data.categories.find((c) => c.id === algo.categoryId);

                  return (
                    <button
                      key={algo.id}
                      onClick={() => setSelectedAlgoId(algo.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between gap-2.5 group box-border ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#0F1D38] via-[#102447] to-[#0F1D38] border-2 border-cyan-400/90 text-white shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950/80 hover:bg-slate-900 border border-slate-800/90 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0 flex items-center gap-2.5 flex-1">
                        {renderCategoryIcon(catObj?.icon, 15)}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold truncate group-hover:text-cyan-300 transition-colors">
                            {algo.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                algo.difficulty === 'Easy'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : algo.difficulty === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {algo.difficulty}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300 truncate max-w-[140px]">
                              ⏱️ {algo.timeComplexity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        size={15}
                        className={`shrink-0 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`}
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Main Interactive Algorithm Workbench (Width: 7/12 on lg, 8/12 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {activeAlgorithm ? (
              <div className="bg-[#0D1322]/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8 animate-fadeIn">
                {/* Algorithm Stage Header */}
                <div className="pb-5 border-b border-slate-800/90 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                      {renderCategoryIcon(data.categories.find((c) => c.id === activeAlgorithm.categoryId)?.icon, 14)}
                      <span>{activeAlgorithm.categoryTitle}</span>
                    </span>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                          activeAlgorithm.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : activeAlgorithm.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {activeAlgorithm.difficulty}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800 font-bold">
                        ⏱️ Time: {activeAlgorithm.timeComplexity}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-purple-300 border border-slate-800 font-bold">
                        💾 Space: {activeAlgorithm.spaceComplexity}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Code2 className="text-cyan-400" size={28} />
                    <span>{activeAlgorithm.title}</span>
                  </h2>
                </div>

                {/* Core Intuition Box */}
                <div className="p-4 rounded-2xl border-l-4 border-l-cyan-400 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-[#0A0F1D] border-y border-r border-cyan-500/20 shadow-xl space-y-1.5">
                  <span className="font-extrabold text-cyan-300 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Lightbulb size={16} className="text-amber-400 animate-pulse" />
                    <span>Core Intuition & Key Overview</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{activeAlgorithm.summary}</p>
                </div>

                {/* Step-by-Step Logic */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={15} className="text-cyan-400" />
                    <span>Step-by-Step Logic</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    {activeAlgorithm.explanation.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#0B1120] border-l-2 border-l-cyan-500/60 border border-slate-800/90 flex items-start gap-3 text-slate-200 leading-relaxed hover:border-slate-700 transition-all shadow-sm"
                      >
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-[11px] flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-200">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Sample Input & Step-by-Step Execution Dry Run */}
                {activeAlgorithm.exampleTrace && (
                  <InteractiveTraceVisualizer
                    exampleTrace={activeAlgorithm.exampleTrace}
                    algorithmId={activeAlgorithm.id}
                  />
                )}

                {/* 4 W-Answers Cards */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle size={15} className="text-purple-400" />
                    <span>All W-Answers (What, When, Where, Why)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-[#0B132B] to-[#080D1A] border border-blue-500/30 space-y-2 shadow-xl hover:border-blue-400/60 transition-all">
                      <span className="font-extrabold text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Target size={14} /> 1. What Problem Does It Solve?
                      </span>
                      <p className="text-slate-200 leading-relaxed font-normal">{activeAlgorithm.wAnswers.whatItSolves}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#1F180A] to-[#080D1A] border border-amber-500/30 space-y-2 shadow-xl hover:border-amber-400/60 transition-all">
                      <span className="font-extrabold text-amber-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Sparkles size={14} /> 2. When to Use It? (Pattern Triggers)
                      </span>
                      <p className="text-slate-200 leading-relaxed font-normal">{activeAlgorithm.wAnswers.whenToUse}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0A1F18] to-[#080D1A] border border-emerald-500/30 space-y-2 shadow-xl hover:border-emerald-400/60 transition-all">
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Building size={14} /> 3. Where is it Used in Production?
                      </span>
                      <p className="text-slate-200 leading-relaxed font-normal">{activeAlgorithm.wAnswers.whereUsed}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#1A0B2B] to-[#080D1A] border border-purple-500/30 space-y-2 shadow-xl hover:border-purple-400/60 transition-all">
                      <span className="font-extrabold text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Clock size={14} /> 4. Why is it Optimal? (Big-O Analysis)
                      </span>
                      <p className="text-slate-200 leading-relaxed font-normal">{activeAlgorithm.wAnswers.whyOptimal}</p>
                    </div>
                  </div>
                </div>

                {/* VS Code IDE Editor Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Code2 size={15} className="text-emerald-400" />
                      <span>Code Implementation</span>
                    </h3>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold shadow-inner">
                      {activeAlgorithm.codeTemplates.map((tmpl) => {
                        const curLang = getCodeLang(activeAlgorithm.id);
                        return (
                          <button
                            key={tmpl.language}
                            onClick={() => setCodeLang(activeAlgorithm.id, tmpl.language)}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              curLang === tmpl.language
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-extrabold scale-[1.02]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            {tmpl.language === 'python' && '🐍 Python'}
                            {tmpl.language === 'cpp' && '⚡ C++'}
                            {tmpl.language === 'java' && '☕ Java'}
                            {tmpl.language === 'javascript' && '🟨 JS'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {(() => {
                    const curLang = getCodeLang(activeAlgorithm.id);
                    const activeCodeObj = activeAlgorithm.codeTemplates.find((c) => c.language === curLang) || activeAlgorithm.codeTemplates[0];

                    if (!activeCodeObj) return null;

                    return (
                      <div className="relative rounded-2xl bg-[#04060E] border border-slate-800/90 overflow-hidden shadow-2xl">
                        {/* IDE Window Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A0E1A] border-b border-slate-800 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <span className="text-[11px] text-slate-400 ml-2 font-semibold">
                              solution.{activeCodeObj.language === 'python' ? 'py' : activeCodeObj.language === 'cpp' ? 'cpp' : activeCodeObj.language === 'java' ? 'java' : 'js'}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopyCode(activeAlgorithm.id, activeCodeObj.code)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800 text-xs font-sans font-bold"
                          >
                            {copiedCodeId === activeAlgorithm.id ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Code Gutter & Block */}
                        <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed flex items-start">
                          <div className="flex flex-col text-slate-600 select-none pr-4 border-r border-slate-800/80 text-right font-bold text-[11px]">
                            {activeCodeObj.code.split('\n').map((_, i) => (
                              <span key={i}>{i + 1}</span>
                            ))}
                          </div>
                          <pre className="pl-4 text-cyan-200">
                            <code>{activeCodeObj.code}</code>
                          </pre>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Practice Problems */}
                {activeAlgorithm.practiceProblems && activeAlgorithm.practiceProblems.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-3">
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <ExternalLink size={13} className="text-amber-400" />
                      <span>Practice Problems & Verification</span>
                    </span>
                    <div className="flex items-center gap-2.5 flex-wrap text-xs">
                      {activeAlgorithm.practiceProblems.map((prob, pIdx) => (
                        <a
                          key={pIdx}
                          href={prob.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#090D18] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 transition-all text-xs font-medium shadow-md hover:-translate-y-0.5"
                        >
                          <span className="font-bold text-white">{prob.title}</span>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                          <ExternalLink size={12} className="text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#0D1322]/80 border border-slate-800 rounded-2xl text-slate-400">
                Select an algorithm from the left navigation panel to view details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CATEGORY ACCORDION VIEW */}
      {viewMode === 'accordion' && (
        <div className="space-y-4">
          {categoryGroupedData.length === 0 ? (
            <div className="p-8 text-center bg-[#0D1322]/80 border border-slate-800 rounded-2xl text-slate-400 space-y-2">
              <HelpCircle size={32} className="mx-auto text-slate-500" />
              <p className="font-bold text-slate-300">No algorithms found matching criteria.</p>
            </div>
          ) : (
            categoryGroupedData.map(({ cat, algorithms }) => {
              const isCatExpanded = !!expandedCategories[cat.id] || selectedTopicFilter !== 'all' || !!searchQuery.trim();

              return (
                <div
                  key={cat.id}
                  className="bg-[#0D1322]/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-slate-700"
                >
                  <button
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0D1322] via-[#0F172A] to-[#0D1322] hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-all shadow-md">
                        {renderCategoryIcon(cat.icon, 20)}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                          <span>{cat.title}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-950 text-cyan-300 border border-slate-800">
                            {algorithms.length} Algorithms
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300">
                        {isCatExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                    </div>
                  </button>

                  {isCatExpanded && (
                    <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#0A0E1A] space-y-4 animate-fadeIn">
                      {algorithms.map((algo) => {
                        const isAlgoExpanded = !!expandedAlgos[algo.id] || !!searchQuery.trim();
                        const currentLang = getCodeLang(algo.id);
                        const activeCodeObj = algo.codeTemplates.find((c) => c.language === currentLang) || algo.codeTemplates[0];

                        return (
                          <div
                            key={algo.id}
                            className="bg-[#0D1322] border border-slate-800/90 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-slate-700"
                          >
                            <button
                              onClick={() => toggleAlgoExpand(algo.id)}
                              className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0E1526] hover:bg-slate-800/50 transition-all text-left group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                                  <Code2 size={17} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                                      {algo.title}
                                    </h4>
                                    <span
                                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                                        algo.difficulty === 'Easy'
                                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                          : algo.difficulty === 'Medium'
                                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                      }`}
                                    >
                                      {algo.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{algo.summary}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="px-2 py-0.5 rounded-md bg-slate-950 text-cyan-300 border border-slate-800 font-bold text-[11px] font-mono">
                                  ⏱️ {algo.timeComplexity}
                                </span>
                                <div className="w-7 h-7 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300">
                                  {isAlgoExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                </div>
                              </div>
                            </button>

                            {isAlgoExpanded && (
                              <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-[#060913] space-y-6 animate-fadeIn">
                                {/* Summary Box */}
                                <div className="p-4 rounded-r-2xl border-l-4 border-l-cyan-400 bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-[#0A0F1D] border-y border-r border-cyan-500/20 shadow-lg space-y-1.5">
                                  <span className="font-extrabold text-cyan-300 flex items-center gap-2 text-xs uppercase tracking-wider">
                                    <Lightbulb size={15} className="text-amber-400 animate-pulse" />
                                    <span>Core Intuition & Key Overview</span>
                                  </span>
                                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{algo.summary}</p>
                                </div>

                                {/* Step-by-Step Logic */}
                                <div className="space-y-3">
                                  <h5 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <Zap size={14} className="text-cyan-400" />
                                    <span>Step-by-Step Logic</span>
                                  </h5>
                                  <div className="grid grid-cols-1 gap-2 text-xs">
                                    {algo.explanation.map((step, idx) => (
                                      <div
                                        key={idx}
                                        className="p-3.5 rounded-xl bg-[#0B1120] border-l-2 border-l-cyan-500/60 border border-slate-800/90 flex items-start gap-3 text-slate-200 leading-relaxed hover:border-slate-700 transition-all shadow-sm"
                                      >
                                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-[11px] flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0 mt-0.5">
                                          {idx + 1}
                                        </span>
                                        <span className="font-medium text-slate-200">{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Interactive Sample Input & Step-by-Step Execution Dry Run */}
                                {algo.exampleTrace && (
                                  <InteractiveTraceVisualizer
                                    exampleTrace={algo.exampleTrace}
                                    algorithmId={algo.id}
                                  />
                                )}

                                {/* 4 W-Answers Cards */}
                                <div className="space-y-3">
                                  <h5 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <HelpCircle size={14} className="text-purple-400" />
                                    <span>All W-Answers (What, When, Where, Why)</span>
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-[#0B132B] to-[#080D1A] border border-blue-500/30 space-y-2 shadow-xl hover:border-blue-400/60 transition-all">
                                      <span className="font-extrabold text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                        <Target size={14} /> 1. What Problem Does It Solve?
                                      </span>
                                      <p className="text-slate-200 leading-relaxed font-normal">{algo.wAnswers.whatItSolves}</p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#1F180A] to-[#080D1A] border border-amber-500/30 space-y-2 shadow-xl hover:border-amber-400/60 transition-all">
                                      <span className="font-extrabold text-amber-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                        <Sparkles size={14} /> 2. When to Use It? (Pattern Triggers)
                                      </span>
                                      <p className="text-slate-200 leading-relaxed font-normal">{algo.wAnswers.whenToUse}</p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0A1F18] to-[#080D1A] border border-emerald-500/30 space-y-2 shadow-xl hover:border-emerald-400/60 transition-all">
                                      <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                        <Building size={14} /> 3. Where is it Used in Production?
                                      </span>
                                      <p className="text-slate-200 leading-relaxed font-normal">{algo.wAnswers.whereUsed}</p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#1A0B2B] to-[#080D1A] border border-purple-500/30 space-y-2 shadow-xl hover:border-purple-400/60 transition-all">
                                      <span className="font-extrabold text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                        <Clock size={14} /> 4. Why is it Optimal? (Big-O Analysis)
                                      </span>
                                      <p className="text-slate-200 leading-relaxed font-normal">{algo.wAnswers.whyOptimal}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Code Editor Block */}
                                {activeCodeObj && (
                                  <div className="relative rounded-2xl bg-[#04060E] border border-slate-800/90 overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A0E1A] border-b border-slate-800 text-xs font-mono">
                                      <span>solution.{activeCodeObj.language}</span>
                                      <button
                                        onClick={() => handleCopyCode(algo.id, activeCodeObj.code)}
                                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs"
                                      >
                                        Copy Code
                                      </button>
                                    </div>
                                    <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                                      <code>{activeCodeObj.code}</code>
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
