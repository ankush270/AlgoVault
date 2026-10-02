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
      case 'Easy': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getStatusBadge = (topicId: string) => {
    const status = progress.statuses[topicId] || 'todo';
    switch (status) {
      case 'mastered':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle2 size={12} /> Mastered
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Brain size={12} /> In Progress
          </span>
        );
      case 'needs-revision':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
            <Clock size={12} /> Revision Needed
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
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
    { id: 'all', label: 'All Modules', icon: BookOpen, color: 'text-blue-600' },
    { id: 'dsa', label: 'DSA & Algorithms', icon: Code2, color: 'text-amber-600' },
    { id: 'system-design', label: 'System Design (HLD)', icon: Layers, color: 'text-purple-600' },
    { id: 'oops', label: 'OOPs & LLD', icon: Boxes, color: 'text-orange-600' },
    { id: 'os', label: 'Operating Systems', icon: Cpu, color: 'text-emerald-600' },
    { id: 'dbms-sql', label: 'DBMS & SQL', icon: Database, color: 'text-cyan-600' },
    { id: 'computer-networks', label: 'Computer Networks', icon: Globe2, color: 'text-rose-600' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', icon: Bot, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="card-surface p-5 sm:p-7 rounded-2xl space-y-5 relative z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex flex-wrap items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-blue-600 shrink-0" />
              <span>Curriculum & Knowledge Modules</span>
              <span className="text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {selectedDomain === 'all' ? 'All Engineering Domains' : domainConfigs.find(d => d.id === selectedDomain)?.label}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-2 font-semibold leading-relaxed">
              Showing <strong className="text-blue-600 font-extrabold text-lg sm:text-xl">{filteredTopics.length}</strong> topics across <strong className="text-purple-600 font-extrabold text-lg sm:text-xl">{groupedModules.length}</strong> module accordions.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search topics, concepts, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Domain Filter Pills - Strict Single Domain Switching */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          {domainConfigs.map((d) => {
            const Icon = d.icon;
            const isActive = selectedDomain === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : d.color}`} />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Multi-Filter Bar: Categories, Topic Names, Difficulty, Status, Starred using CustomDropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3">
          {/* Module / Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Layers size={14} className="text-blue-600" /> Module / Category
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
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <ListFilter size={14} className="text-blue-600" /> Specific Topic Name
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
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-600" /> Difficulty Level
            </label>
            <CustomDropdown
              options={[
                { value: 'all', label: 'All Difficulties' },
                { value: 'Easy', label: '🟢 Easy', color: 'text-emerald-600' },
                { value: 'Medium', label: '🟡 Medium', color: 'text-amber-600' },
                { value: 'Hard', label: '🔴 Hard', color: 'text-rose-600' }
              ]}
              value={selectedDifficulty}
              onChange={(val) => setSelectedDifficulty(val as any)}
              dropdownWidth="w-full md:w-56"
            />
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Brain size={14} className="text-emerald-600" /> Learning Status
            </label>
            <CustomDropdown
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'todo', label: '⚪ Todo' },
                { value: 'in-progress', label: '🟡 In Progress', color: 'text-amber-600' },
                { value: 'mastered', label: '🟢 Mastered', color: 'text-emerald-600' },
                { value: 'needs-revision', label: '🟣 Needs Revision', color: 'text-purple-600' }
              ]}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val as any)}
              dropdownWidth="w-full md:w-56"
            />
          </div>

          {/* Starred Toggle */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                onlyStarred
                  ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Star size={16} className={onlyStarred ? 'fill-amber-500 text-amber-500' : ''} />
              <span>{onlyStarred ? 'Starred Topics Only' : 'Filter Starred'}</span>
            </button>
          </div>
        </div>

        {/* Global Expand / Collapse Accordion Controls & Active Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <button
              onClick={expandAll}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition-all"
            >
              <Maximize2 size={14} className="text-blue-600" />
              <span>Expand All Modules</span>
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition-all"
            >
              <Minimize2 size={14} className="text-purple-600" />
              <span>Collapse All</span>
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600">
                Active Filters ({activeFilterCount}):
              </span>

              {selectedDomain !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Domain: {domainConfigs.find(d => d.id === selectedDomain)?.label}
                  <button onClick={() => setSelectedDomain('all')} className="hover:text-blue-900"><X size={13} /></button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-200 max-w-[200px] truncate">
                  Module: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-purple-900"><X size={13} /></button>
                </span>
              )}

              {selectedTopicId !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 max-w-[220px] truncate">
                  Topic: {allTopics.find(t => t.id === selectedTopicId)?.title || selectedTopicId}
                  <button onClick={() => setSelectedTopicId('all')} className="hover:text-cyan-900"><X size={13} /></button>
                </span>
              )}

              {selectedDifficulty !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Difficulty: {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty('all')} className="hover:text-amber-900"><X size={13} /></button>
                </span>
              )}

              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus('all')} className="hover:text-emerald-900"><X size={13} /></button>
                </span>
              )}

              {onlyStarred && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Starred Only
                  <button onClick={() => setOnlyStarred(false)} className="hover:text-amber-900"><X size={13} /></button>
                </span>
              )}

              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-slate-900"><X size={13} /></button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs sm:text-sm font-extrabold text-rose-600 hover:text-rose-700 hover:underline ml-2"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Module Accordions Section */}
      {groupedModules.length === 0 ? (
        <div className="card-surface p-12 rounded-2xl text-center space-y-4">
          <Filter className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">No Matching Topics Found</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            No technical interview topics match your active filter combination for {selectedDomain === 'all' ? 'the selected filters' : domainConfigs.find(d => d.id === selectedDomain)?.label}.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-extrabold shadow-md shadow-blue-200"
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
                className="card-surface rounded-2xl overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50/80 hover:bg-slate-100/80 text-left border-b border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className={`p-2.5 rounded-xl transition-colors ${isExpanded ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                      <Layers size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-xl truncate">
                        {category}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-semibold flex items-center gap-2 mt-0.5">
                        <span>{topics.length} Technical {topics.length === 1 ? 'Topic' : 'Topics'}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-extrabold">{masteredCount} / {topics.length} Mastered</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-500 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200 hidden sm:inline">
                      {isExpanded ? 'Expanded' : 'Collapsed'}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-slate-100 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </button>

                {/* Accordion Body: Grid of Topic Cards */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-fadeIn">
                    {topics.map((topic) => {
                      const isStarred = !!progress.starred[topic.id];
                      const hasNote = !!progress.notes[topic.id];

                      return (
                        <div
                          key={topic.id}
                          className="card-surface card-surface-hover p-4 sm:p-5 rounded-xl flex flex-col justify-between space-y-3 group transition-all duration-200"
                        >
                          <div className="space-y-3">
                            {/* Top Bar: Difficulty & Star Button */}
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md tracking-wider border ${getDifficultyColor(topic.difficulty)}`}>
                                {topic.difficulty}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(topic.id);
                                }}
                                className="text-slate-500 hover:text-amber-500 transition-colors p-1.5 rounded-lg hover:bg-amber-50"
                                title={isStarred ? 'Unstar Topic' : 'Star Topic'}
                              >
                                <Star size={18} className={isStarred ? 'fill-amber-500 text-amber-500' : ''} />
                              </button>
                            </div>

                            {/* Title & Summary */}
                            <div 
                              onClick={() => onSelectTopic(topic)}
                              className="cursor-pointer space-y-2"
                            >
                              <h4 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors leading-snug">
                                {topic.title}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                {topic.summary}
                              </p>
                            </div>

                            {/* Key Concepts Preview */}
                            {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                              <div className="space-y-2 pt-3 border-t border-slate-100">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  CORE TAKEAWAYS:
                                </span>
                                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 font-medium">
                                  {topic.keyConcepts.slice(0, 2).map((kc, idx) => (
                                    <li key={idx} className="line-clamp-2 flex items-start gap-2">
                                      <span className="text-blue-500 font-bold text-base shrink-0">•</span>
                                      <span className="leading-relaxed">{kc}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Company Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {topic.companyTags.map((c, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Bottom Bar: Status Selector & Actions */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(topic.id)}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Personal Notes Trigger */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenNote(topic.id, topic.title);
                                }}
                                className={`p-2 rounded-xl border transition-all ${
                                  hasNote
                                    ? 'bg-purple-50 text-purple-600 border-purple-200'
                                    : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                                title="Personal Note"
                              >
                                <FileText size={16} />
                              </button>

                              {/* Open Full Topic Details */}
                              <button
                                onClick={() => onSelectTopic(topic)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all text-xs sm:text-sm font-bold shrink-0"
                              >
                                <span>Study</span>
                                <ChevronRight size={16} />
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


