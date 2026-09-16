import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  ExternalLink,
  Lightbulb,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Tag,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  BrainCircuit,
  Bookmark,
  BookOpen,
  PieChart,
  LayoutGrid,
  List,
  Flame,
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  Award,
  BarChart3,
  Globe,
  Compass
} from 'lucide-react';

export interface LeetCodeCompany {
  name: string;
  frequency: number | null;
}

export interface LeetCodeQuestion {
  id: number | string;
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  acceptance: number | null;
  companies: LeetCodeCompany[];
  tags?: string[];
  category?: string;
  pattern?: string;
  time_complexity?: string;
  space_complexity?: string;
  hint?: string;
  ai_enriched?: boolean;
}

interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface CustomDropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (val: T) => void;
  icon?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

function CustomDropdown<T extends string = string>({
  options,
  value,
  onChange,
  icon,
  searchable = false,
  searchPlaceholder = 'Search options...',
  className = ''
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchable || !filterQuery.trim()) return options;
    const q = filterQuery.toLowerCase().trim();
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [options, searchable, filterQuery]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 bg-slate-950/90 border px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          isOpen
            ? 'border-cyan-500/80 ring-1 ring-cyan-500/50 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.25)]'
            : 'border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon || selectedOption?.icon}
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0D1322]/95 border border-slate-700/80 shadow-2xl rounded-2xl p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 max-h-72 flex flex-col">
          {searchable && (
            <div className="p-1.5 pb-2 border-b border-slate-800 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>
          )}

          <div className="overflow-y-auto max-h-56 space-y-0.5 pt-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-xs text-slate-500 text-center">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setFilterQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-indigo-600/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {opt.badge && (
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const LeetCodeExplorer: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<LeetCodeQuestion[]>([]);
  const [isLoadingDataset, setIsLoadingDataset] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch('/data/leetcode_questions_part1.json').then((res) => res.json()),
      fetch('/data/leetcode_questions_part2.json').then((res) => res.json())
    ])
      .then(([p1, p2]) => {
        if (isMounted) {
          setAllQuestions([...(p1 || []), ...(p2 || [])]);
          setIsLoadingDataset(false);
        }
      })
      .catch((err) => {
        console.error('Error loading public JSON datasets:', err);
        if (isMounted) setIsLoadingDataset(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Mode View Switch: 'questions' | 'companies' | 'patterns'
  const [activeViewMode, setActiveViewMode] = useState<'questions' | 'companies' | 'patterns'>('questions');
  const [layoutStyle, setLayoutStyle] = useState<'grid' | 'table'>('grid');

  // Expand/Collapse States for Filter Chips
  const [isCompaniesExpanded, setIsCompaniesExpanded] = useState<boolean>(false);
  const [isTagsExpanded, setIsTagsExpanded] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'frequency' | 'id' | 'acceptance'>('frequency');

  // Solved & Bookmark State
  const [solvedStatus, setSolvedStatus] = useState<Record<string, 'solved' | 'review' | undefined>>(() => {
    try {
      const saved = localStorage.getItem('leetcode_solved_status');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal & Hint Expansion States
  const [expandedHintId, setExpandedHintId] = useState<number | string | null>(null);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState<string | null>(null);
  const [selectedQuestionDetail, setSelectedQuestionDetail] = useState<LeetCodeQuestion | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = layoutStyle === 'table' ? 30 : 21;

  // Persist solved status
  useEffect(() => {
    try {
      localStorage.setItem('leetcode_solved_status', JSON.stringify(solvedStatus));
    } catch (e) {
      console.error(e);
    }
  }, [solvedStatus]);

  // Aggregate Company Analytics
  const companyAnalytics = useMemo(() => {
    const compMap = new Map<string, { total: number; easy: number; medium: number; hard: number; questions: LeetCodeQuestion[] }>();
    allQuestions.forEach((q) => {
      q.companies?.forEach((c) => {
        const key = c.name.toLowerCase();
        if (!compMap.has(key)) {
          compMap.set(key, { total: 0, easy: 0, medium: 0, hard: 0, questions: [] });
        }
        const data = compMap.get(key)!;
        data.total += 1;
        const diff = q.difficulty.toLowerCase();
        if (diff === 'easy') data.easy += 1;
        else if (diff === 'medium') data.medium += 1;
        else if (diff === 'hard') data.hard += 1;
        data.questions.push(q);
      });
    });

    return Array.from(compMap.entries())
      .map(([name, stat]) => ({ name, ...stat }))
      .sort((a, b) => b.total - a.total);
  }, [allQuestions]);

  // Top Popular Company Quick Filter Chips
  const popularCompanies = [
    { id: 'all', label: 'All Companies' },
    { id: 'amazon', label: 'Amazon', count: 1990 },
    { id: 'google', label: 'Google', count: 1820 },
    { id: 'meta', label: 'Meta', count: 1650 },
    { id: 'microsoft', label: 'Microsoft', count: 1540 },
    { id: 'apple', label: 'Apple', count: 980 },
    { id: 'uber', label: 'Uber', count: 850 },
    { id: 'bloomberg', label: 'Bloomberg', count: 1100 },
    { id: 'adobe', label: 'Adobe', count: 720 },
    { id: 'flipkart', label: 'Flipkart', count: 410 },
    { id: 'accenture', label: 'Accenture', count: 390 },
    { id: 'netflix', label: 'Netflix', count: 350 },
    { id: 'paypal', label: 'PayPal', count: 320 },
    { id: 'walmart-labs', label: 'Walmart', count: 290 },
    { id: 'oracle', label: 'Oracle', count: 280 },
    { id: 'salesforce', label: 'Salesforce', count: 270 },
  ];

  // Topic Tags List
  const popularTags = [
    'All',
    'Array',
    'String',
    'Dynamic Programming',
    'Tree',
    'Graph',
    'Two Pointers',
    'Sliding Window',
    'Stack & Queue',
    'Linked List',
    'Heap / Priority Queue',
    'Matrix',
    'Bit Manipulation',
    'Math',
    'Greedy',
    'Backtracking',
    'Trie',
    'Hash Table'
  ];

  // Algorithmic Patterns List for Patterns Tab
  const patternList = useMemo(() => {
    const pMap = new Map<string, number>();
    allQuestions.forEach((q) => {
      if (q.pattern && q.pattern !== 'N/A') {
        pMap.set(q.pattern, (pMap.get(q.pattern) || 0) + 1);
      }
    });
    return Array.from(pMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [allQuestions]);

  // Dropdown Options Setup
  const companyOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All 659 Companies', icon: <Building2 className="w-4 h-4 text-indigo-400" /> },
      ...companyAnalytics.map((c) => ({
        value: c.name,
        label: c.name.toUpperCase(),
        badge: `${c.total} Qs`
      }))
    ];
  }, [companyAnalytics]);

  const difficultyOptions = [
    { value: 'all', label: 'All Difficulties', icon: <Zap className="w-4 h-4 text-slate-400" /> },
    { value: 'easy', label: 'Easy', icon: <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" /> },
    { value: 'medium', label: 'Medium', icon: <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" /> },
    { value: 'hard', label: 'Hard', icon: <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" /> },
  ];

  const sortByOptions = [
    { value: 'frequency', label: 'Sort: Frequency', icon: <Flame className="w-4 h-4 text-rose-400" /> },
    { value: 'id', label: 'Sort: Problem ID', icon: <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> },
    { value: 'acceptance', label: 'Sort: Acceptance %', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
  ];

  // Toggle status helper
  const toggleStatus = (id: number | string, type: 'solved' | 'review') => {
    setSolvedStatus((prev) => {
      const current = prev[id];
      const next = current === type ? undefined : type;
      return { ...prev, [id]: next };
    });
  };

  // Filtered Questions Logic
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesId = String(q.id).includes(query);
        const matchesCompany = q.companies?.some((c) => c.name.toLowerCase().includes(query));
        const matchesTag = q.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = q.category?.toLowerCase().includes(query);
        const matchesPattern = q.pattern?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesId && !matchesCompany && !matchesTag && !matchesCategory && !matchesPattern) {
          return false;
        }
      }

      if (selectedCompany !== 'all') {
        const hasCompany = q.companies?.some((c) => c.name.toLowerCase() === selectedCompany.toLowerCase());
        if (!hasCompany) return false;
      }

      if (selectedDifficulty !== 'all') {
        if (q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
      }

      if (selectedTag !== 'all') {
        const hasTag = q.tags?.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
        if (!hasTag) return false;
      }

      if (selectedPattern !== 'all') {
        const hasPattern = q.pattern?.toLowerCase().includes(selectedPattern.toLowerCase());
        if (!hasPattern) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'frequency') {
        const aFreq = selectedCompany !== 'all' 
          ? a.companies.find((c) => c.name.toLowerCase() === selectedCompany.toLowerCase())?.frequency || 0
          : a.companies[0]?.frequency || 0;
        const bFreq = selectedCompany !== 'all'
          ? b.companies.find((c) => c.name.toLowerCase() === selectedCompany.toLowerCase())?.frequency || 0
          : b.companies[0]?.frequency || 0;
        return bFreq - aFreq;
      } else if (sortBy === 'acceptance') {
        return (b.acceptance || 0) - (a.acceptance || 0);
      } else {
        return Number(a.id) - Number(b.id);
      }
    });
  }, [allQuestions, searchQuery, selectedCompany, selectedDifficulty, selectedTag, selectedPattern, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCompany, selectedDifficulty, selectedTag, selectedPattern, sortBy, activeViewMode]);

  // Paginated Questions
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Filtered Company List for Companies Tab
  const filteredCompanyList = useMemo(() => {
    if (!searchQuery.trim()) return companyAnalytics;
    const q = searchQuery.toLowerCase().trim();
    return companyAnalytics.filter((c) => c.name.toLowerCase().includes(q));
  }, [companyAnalytics, searchQuery]);

  // Solved Count Stat
  const solvedCount = useMemo(() => {
    return Object.values(solvedStatus).filter((s) => s === 'solved').length;
  }, [solvedStatus]);

  const reviewCount = useMemo(() => {
    return Object.values(solvedStatus).filter((s) => s === 'review').length;
  }, [solvedStatus]);

  return (
    <div className="space-y-6 pb-16 font-['Inter',sans-serif]">
      {/* 🚀 Header Hero Banner with Glowing Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80 p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(99,102,241,0.15)]">
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-2/3 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>LeetCode Companywise Interview Vault (2026 Edition)</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Interview Questions <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Explorer</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Target top tech interviews with <strong className="text-white font-semibold">3,399+ LeetCode problems</strong> categorized across <strong className="text-cyan-400 font-semibold">659 companies</strong> with AI-powered solving intuition, algorithmic patterns, and complexity tags.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-inner">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Questions</p>
                <p className="text-lg font-black text-white">3,399</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-inner">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Companies</p>
                <p className="text-lg font-black text-white">659</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-inner">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solved</p>
                <p className="text-lg font-black text-emerald-400">{solvedCount}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-inner">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review List</p>
                <p className="text-lg font-black text-amber-400">{reviewCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveViewMode('questions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeViewMode === 'questions'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CodeIcon className="w-4 h-4" />
              <span>Questions Directory ({filteredQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveViewMode('companies')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeViewMode === 'companies'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company Hub ({companyAnalytics.length})</span>
            </button>

            <button
              onClick={() => setActiveViewMode('patterns')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeViewMode === 'patterns'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Patterns Guide ({patternList.length})</span>
            </button>
          </div>

          {/* Layout Toggle (Grid vs Table) when in Questions Mode */}
          {activeViewMode === 'questions' && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setLayoutStyle('grid')}
                title="Grid Cards View"
                className={`p-2 rounded-lg transition-all ${
                  layoutStyle === 'grid'
                    ? 'bg-slate-800 text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutStyle('table')}
                title="Compact Table View"
                className={`p-2 rounded-lg transition-all ${
                  layoutStyle === 'table'
                    ? 'bg-slate-800 text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 📊 Top Target Companies Question Frequency Bar Chart & Difficulty Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Top Tech Companies Question Frequency</h3>
                <p className="text-[11px] text-slate-400">Question count distribution across FAANG & Tier-1 tech giants</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {companyAnalytics.slice(0, 5).map((comp) => {
              const maxQuestions = companyAnalytics[0]?.total || 1;
              const pct = Math.round((comp.total / maxQuestions) * 100);

              return (
                <div
                  key={comp.name}
                  onClick={() => {
                    setSelectedCompany(comp.name);
                    setActiveViewMode('questions');
                  }}
                  className="space-y-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                      <Building2 size={13} className="text-slate-400" />
                      <span>{comp.name}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {comp.total} questions ({comp.easy}E / {comp.medium}M / {comp.hard}H)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500 group-hover:from-cyan-400 group-hover:to-emerald-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Donut Breakdown Widget */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <PieChart size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Difficulty Breakdown</h3>
              <p className="text-[11px] text-slate-400">Easy, Medium & Hard distribution</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400">Easy (850+)</span>
                <span className="text-slate-400">25%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-400">Medium (1,800+)</span>
                <span className="text-slate-400">53%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '53%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-400">Hard (740+)</span>
                <span className="text-slate-400">22%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Search & Filter Console */}
      <div className="bg-[#0D1322] border border-slate-800/90 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl relative z-30">
        {/* Search & Select Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, companies (Google, Amazon), topics (DP, Graph)..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Company Searchable Select */}
          <div className="md:col-span-3">
            <CustomDropdown
              options={companyOptions}
              value={selectedCompany}
              onChange={(val) => setSelectedCompany(val)}
              searchable={true}
              searchPlaceholder="Search 659 companies..."
            />
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-2">
            <CustomDropdown
              options={difficultyOptions}
              value={selectedDifficulty}
              onChange={(val) => setSelectedDifficulty(val)}
            />
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <CustomDropdown
              options={sortByOptions}
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
            />
          </div>
        </div>

        {/* Popular Company Pills with Expand/Collapse */}
        <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Top Companies:
            </span>
            <button
              onClick={() => setIsCompaniesExpanded(!isCompaniesExpanded)}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20"
            >
              <span>{isCompaniesExpanded ? 'Collapse ▲' : `Show All (+${popularCompanies.length - 6}) ▼`}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(isCompaniesExpanded ? popularCompanies : popularCompanies.slice(0, 6)).map((c) => {
              const isSelected = selectedCompany.toLowerCase() === c.id.toLowerCase();
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompany(c.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                      : 'bg-slate-950/80 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {c.label} {c.count ? `(${c.count})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Tag Pills with Expand/Collapse */}
        <div className="space-y-2.5 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Topic Tags:
            </span>
            <button
              onClick={() => setIsTagsExpanded(!isTagsExpanded)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20"
            >
              <span>{isTagsExpanded ? 'Collapse ▲' : `More Tags (+${popularTags.length - 7}) ▼`}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(isTagsExpanded ? popularTags : popularTags.slice(0, 7)).map((tag) => {
              const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === 'All' ? 'all' : tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 font-bold'
                      : 'bg-slate-950/80 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== VIEW 1: QUESTIONS DIRECTORY ==================== */}
      {activeViewMode === 'questions' && (
        <div className="space-y-4">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{filteredQuestions.length}</strong> matching questions
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-slate-400 font-medium">
                Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
              </p>
            )}
          </div>

          {/* GRID VIEW */}
          {layoutStyle === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {paginatedQuestions.map((q) => {
                const isSolved = solvedStatus[q.id] === 'solved';
                const isReview = solvedStatus[q.id] === 'review';
                const isHintExpanded = expandedHintId === q.id;

                const diffStyle =
                  q.difficulty.toLowerCase() === 'easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : q.difficulty.toLowerCase() === 'medium'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                return (
                  <div
                    key={q.id}
                    className={`bg-[#0D1322] border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:border-slate-700 hover:shadow-xl ${
                      isSolved
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : isReview
                        ? 'border-amber-500/40 bg-amber-950/10'
                        : 'border-slate-800/90'
                    }`}
                  >
                    {/* Header: ID, Difficulty & Solved Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                            #{q.id}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${diffStyle}`}>
                            {q.difficulty}
                          </span>
                          {q.acceptance && (
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-cyan-400" />
                              {q.acceptance}%
                            </span>
                          )}
                        </div>

                        {/* Solved / Bookmark Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleStatus(q.id, 'solved')}
                            title={isSolved ? 'Mark Unsolved' : 'Mark Solved'}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isSolved
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleStatus(q.id, 'review')}
                            title={isReview ? 'Remove Bookmark' : 'Bookmark Question'}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isReview
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Problem Title & URL */}
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start justify-between gap-2 text-base font-bold text-white hover:text-cyan-400 transition-colors"
                      >
                        <span className="line-clamp-2 leading-snug">{q.title}</span>
                        <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-cyan-400 transition-colors mt-0.5" />
                      </a>

                      {/* Tag Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {q.category && (
                          <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                            {q.category}
                          </span>
                        )}
                        {q.pattern && q.pattern !== 'N/A' && (
                          <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <BrainCircuit className="w-3 h-3 text-purple-400" />
                            {q.pattern}
                          </span>
                        )}
                        {q.tags?.map((t) => (
                          <span key={t} className="text-[10px] text-slate-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Time & Space Complexity */}
                      {(q.time_complexity || q.space_complexity) && (
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                          {q.time_complexity && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-emerald-400" />
                              Time: <strong className="text-slate-200">{q.time_complexity}</strong>
                            </span>
                          )}
                          {q.space_complexity && (
                            <span className="flex items-center gap-1">
                              <Cpu className="w-3 h-3 text-cyan-400" />
                              Space: <strong className="text-slate-200">{q.space_complexity}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Companies & Hint Section */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-3">
                      {/* Asked Companies */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-amber-400" />
                          Top Tagged Companies:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {q.companies?.slice(0, 4).map((c) => (
                            <button
                              key={c.name}
                              onClick={() => setSelectedCompanyDetail(c.name)}
                              className="text-[10px] font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-2 py-0.5 rounded-md transition-colors"
                            >
                              {c.name} {c.frequency ? `(${Math.round(c.frequency)}%)` : ''}
                            </button>
                          ))}
                          {(q.companies?.length || 0) > 4 && (
                            <button
                              onClick={() => setSelectedCompanyDetail(q.companies[0].name)}
                              className="text-[10px] text-cyan-400 font-semibold px-1.5 py-0.5 hover:underline"
                            >
                              +{(q.companies?.length || 0) - 4} more
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Solving Hint Toggle */}
                      {q.hint && (
                        <div>
                          <button
                            onClick={() => setExpandedHintId(isHintExpanded ? null : q.id)}
                            className="w-full flex items-center justify-between text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5" />
                              {isHintExpanded ? 'Hide Strategy Hint' : 'Show Solving Intuition'}
                            </span>
                            <span className="text-[10px]">{isHintExpanded ? '▲' : '▼'}</span>
                          </button>

                          {isHintExpanded && (
                            <div className="mt-2 p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                              {q.hint}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {layoutStyle === 'table' && (
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="p-4 w-12 text-center">Status</th>
                      <th className="p-4 w-20">ID</th>
                      <th className="p-4">Title & LeetCode Link</th>
                      <th className="p-4 w-28">Difficulty</th>
                      <th className="p-4 w-28">Acceptance</th>
                      <th className="p-4">Pattern / Tags</th>
                      <th className="p-4">Top Companies</th>
                      <th className="p-4 w-20 text-center">Hint</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {paginatedQuestions.map((q) => {
                      const isSolved = solvedStatus[q.id] === 'solved';
                      const isReview = solvedStatus[q.id] === 'review';

                      const diffStyle =
                        q.difficulty.toLowerCase() === 'easy'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : q.difficulty.toLowerCase() === 'medium'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

                      return (
                        <tr
                          key={q.id}
                          className={`hover:bg-slate-900/60 transition-colors ${
                            isSolved ? 'bg-emerald-950/10' : isReview ? 'bg-amber-950/10' : ''
                          }`}
                        >
                          {/* Status Action */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleStatus(q.id, 'solved')}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSolved
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : 'text-slate-500 border-slate-800 hover:text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </td>

                          {/* Problem ID */}
                          <td className="p-4 font-mono font-bold text-slate-400">
                            #{q.id}
                          </td>

                          {/* Title & Link */}
                          <td className="p-4 font-semibold text-white">
                            <a
                              href={q.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                            >
                              <span>{q.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                            </a>
                          </td>

                          {/* Difficulty */}
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${diffStyle}`}>
                              {q.difficulty}
                            </span>
                          </td>

                          {/* Acceptance % */}
                          <td className="p-4 font-mono text-slate-300">
                            {q.acceptance ? `${q.acceptance}%` : 'N/A'}
                          </td>

                          {/* Pattern / Tags */}
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {q.pattern && q.pattern !== 'N/A' && (
                                <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-md">
                                  {q.pattern}
                                </span>
                              )}
                              {q.tags?.slice(0, 2).map((t) => (
                                <span key={t} className="text-[10px] text-slate-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Top Companies */}
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {q.companies?.slice(0, 3).map((c) => (
                                <button
                                  key={c.name}
                                  onClick={() => setSelectedCompanyDetail(c.name)}
                                  className="text-[10px] text-slate-300 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded hover:text-white"
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          </td>

                          {/* Hint Toggle */}
                          <td className="p-4 text-center">
                            {q.hint && (
                              <button
                                onClick={() => setSelectedQuestionDetail(q)}
                                className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg border border-amber-500/30"
                              >
                                <Lightbulb className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-[#0D1322] border border-slate-800 rounded-2xl p-4 shadow-xl">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Page
              </button>

              <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <span>Page</span>
                <span className="text-white px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg font-bold">
                  {currentPage}
                </span>
                <span>of {totalPages}</span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next Page
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== VIEW 2: COMPANY HUB ==================== */}
      {activeViewMode === 'companies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Company Interview Question Sheets ({filteredCompanyList.length})
            </h2>
            <p className="text-xs text-slate-400">
              Click any company card to open its full interview question list
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredCompanyList.slice(0, 60).map((c) => {
              const total = c.total;
              const easyPct = Math.round((c.easy / total) * 100) || 0;
              const mediumPct = Math.round((c.medium / total) * 100) || 0;
              const hardPct = Math.round((c.hard / total) * 100) || 0;

              return (
                <div
                  key={c.name}
                  onClick={() => setSelectedCompanyDetail(c.name)}
                  className="bg-[#0D1322] border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl group space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base uppercase">
                        {c.name.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white capitalize group-hover:text-cyan-400 transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-xs text-slate-400">{c.total} Interview Questions</p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  {/* Difficulty Distribution Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span className="text-emerald-400">Easy ({c.easy})</span>
                      <span className="text-amber-400">Med ({c.medium})</span>
                      <span className="text-rose-400">Hard ({c.hard})</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div style={{ width: `${easyPct}%` }} className="bg-emerald-500" title={`Easy: ${c.easy}`} />
                      <div style={{ width: `${mediumPct}%` }} className="bg-amber-500" title={`Medium: ${c.medium}`} />
                      <div style={{ width: `${hardPct}%` }} className="bg-rose-500" title={`Hard: ${c.hard}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== VIEW 3: PATTERNS GUIDE ==================== */}
      {activeViewMode === 'patterns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              Algorithmic Patterns Guide ({patternList.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {patternList.map(([patternName, count]) => (
              <div
                key={patternName}
                onClick={() => {
                  setSelectedPattern(patternName);
                  setActiveViewMode('questions');
                }}
                className="bg-[#0D1322] border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {patternName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    {count} Qs
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Click to filter questions tagged with <strong className="text-white">{patternName}</strong> pattern.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== COMPANY BREAKDOWN MODAL ==================== */}
      {selectedCompanyDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white capitalize">
                    {selectedCompanyDetail} Interview Sheet
                  </h3>
                  <p className="text-xs text-slate-400">
                    Showing top LeetCode questions asked at {selectedCompanyDetail.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCompanyDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-2">
                {allQuestions
                  .filter((q) => q.companies?.some((c) => c.name.toLowerCase() === selectedCompanyDetail.toLowerCase()))
                  .slice(0, 60)
                  .map((q) => (
                    <a
                      key={q.id}
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500">#{q.id}</span>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {q.title}
                          </p>
                          {q.pattern && q.pattern !== 'N/A' && (
                            <p className="text-[10px] text-purple-400 font-semibold">{q.pattern}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                          q.difficulty.toLowerCase() === 'easy'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                            : q.difficulty.toLowerCase() === 'medium'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                            : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                        }`}>
                          {q.difficulty}
                        </span>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HINT PREVIEW MODAL ==================== */}
      {selectedQuestionDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-amber-500/30 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Lightbulb className="w-5 h-5" />
                <span>Solving Intuition for #{selectedQuestionDetail.id}</span>
              </div>
              <button
                onClick={() => setSelectedQuestionDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white">{selectedQuestionDetail.title}</h3>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm leading-relaxed">
              {selectedQuestionDetail.hint || 'Analyze standard data structures and algorithmic patterns for optimal time complexity.'}
            </div>

            <div className="flex justify-end pt-2">
              <a
                href={selectedQuestionDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2"
              >
                Solve on LeetCode
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function CodeIcon(props: { className?: string }) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
