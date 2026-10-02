import React, { useState, useMemo } from 'react';
import {
  Layers,
  BookOpen,
  Code2,
  HelpCircle,
  Boxes,
  ChevronRight,
  ChevronDown,
  Search,
  Sparkles,
  ArrowLeft,
  Star,
  CheckCircle2,
  Clock,
  Brain,
  FileText,
  X,
  Filter,
  ExternalLink,
  Cpu,
  Server,
  Database,
  Globe,
  Zap,
  Lightbulb,
  ListFilter,
  Hash,
  Trophy,
  BookMarked,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { TopicItem, ItemStatus } from '../types';
import { systemDesignConceptTopics } from '../data/systemDesignConceptsLoader';
import { systemDesignExampleTopics } from '../data/systemDesignExamplesLoader';
import { systemDesignQuestionTopics } from '../data/systemDesignQuestionsLoader';
import { lldTopics } from '../data/lldLoader';

// ──────────────────── Module Definitions ────────────────────
interface SDModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  gradient: string;
  borderColor: string;
  badgeColor: string;
  iconBg: string;
  accentColor: string;
  hoverGlow: string;
  topics: TopicItem[];
  badge?: string;
}

const SD_MODULES: SDModule[] = [
  {
    id: 'concepts',
    title: 'System Design Concepts',
    subtitle: 'Core Foundations & Building Blocks',
    description: 'Master fundamental distributed systems concepts — Scalability, Caching, Databases, Load Balancers, Consistent Hashing, CAP Theorem, and more.',
    icon: BookOpen,
    gradient: 'from-violet-500/10 via-purple-500/5 to-fuchsia-500/10',
    borderColor: 'border-violet-200/60',
    badgeColor: 'bg-violet-100 text-violet-700',
    iconBg: 'bg-violet-50 border-violet-200',
    accentColor: 'text-violet-600',
    hoverGlow: 'hover:shadow-violet-200/40',
    topics: systemDesignConceptTopics,
    badge: 'CORE',
  },
  {
    id: 'examples',
    title: 'System Design Examples',
    subtitle: 'Real-World Case Studies',
    description: 'Full end-to-end architectural breakdowns of 35+ real-world systems — TinyURL, WhatsApp, Netflix, Uber, Twitter, and more with API design & code.',
    icon: Layers,
    gradient: 'from-cyan-500/10 via-sky-500/5 to-blue-500/10',
    borderColor: 'border-cyan-200/60',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    iconBg: 'bg-cyan-50 border-cyan-200',
    accentColor: 'text-cyan-600',
    hoverGlow: 'hover:shadow-cyan-200/40',
    topics: systemDesignExampleTopics,
    badge: 'HLD',
  },
  {
    id: 'questions',
    title: 'System Design Questions',
    subtitle: 'Interview-Focused Q&A Bank',
    description: 'Structured interview questions with deep explanations — Database Isolation, Cloud Models, Protocols, Data Structures, Scaling Strategies & more.',
    icon: HelpCircle,
    gradient: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10',
    borderColor: 'border-amber-200/60',
    badgeColor: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-50 border-amber-200',
    accentColor: 'text-amber-600',
    hoverGlow: 'hover:shadow-amber-200/40',
    topics: systemDesignQuestionTopics,
    badge: 'Q&A',
  },
  {
    id: 'lld',
    title: 'Low Level Design',
    subtitle: 'OOD & Machine Coding Round',
    description: 'Production-grade LLD problems with C++ implementations — LRU Cache, Parking Lot, Snake & Ladder, Elevator System, BookMyShow, and more.',
    icon: Code2,
    gradient: 'from-emerald-500/10 via-green-500/5 to-teal-500/10',
    borderColor: 'border-emerald-200/60',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-50 border-emerald-200',
    accentColor: 'text-emerald-600',
    hoverGlow: 'hover:shadow-emerald-200/40',
    topics: lldTopics,
    badge: 'LLD',
  },
];

// ──────────────────── Utility ────────────────────
const statusIcons: Record<ItemStatus, React.ReactNode> = {
  'todo': <Clock className="w-3.5 h-3.5 text-slate-400" />,
  'in-progress': <Brain className="w-3.5 h-3.5 text-amber-500" />,
  'mastered': <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  'needs-revision': <Zap className="w-3.5 h-3.5 text-rose-500" />,
};

const statusLabels: Record<ItemStatus, string> = {
  'todo': 'Todo',
  'in-progress': 'Learning',
  'mastered': 'Mastered',
  'needs-revision': 'Revise',
};

interface SystemDesignHubProps {
  onSelectTopic: (topic: TopicItem) => void;
  onOpenNote: (topicId: string, topicTitle: string) => void;
}

export const SystemDesignHub: React.FC<SystemDesignHubProps> = ({
  onSelectTopic,
  onOpenNote,
}) => {
  const { progress, updateStatus, toggleStar } = useProgress();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const activeModule = useMemo(
    () => SD_MODULES.find(m => m.id === activeModuleId) || null,
    [activeModuleId]
  );

  // ── Filtered topics inside an active module ──
  const filteredTopics = useMemo(() => {
    if (!activeModule) return [];

    let topics = activeModule.topics;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      topics = topics.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.keyConcepts.some(k => k.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      topics = topics.filter(t => t.category === selectedCategory);
    }

    return topics;
  }, [activeModule, searchQuery, selectedCategory]);

  // ── Categories inside the active module ──
  const moduleCategories = useMemo(() => {
    if (!activeModule) return [];
    const set = new Set(activeModule.topics.map(t => t.category));
    return Array.from(set).sort();
  }, [activeModule]);

  // ── Group topics by category for accordion display ──
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, TopicItem[]> = {};
    for (const topic of filteredTopics) {
      const cat = topic.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(topic);
    }
    return groups;
  }, [filteredTopics]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // ── Stats for module cards ──
  const getModuleStats = (topics: TopicItem[]) => {
    let mastered = 0, inProgress = 0, starred = 0;
    for (const t of topics) {
      const status = progress.statuses[t.id];
      if (status === 'mastered') mastered++;
      else if (status === 'in-progress') inProgress++;
      if (progress.starred[t.id]) starred++;
    }
    return { total: topics.length, mastered, inProgress, starred };
  };

  // ────────────────── MODULE CARD GRID (HOME VIEW) ──────────────────
  if (!activeModuleId) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 border border-purple-200/60">
                <Server className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                  System Design Hub
                  <span className="text-xs font-bold bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200/60">
                    4 Modules
                  </span>
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Master HLD, LLD, Architecture Concepts & Real-World Case Studies for FAANG Interviews
                </p>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="flex items-center gap-3">
              {(() => {
                const allSDTopics = SD_MODULES.flatMap(m => m.topics);
                const stats = getModuleStats(allSDTopics);
                return (
                  <>
                    <div className="text-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-lg font-black text-slate-900">{stats.total}</div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Topics</div>
                    </div>
                    <div className="text-center px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="text-lg font-black text-emerald-700">{stats.mastered}</div>
                      <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Done</div>
                    </div>
                    <div className="text-center px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="text-lg font-black text-amber-700">{stats.inProgress}</div>
                      <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Active</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SD_MODULES.map((mod) => {
            const Icon = mod.icon;
            const stats = getModuleStats(mod.topics);
            const progressPercent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModuleId(mod.id);
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setExpandedCategories({});
                }}
                className={`group relative bg-gradient-to-br ${mod.gradient} border ${mod.borderColor} rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${mod.hoverGlow} cursor-pointer`}
              >
                {/* Badge */}
                {mod.badge && (
                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-md ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                )}

                {/* Icon & Title */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${mod.iconBg} border transition-transform group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${mod.accentColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-800">
                      {mod.title}
                    </h3>
                    <p className={`text-xs font-semibold ${mod.accentColor} mt-0.5`}>
                      {mod.subtitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                      {mod.description}
                    </p>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      <span className="font-bold text-slate-700">{stats.total}</span> topics
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span className="font-bold text-emerald-600">{stats.mastered}</span> done
                    </span>
                    {stats.starred > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-amber-600">{stats.starred}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{progressPercent}%</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className={`w-5 h-5 ${mod.accentColor}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ────────────────── MODULE DETAIL VIEW ──────────────────
  const mod = activeModule!;
  const ModIcon = mod.icon;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Back Button & Module Header */}
      <div className={`bg-gradient-to-br ${mod.gradient} border ${mod.borderColor} rounded-2xl p-5 shadow-md`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModuleId(null)}
              className="p-2 rounded-xl bg-white/70 border border-slate-200/60 hover:bg-white transition text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className={`p-2.5 rounded-xl ${mod.iconBg} border`}>
              <ModIcon className={`w-6 h-6 ${mod.accentColor}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {mod.title}
                {mod.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">{mod.subtitle} — {mod.topics.length} topics</p>
            </div>
          </div>

          {/* Stats */}
          {(() => {
            const stats = getModuleStats(mod.topics);
            return (
              <div className="flex items-center gap-2.5">
                <div className="text-center px-3 py-1.5 rounded-lg bg-white/60 border border-slate-200/60">
                  <div className="text-sm font-black text-slate-900">{stats.total}</div>
                  <div className="text-[9px] font-semibold text-slate-500 uppercase">Total</div>
                </div>
                <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
                  <div className="text-sm font-black text-emerald-700">{stats.mastered}</div>
                  <div className="text-[9px] font-semibold text-emerald-600 uppercase">Done</div>
                </div>
                <div className="text-center px-3 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200/60">
                  <div className="text-sm font-black text-amber-700">{stats.inProgress}</div>
                  <div className="text-[9px] font-semibold text-amber-600 uppercase">Active</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${mod.title.toLowerCase()}...`}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        {moduleCategories.length > 1 && (
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
            >
              <option value="all">All Categories ({mod.topics.length})</option>
              {moduleCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({mod.topics.filter(t => t.category === cat).length})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-xs text-slate-500 px-1">
        Showing <span className="font-bold text-slate-700">{filteredTopics.length}</span> of {mod.topics.length} topics
        {searchQuery && <span> matching "<span className="font-semibold text-purple-600">{searchQuery}</span>"</span>}
      </div>

      {/* Topics grouped by Category (Accordion) */}
      <div className="space-y-3">
        {Object.entries(groupedByCategory).map(([category, topics]) => {
          const isExpanded = expandedCategories[category] !== false; // default expanded

          return (
            <div key={category} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${mod.iconBg} border`}>
                    <BookMarked className={`w-3.5 h-3.5 ${mod.accentColor}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-800">{category}</h3>
                    <p className="text-[11px] text-slate-500">{topics.length} topics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mini progress */}
                  {(() => {
                    const done = topics.filter(t => progress.statuses[t.id] === 'mastered').length;
                    const pct = topics.length > 0 ? Math.round((done / topics.length) * 100) : 0;
                    return (
                      <span className="text-[10px] font-bold text-slate-400">
                        {done}/{topics.length} <span className="text-emerald-500">({pct}%)</span>
                      </span>
                    );
                  })()}
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Topics List */}
              {isExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-100">
                  {topics.map((topic) => {
                    const status = progress.statuses[topic.id] as ItemStatus | undefined;
                    const isStarred = progress.starred[topic.id];

                    return (
                      <div
                        key={topic.id}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition group"
                      >
                        {/* Status Button */}
                        <button
                          onClick={() => {
                            const cycle: ItemStatus[] = ['todo', 'in-progress', 'mastered', 'needs-revision'];
                            const current = status || 'todo';
                            const nextIdx = (cycle.indexOf(current) + 1) % cycle.length;
                            updateStatus(topic.id, cycle[nextIdx]);
                          }}
                          className="shrink-0 cursor-pointer"
                          title={statusLabels[status || 'todo']}
                        >
                          {statusIcons[status || 'todo']}
                        </button>

                        {/* Topic Title — Click to open detail */}
                        <button
                          onClick={() => onSelectTopic(topic)}
                          className="flex-1 text-left min-w-0 cursor-pointer"
                        >
                          <div className="text-sm font-medium text-slate-800 truncate group-hover:text-purple-700 transition">
                            {topic.title}
                          </div>
                          {topic.keyConcepts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {topic.keyConcepts.slice(0, 3).map((kc, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                  {kc}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>

                        {/* Difficulty badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          topic.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          topic.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}>
                          {topic.difficulty}
                        </span>

                        {/* Star */}
                        <button
                          onClick={() => toggleStar(topic.id)}
                          className="shrink-0 cursor-pointer"
                        >
                          <Star className={`w-4 h-4 transition ${isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-300'}`} />
                        </button>

                        {/* Notes */}
                        <button
                          onClick={() => onOpenNote(topic.id, topic.title)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-slate-400 hover:text-purple-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No topics found</p>
          <p className="text-xs text-slate-400">Try a different search or clear filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
