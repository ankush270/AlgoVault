import React, { useState, useMemo, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  Clock, 
  Brain, 
  FileText, 
  Filter, 
  Search, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  BookOpen,
  X,
  Layers,
  ListFilter,
  Maximize2,
  Minimize2,
  Code2,
  Cpu,
  Database,
  Globe2,
  Bot,
  Boxes
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';
import { DomainType, Difficulty, ItemStatus, TopicItem } from '../types';
import { CustomDropdown } from './common/CustomDropdown';

interface KnowledgeHubProps {
  selectedDomain: DomainType | 'all';
  setSelectedDomain: (d: DomainType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectTopic: (topic: TopicItem) => void;
  onOpenNote: (topicId: string, topicTitle: string) => void;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({
  selectedDomain,
  setSelectedDomain,
  searchQuery,
  setSearchQuery,
  onSelectTopic,
  onOpenNote,
}) => {
  const { progress, toggleStar } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus | 'all'>('all');
  const [onlyStarred, setOnlyStarred] = useState(false);

  // Accordion Expand/Collapse State (mapping category -> boolean)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Reset category/topic filters when domain changes
  useEffect(() => {
    setSelectedCategory('all');
    setSelectedTopicId('all');
  }, [selectedDomain]);

  // Available categories for selected domain
  const availableCategories = useMemo(() => {
    const topicsForDomain = selectedDomain === 'all' 
      ? allTopics 
      : allTopics.filter(t => t.domain === selectedDomain);
    const set = new Set(topicsForDomain.map(t => t.category));
    return Array.from(set).sort();
  }, [selectedDomain]);

  // Available topics for selected category/domain
  const availableTopicItems = useMemo(() => {
    return allTopics.filter(t => {
      if (selectedDomain !== 'all' && t.domain !== selectedDomain) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedDomain, selectedCategory]);

  // Main Filter Logic (Strictly enforces selectedDomain)
  const filteredTopics = useMemo(() => {
    return allTopics.filter((topic) => {
      // Domain match (Strict)
      if (selectedDomain !== 'all' && topic.domain !== selectedDomain) return false;

      // Category / Module match
      if (selectedCategory !== 'all' && topic.category !== selectedCategory) return false;

      // Topic Name match
      if (selectedTopicId !== 'all' && topic.id !== selectedTopicId) return false;

      // Difficulty match
      if (selectedDifficulty !== 'all' && topic.difficulty !== selectedDifficulty) return false;

      // Status match
      const currentStatus = progress.statuses[topic.id] || 'todo';
      if (selectedStatus !== 'all' && currentStatus !== selectedStatus) return false;

      // Starred filter
      if (onlyStarred && !progress.starred[topic.id]) return false;

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = topic.title.toLowerCase().includes(q);
        const matchCategory = topic.category.toLowerCase().includes(q);
        const matchSummary = topic.summary.toLowerCase().includes(q);
        const matchCompany = topic.companyTags.some(c => c.toLowerCase().includes(q));
        const matchConcepts = topic.keyConcepts.some(k => k.toLowerCase().includes(q));
        return matchTitle || matchCategory || matchSummary || matchCompany || matchConcepts;
      }

      return true;
    });
  }, [
    selectedDomain,
    selectedCategory,
    selectedTopicId,
    selectedDifficulty,
    selectedStatus,
    onlyStarred,
    searchQuery,
    progress
  ]);

  // Group filtered topics by Category / Module for Accordion display
  const groupedModules = useMemo(() => {
    const map = new Map<string, TopicItem[]>();
    filteredTopics.forEach((topic) => {
      const cat = topic.category;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(topic);
    });

    return Array.from(map.entries()).map(([category, topics]) => ({
      category,
      topics,
    }));
  }, [filteredTopics]);

  // Expand matching accordions automatically when search or filter is active
  useEffect(() => {
    if (searchQuery.trim() || selectedCategory !== 'all' || selectedTopicId !== 'all') {
      const autoExpanded: Record<string, boolean> = {};
      groupedModules.forEach(g => {
        autoExpanded[g.category] = true;
      });
      setExpandedCategories(prev => ({ ...prev, ...autoExpanded }));
    } else {
      // By default, expand first 3 modules if no filters active
      const initialExpand: Record<string, boolean> = {};
      groupedModules.forEach((g, idx) => {
        if (idx < 3) initialExpand[g.category] = true;
      });
      setExpandedCategories(initialExpand);
    }
  }, [groupedModules, searchQuery, selectedCategory, selectedTopicId]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const expandAll = () => {
    const allExp: Record<string, boolean> = {};
    groupedModules.forEach(g => {
      allExp[g.category] = true;
    });
    setExpandedCategories(allExp);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  const getStatusBadge = (topicId: string) => {
    const status = progress.statuses[topicId] || 'todo';
    switch (status) {
      case 'mastered':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <CheckCircle2 size={12} /> Mastered
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
            <Brain size={12} /> In Progress
          </span>
        );
      case 'needs-revision':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30">
            <Clock size={12} /> Revision Needed
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
            Todo
          </span>
        );
    }
  };

  const resetAllFilters = () => {
    setSelectedDomain('all');
    setSelectedCategory('all');
    setSelectedTopicId('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setOnlyStarred(false);
    setSearchQuery('');
  };

  const activeFilterCount = (selectedDomain !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedTopicId !== 'all' ? 1 : 0) +
    (selectedDifficulty !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (onlyStarred ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const domainConfigs: { id: DomainType | 'all'; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'all', label: 'All Modules', icon: BookOpen, color: 'text-blue-400' },
    { id: 'dsa', label: 'DSA & Algorithms', icon: Code2, color: 'text-amber-400' },
    { id: 'system-design', label: 'System Design (HLD)', icon: Layers, color: 'text-purple-400' },
    { id: 'oops', label: 'OOPs & LLD', icon: Boxes, color: 'text-orange-400' },
    { id: 'os', label: 'Operating Systems', icon: Cpu, color: 'text-emerald-400' },
    { id: 'dbms-sql', label: 'DBMS & SQL', icon: Database, color: 'text-cyan-400' },
    { id: 'computer-networks', label: 'Computer Networks', icon: Globe2, color: 'text-rose-400' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', icon: Bot, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 relative z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span>Curriculum & Knowledge Modules</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {selectedDomain === 'all' ? 'All Engineering Domains' : domainConfigs.find(d => d.id === selectedDomain)?.label}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Showing <strong className="text-blue-400">{filteredTopics.length}</strong> topics across <strong className="text-purple-400">{groupedModules.length}</strong> module accordions.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search topics, concepts, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Domain Filter Pills - Strict Single Domain Switching */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {domainConfigs.map((d) => {
            const Icon = d.icon;
            const isActive = selectedDomain === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : d.color}`} />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Multi-Filter Bar: Categories, Topic Names, Difficulty, Status, Starred using CustomDropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
          {/* Module / Category Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Layers size={12} className="text-blue-400" /> Module / Category
            </label>
            <CustomDropdown
              options={[
                { value: 'all', label: `All Modules (${availableCategories.length})` },
                ...availableCategories.map((cat) => ({ value: cat, label: cat }))
              ]}
              value={selectedCategory}
              onChange={(val) => {
                setSelectedCategory(val);
                setSelectedTopicId('all');
              }}
              searchable={true}
              searchPlaceholder="Search modules..."
              dropdownWidth="w-full md:w-96"
            />
          </div>

          {/* Topic Name Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <ListFilter size={12} className="text-blue-400" /> Specific Topic Name
            </label>
            <CustomDropdown
              options={[
                { value: 'all', label: `All Topics (${availableTopicItems.length})` },
                ...availableTopicItems.map((item) => ({ value: item.id, label: item.title }))
              ]}
              value={selectedTopicId}
              onChange={(val) => setSelectedTopicId(val)}
              searchable={true}
              searchPlaceholder="Search topic name..."
              dropdownWidth="w-full md:w-96"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-400" /> Difficulty Level
            </label>
            <CustomDropdown
              options={[
                { value: 'all', label: 'All Difficulties' },
                { value: 'Easy', label: '🟢 Easy', color: 'text-emerald-400' },
                { value: 'Medium', label: '🟡 Medium', color: 'text-amber-400' },
                { value: 'Hard', label: '🔴 Hard', color: 'text-rose-400' }
              ]}
              value={selectedDifficulty}
              onChange={(val) => setSelectedDifficulty(val as any)}
              dropdownWidth="w-full md:w-56"
            />
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Brain size={12} className="text-emerald-400" /> Learning Status
            </label>
            <CustomDropdown
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'todo', label: '⚪ Todo' },
                { value: 'in-progress', label: '🟡 In Progress', color: 'text-amber-400' },
                { value: 'mastered', label: '🟢 Mastered', color: 'text-emerald-400' },
                { value: 'needs-revision', label: '🟣 Needs Revision', color: 'text-purple-400' }
              ]}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val as any)}
              dropdownWidth="w-full md:w-56"
            />
          </div>

          {/* Starred Toggle */}
          <div className="space-y-1 flex flex-col justify-end">
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                onlyStarred
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
              }`}
            >
              <Star size={14} className={onlyStarred ? 'fill-amber-400 text-amber-400' : ''} />
              <span>{onlyStarred ? 'Starred Topics Only' : 'Filter Starred'}</span>
            </button>
          </div>
        </div>

        {/* Global Expand / Collapse Accordion Controls & Active Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            >
              <Maximize2 size={13} className="text-blue-400" />
              <span>Expand All Modules</span>
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            >
              <Minimize2 size={13} className="text-purple-400" />
              <span>Collapse All</span>
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Active Filters ({activeFilterCount}):
              </span>

              {selectedDomain !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  Domain: {domainConfigs.find(d => d.id === selectedDomain)?.label}
                  <button onClick={() => setSelectedDomain('all')} className="hover:text-white"><X size={12} /></button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30 max-w-[180px] truncate">
                  Module: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-white"><X size={12} /></button>
                </span>
              )}

              {selectedTopicId !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 max-w-[200px] truncate">
                  Topic: {allTopics.find(t => t.id === selectedTopicId)?.title || selectedTopicId}
                  <button onClick={() => setSelectedTopicId('all')} className="hover:text-white"><X size={12} /></button>
                </span>
              )}

              {selectedDifficulty !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Difficulty: {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty('all')} className="hover:text-white"><X size={12} /></button>
                </span>
              )}

              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus('all')} className="hover:text-white"><X size={12} /></button>
                </span>
              )}

              {onlyStarred && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Starred Only
                  <button onClick={() => setOnlyStarred(false)} className="hover:text-white"><X size={12} /></button>
                </span>
              )}

              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-white"><X size={12} /></button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline ml-2"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Module Accordions Section (Replaces Infinite Page Scrollbar) */}
      {groupedModules.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Filter className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Topics Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No technical interview topics match your active filter combination for {selectedDomain === 'all' ? 'the selected filters' : domainConfigs.find(d => d.id === selectedDomain)?.label}.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedModules.map(({ category, topics }) => {
            const isExpanded = !!expandedCategories[category];

            // Count completed/mastered topics in this module
            const masteredCount = topics.filter(t => progress.statuses[t.id] === 'mastered').length;

            return (
              <div
                key={category}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900/90 text-left border-b border-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
                      <Layers size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base truncate">
                        {category}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{topics.length} Technical {topics.length === 1 ? 'Topic' : 'Topics'}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{masteredCount} / {topics.length} Mastered</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700/80">
                      {isExpanded ? 'Expanded' : 'Collapsed'}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-slate-800 text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-blue-500/20 text-blue-400' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </button>

                {/* Accordion Body: Grid of Topic Cards */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                    {topics.map((topic) => {
                      const isStarred = !!progress.starred[topic.id];
                      const hasNote = !!progress.notes[topic.id];

                      return (
                        <div
                          key={topic.id}
                          className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3 group transition-all duration-200 bg-slate-900/40"
                        >
                          <div className="space-y-2.5">
                            {/* Top Bar: Difficulty & Star Button */}
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyColor(topic.difficulty)}`}>
                                {topic.difficulty}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(topic.id);
                                }}
                                className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                                title={isStarred ? 'Unstar Topic' : 'Star Topic'}
                              >
                                <Star size={15} className={isStarred ? 'fill-amber-400 text-amber-400' : ''} />
                              </button>
                            </div>

                            {/* Title & Summary */}
                            <div 
                              onClick={() => onSelectTopic(topic)}
                              className="cursor-pointer space-y-1"
                            >
                              <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors leading-snug">
                                {topic.title}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {topic.summary}
                              </p>
                            </div>

                            {/* Key Concepts Preview */}
                            {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                              <div className="space-y-0.5 pt-1.5 border-t border-slate-800/60">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Core Takeaways:</span>
                                <ul className="text-[11px] text-slate-300 space-y-0.5">
                                  {topic.keyConcepts.slice(0, 2).map((kc, idx) => (
                                    <li key={idx} className="line-clamp-1 flex items-start gap-1">
                                      <span className="text-blue-400 font-bold">•</span> {kc}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Company Tags */}
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              {topic.companyTags.map((c, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-medium text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Bottom Bar: Status Selector & Actions */}
                          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {getStatusBadge(topic.id)}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Personal Notes Trigger */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenNote(topic.id, topic.title);
                                }}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  hasNote
                                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                                }`}
                                title="Personal Note"
                              >
                                <FileText size={13} />
                              </button>

                              {/* Open Full Topic Details */}
                              <button
                                onClick={() => onSelectTopic(topic)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition-all text-xs font-semibold"
                              >
                                <span>Study</span>
                                <ChevronRight size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


