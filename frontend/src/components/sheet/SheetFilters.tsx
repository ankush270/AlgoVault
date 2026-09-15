import React, { useRef, useEffect } from 'react';
import { Search, FolderTree, SlidersHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';
import { TOPIC_CATEGORIES } from './types';

interface SheetFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTopicFilter: string;
  setSelectedTopicFilter: (topic: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (diff: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  totalProblemsCount: number;
  totalTopicsCount: number;
  expandAllTopics: () => void;
  collapseAllTopics: () => void;
}

export const SheetFilters: React.FC<SheetFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTopicFilter,
  setSelectedTopicFilter,
  selectedDifficulty,
  setSelectedDifficulty,
  filterStatus,
  setFilterStatus,
  totalProblemsCount,
  totalTopicsCount,
  expandAllTopics,
  collapseAllTopics,
}) => {
  const [openDropdown, setOpenDropdown] = React.useState<'topic' | 'diff' | 'status' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const topicOptions = [
    { value: 'all', label: `All Topics (${totalTopicsCount})`, icon: '📂' },
    ...TOPIC_CATEGORIES.map((cat) => ({
      value: cat.id,
      label: cat.title,
      icon: cat.icon,
    })),
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Difficulties', color: 'text-slate-300' },
    { value: 'Easy', label: 'Easy', icon: '🟢', color: 'text-emerald-400' },
    { value: 'Medium', label: 'Medium', icon: '🟡', color: 'text-amber-400' },
    { value: 'Hard', label: 'Hard', icon: '🔴', color: 'text-rose-400' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'solved', label: 'Solved Only', icon: '✅' },
    { value: 'unsolved', label: 'Unsolved Only', icon: '⏳' },
  ];

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0D1322]/90 border border-slate-800/90 backdrop-blur-xl relative shadow-xl"
    >
      {/* Search & Action Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0D1322]/90 border border-slate-800/90 backdrop-blur-xl relative shadow-xl">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${totalProblemsCount} problems, concepts, tags...`}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Controls Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Expand / Collapse All Topics Button */}
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl overflow-hidden p-0.5">
            <button
              onClick={expandAllTopics}
              className="px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-lg transition-all flex items-center gap-1.5"
              title="Expand All Topic Categories"
            >
              <Maximize2 size={13} />
              <span>Expand</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-800" />
            <button
              onClick={collapseAllTopics}
              className="px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-amber-300 hover:bg-slate-900 rounded-lg transition-all flex items-center gap-1.5"
              title="Collapse All Topic Categories"
            >
              <Minimize2 size={13} />
              <span>Collapse</span>
            </button>
          </div>

          {/* Custom Glass Dropdowns */}
          <CustomDropdown
            options={topicOptions}
            selectedValue={selectedTopicFilter}
            onSelect={(val) => {
              setSelectedTopicFilter(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'topic'}
            onToggle={() => setOpenDropdown(openDropdown === 'topic' ? null : 'topic')}
            buttonIcon={<FolderTree size={14} className="text-cyan-400" />}
            dropdownWidth="w-64"
          />

          <CustomDropdown
            options={difficultyOptions}
            selectedValue={selectedDifficulty}
            onSelect={(val) => {
              setSelectedDifficulty(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'diff'}
            onToggle={() => setOpenDropdown(openDropdown === 'diff' ? null : 'diff')}
            buttonIcon={<SlidersHorizontal size={14} className="text-slate-400" />}
            dropdownWidth="w-48"
          />

          <CustomDropdown
            options={statusOptions}
            selectedValue={filterStatus}
            onSelect={(val) => {
              setFilterStatus(val);
              setOpenDropdown(null);
            }}
            isOpen={openDropdown === 'status'}
            onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
            dropdownWidth="w-44"
          />
        </div>
      </div>

      {/* Topic Category Quick-Filter Buttons (Array, String, Graph, DP, etc.) */}
      <div className="p-3.5 rounded-2xl bg-[#0D1322]/80 border border-slate-800/90 backdrop-blur-xl shadow-lg space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <FolderTree size={14} />
            <span>Click Topic Name to Show Only That Category:</span>
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

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedTopicFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTopicFilter === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 scale-[1.02]'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            📂 All Topics
          </button>

          {TOPIC_CATEGORIES.map((cat) => {
            const isSelected = selectedTopicFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedTopicFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02] border border-cyan-400/40'
                    : 'bg-slate-950/90 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/90'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
