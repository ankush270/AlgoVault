import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  Clock, 
  Brain, 
  FileText, 
  Filter, 
  Search, 
  Sparkles,
  Tag,
  Building2,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';
import { DomainType, Difficulty, ItemStatus, TopicItem } from '../types';

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
  const { progress, updateStatus, toggleStar } = useProgress();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus | 'all'>('all');
  const [onlyStarred, setOnlyStarred] = useState(false);

  // Filter topics
  const filteredTopics = allTopics.filter((topic) => {
    // Domain match
    if (selectedDomain !== 'all' && topic.domain !== selectedDomain) return false;

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Curriculum & Knowledge Modules</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredTopics.length} of {allTopics.length} technical interview topics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="mastered">Mastered</option>
            <option value="needs-revision">Needs Revision</option>
          </select>

          {/* Starred Toggle */}
          <button
            onClick={() => setOnlyStarred(!onlyStarred)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              onlyStarred
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Star size={14} className={onlyStarred ? 'fill-amber-400 text-amber-400' : ''} />
            <span>Starred</span>
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Filter className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Topics Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or filters to explore the full curriculum.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('all');
              setSelectedStatus('all');
              setOnlyStarred(false);
              setSelectedDomain('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => {
            const isStarred = !!progress.starred[topic.id];
            const hasNote = !!progress.notes[topic.id];
            const currentStatus = progress.statuses[topic.id] || 'todo';

            return (
              <div
                key={topic.id}
                className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category & Star */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                      {topic.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(topic.id);
                      }}
                      className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                    >
                      <Star size={16} className={isStarred ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>
                  </div>

                  {/* Title & Summary */}
                  <div 
                    onClick={() => onSelectTopic(topic)}
                    className="cursor-pointer space-y-1.5"
                  >
                    <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  {/* Company Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {topic.companyTags.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Status Selector & Note Trigger */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(topic.id)}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Notes Trigger Button */}
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
                      <FileText size={14} />
                    </button>

                    {/* Quick Open Details Button */}
                    <button
                      onClick={() => onSelectTopic(topic)}
                      className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition-all"
                    >
                      <ChevronRight size={14} />
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
};
