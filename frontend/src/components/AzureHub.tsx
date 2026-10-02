import React, { useState, useMemo } from 'react';
import {
  Cloud,
  Layers,
  Server,
  Database,
  Shield,
  Activity,
  Cpu,
  Boxes,
  Key,
  Radio,
  Workflow,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Search,
  ArrowLeft,
  Star,
  CheckCircle2,
  Clock,
  Brain,
  FileText,
  X,
  ListFilter,
  Hash,
  BookMarked,
  Zap,
  Terminal,
  ExternalLink,
  Bot,
  HelpCircle,
  Network
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { TopicItem, ItemStatus } from '../types';
import { azureTopics, azureModules, AzureModuleMeta } from '../data/azureLoader';

// Icon mapping per module key
const MODULE_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  azure_foundation_deep_dive: Cloud,
  azure_compute_deep_dive: Cpu,
  azure_storage_deep_dive: Database,
  azure_messaging_and_events: Radio,
  azure_databases_and_caching: Server,
  azure_security_identity_and_networking: Shield,
  azure_monitoring_devops_and_governance: Activity,
  azure_architecture_patterns_and_frameworks: Workflow,
};

// Utility Status helpers
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

interface AzureHubProps {
  onSelectTopic: (topic: TopicItem) => void;
  onOpenNote: (topicId: string, topicTitle: string) => void;
}

export const AzureHub: React.FC<AzureHubProps> = ({
  onSelectTopic,
  onOpenNote,
}) => {
  const { progress, updateStatus, toggleStar } = useProgress();
  const [activeModuleKey, setActiveModuleKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ItemStatus | 'starred'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const activeModule = useMemo(
    () => azureModules.find(m => m.key === activeModuleKey) || null,
    [activeModuleKey]
  );

  // Topics for the active view
  const currentPool = useMemo(() => {
    if (activeModuleKey) {
      const mod = azureModules.find(m => m.key === activeModuleKey);
      if (!mod) return [];
      return azureTopics.filter(t => t.category === mod.category);
    }
    return azureTopics;
  }, [activeModuleKey]);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    let list = currentPool;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.keyConcepts.some(k => k.toLowerCase().includes(q))
      );
    }

    if (selectedDifficulty !== 'all') {
      list = list.filter(t => t.difficulty === selectedDifficulty);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'starred') {
        list = list.filter(t => progress.starred[t.id]);
      } else {
        list = list.filter(t => (progress.statuses[t.id] || 'todo') === statusFilter);
      }
    }

    return list;
  }, [currentPool, searchQuery, selectedDifficulty, statusFilter, progress]);

  // Group topics by category
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

  // Stats calculation
  const getStats = (topics: TopicItem[]) => {
    let mastered = 0, inProgress = 0, starred = 0;
    for (const t of topics) {
      const status = progress.statuses[t.id];
      if (status === 'mastered') mastered++;
      else if (status === 'in-progress') inProgress++;
      if (progress.starred[t.id]) starred++;
    }
    return { total: topics.length, mastered, inProgress, starred };
  };

  const overallStats = useMemo(() => getStats(azureTopics), [progress]);

  // ────────────────── MODULE CARD GRID (MAIN HUB VIEW) ──────────────────
  if (!activeModuleKey) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Azure Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-sky-900 to-slate-900 border border-blue-800/60 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          {/* Subtle Azure Geometric Background Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-400/20 to-blue-500/30 border border-sky-400/30 backdrop-blur-md shrink-0">
                <Cloud className="w-8 h-8 text-sky-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Microsoft Azure
                  </h1>
                  <span className="text-xs font-bold bg-sky-400/20 text-sky-300 px-2.5 py-0.5 rounded-lg border border-sky-400/30">
                    Enterprise Cloud & Architecture
                  </span>
                  <span className="text-xs font-bold bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-lg border border-indigo-400/30">
                    8 Modules
                  </span>
                </div>
                <p className="text-sm text-sky-100/80 max-w-2xl leading-relaxed">
                  Master end-to-end Azure Cloud engineering — Serverless compute, Blob storage tiers, Cosmos DB, Service Bus, Entra ID zero-trust, CI/CD with Bicep, and Azure OpenAI integration.
                </p>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-slate-900/60 border border-sky-500/30 backdrop-blur-md rounded-2xl p-3 shrink-0 self-start md:self-auto">
              <div className="text-center px-3 py-1">
                <div className="text-xl font-black text-white">{overallStats.total}</div>
                <div className="text-[10px] font-semibold text-sky-300 uppercase tracking-wider">Topics</div>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-center px-3 py-1">
                <div className="text-xl font-black text-emerald-400">{overallStats.mastered}</div>
                <div className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">Mastered</div>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-center px-3 py-1">
                <div className="text-xl font-black text-amber-400">{overallStats.inProgress}</div>
                <div className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Azure Search Bar & Quick Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Azure topics (e.g., Cosmos DB, SAS Token, Peek-Lock, Entra ID, Azure OpenAI)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    selectedDifficulty === diff
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff === 'all' ? 'All Levels' : diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* If Search is Active, display immediate search results */}
        {searchQuery.trim() ? (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 px-1">
              Found <span className="font-bold text-slate-700">{filteredTopics.length}</span> Azure topics matching "{searchQuery}"
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
              {filteredTopics.map((topic) => {
                const status = progress.statuses[topic.id] as ItemStatus | undefined;
                const isStarred = progress.starred[topic.id];

                return (
                  <div
                    key={topic.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition group"
                  >
                    <button
                      onClick={() => {
                        const cycle: ItemStatus[] = ['todo', 'in-progress', 'mastered', 'needs-revision'];
                        const current = status || 'todo';
                        const nextIdx = (cycle.indexOf(current) + 1) % cycle.length;
                        updateStatus(topic.id, cycle[nextIdx]);
                      }}
                      className="shrink-0 cursor-pointer"
                    >
                      {statusIcons[status || 'todo']}
                    </button>

                    <button
                      onClick={() => onSelectTopic(topic)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition truncate">
                          {topic.title}
                        </span>
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {topic.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{topic.summary}</p>
                    </button>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      topic.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      topic.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                      {topic.difficulty}
                    </span>

                    <button onClick={() => toggleStar(topic.id)} className="shrink-0 cursor-pointer">
                      <Star className={`w-4 h-4 ${isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-300'}`} />
                    </button>

                    <button onClick={() => onOpenNote(topic.id, topic.title)} className="shrink-0 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                      <FileText className="w-4 h-4 text-slate-400 hover:text-sky-600" />
                    </button>
                  </div>
                );
              })}

              {filteredTopics.length === 0 && (
                <div className="text-center py-12 text-sm text-slate-500">
                  No Azure topics found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 8-Module Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {azureModules.map((mod) => {
              const Icon = MODULE_ICON_MAP[mod.key] || Cloud;
              const modTopics = azureTopics.filter(t => t.category === mod.category);
              const stats = getStats(modTopics);
              const progressPercent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

              return (
                <button
                  key={mod.key}
                  onClick={() => {
                    setActiveModuleKey(mod.key);
                    setSearchQuery('');
                    setExpandedCategories({});
                  }}
                  className={`group relative bg-gradient-to-br ${mod.gradient} border ${mod.borderColor} rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${mod.hoverGlow} cursor-pointer`}
                >
                  {/* Badge */}
                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-md ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-xl ${mod.iconBg} border transition-transform group-hover:scale-110 shrink-0`}>
                      <Icon className={`w-6 h-6 ${mod.accentColor}`} />
                    </div>
                    <div className="flex-1 min-w-0 pr-16">
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
                  <div className="mt-5 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
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
                          className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{progressPercent}%</span>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className={`w-5 h-5 ${mod.accentColor}`} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ────────────────── MODULE DETAIL VIEW ──────────────────
  const mod = activeModule!;
  const ModIcon = MODULE_ICON_MAP[mod.key] || Cloud;
  const modTopics = azureTopics.filter(t => t.category === mod.category);
  const modStats = getStats(modTopics);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Module Header Bar */}
      <div className={`bg-gradient-to-br ${mod.gradient} border ${mod.borderColor} rounded-2xl p-5 shadow-md`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveModuleKey(null);
                setSearchQuery('');
              }}
              className="p-2 rounded-xl bg-white/80 border border-slate-200 hover:bg-white transition text-slate-700 hover:text-slate-900 cursor-pointer shadow-sm"
              title="Back to All Azure Modules"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className={`p-2.5 rounded-xl ${mod.iconBg} border`}>
              <ModIcon className={`w-6 h-6 ${mod.accentColor}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {mod.title}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${mod.badgeColor}`}>
                  {mod.badge}
                </span>
              </h2>
              <p className="text-xs text-slate-500">{mod.subtitle} — {modTopics.length} topics</p>
            </div>
          </div>

          {/* Module Stats Counters */}
          <div className="flex items-center gap-2.5">
            <div className="text-center px-3 py-1.5 rounded-lg bg-white/70 border border-slate-200/60 shadow-xs">
              <div className="text-sm font-black text-slate-900">{modStats.total}</div>
              <div className="text-[9px] font-semibold text-slate-500 uppercase">Total</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 shadow-xs">
              <div className="text-sm font-black text-emerald-700">{modStats.mastered}</div>
              <div className="text-[9px] font-semibold text-emerald-600 uppercase">Done</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/60 shadow-xs">
              <div className="text-sm font-black text-amber-700">{modStats.inProgress}</div>
              <div className="text-[9px] font-semibold text-amber-600 uppercase">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${mod.title.toLowerCase()}...`}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {diff === 'all' ? 'All' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500 px-1">
        Showing <span className="font-bold text-slate-700">{filteredTopics.length}</span> of {modTopics.length} topics
        {searchQuery && <span> matching "<span className="font-semibold text-sky-600">{searchQuery}</span>"</span>}
      </div>

      {/* Topic List */}
      <div className="space-y-3">
        {Object.entries(groupedByCategory).map(([category, topics]) => {
          const isExpanded = expandedCategories[category] !== false;

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
                    <p className="text-[11px] text-slate-500">{topics.length} architectural topics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition group"
                      >
                        {/* Status Toggle */}
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

                        {/* Title & Key Concepts — Click to open Detail Modal */}
                        <button
                          onClick={() => onSelectTopic(topic)}
                          className="flex-1 text-left min-w-0 cursor-pointer"
                        >
                          <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-sky-600 transition">
                            {topic.title}
                          </div>
                          {topic.keyConcepts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {topic.keyConcepts.slice(0, 4).map((kc, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                  {kc}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>

                        {/* Difficulty Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          topic.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          topic.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}>
                          {topic.difficulty}
                        </span>

                        {/* Star / Bookmark */}
                        <button
                          onClick={() => toggleStar(topic.id)}
                          className="shrink-0 cursor-pointer p-1"
                        >
                          <Star className={`w-4 h-4 transition ${isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-300'}`} />
                        </button>

                        {/* Notes button */}
                        <button
                          onClick={() => onOpenNote(topic.id, topic.title)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition cursor-pointer p-1"
                          title="Open My Notes"
                        >
                          <FileText className="w-4 h-4 text-slate-400 hover:text-sky-600" />
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
        <div className="text-center py-16 space-y-3 bg-white border border-slate-200 rounded-2xl">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No topics found in this view</p>
          <p className="text-xs text-slate-400">Try a different search query or change filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedDifficulty('all'); }}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
