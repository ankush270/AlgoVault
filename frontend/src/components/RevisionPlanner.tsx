import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';
import { TopicItem } from '../types';
import { BookmarkCheck, Clock, Star, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface RevisionPlannerProps {
  onSelectTopic: (topic: TopicItem) => void;
}

export const RevisionPlanner: React.FC<RevisionPlannerProps> = ({ onSelectTopic }) => {
  const { progress, updateStatus } = useProgress();

  const revisionTopics = allTopics.filter(
    t => progress.statuses[t.id] === 'needs-revision' || progress.starred[t.id]
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">REVISION QUEUE</span>
            <span className="text-xs text-slate-400">{revisionTopics.length} Items Flagged</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Spaced Repetition & Revision List
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Prioritize reviewing topics marked for revision or starred during mock practice.
          </p>
        </div>
      </div>

      {/* List */}
      {revisionTopics.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Revision Queue is Empty!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Great job! Star questions or mark topics as "Needs Revision" while studying to collect them here for quick review before your interviews.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revisionTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1.5 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                    {topic.category}
                  </span>
                  {progress.starred[topic.id] && (
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                  )}
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">{topic.summary}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(topic.id, 'mastered');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold shrink-0 transition-all flex items-center gap-1"
              >
                <CheckCircle2 size={14} />
                <span>Mark Done</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
