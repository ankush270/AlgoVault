import React from 'react';
import { Search, BookMarked, CheckCircle2 } from 'lucide-react';
import { SqlProblem, SqlMasterSheetData } from '../../types';

interface SqlProblemAccordionProps {
  sheetData: SqlMasterSheetData | null;
  filteredProblemsList: SqlProblem[];
  selectedProblem: SqlProblem | null;
  onSelectProblem: (prob: SqlProblem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (plt: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (diff: string) => void;
  isLoading: boolean;
}

export const SqlProblemAccordion: React.FC<SqlProblemAccordionProps> = ({
  sheetData,
  filteredProblemsList,
  selectedProblem,
  onSelectProblem,
  searchQuery,
  setSearchQuery,
  selectedPlatform,
  setSelectedPlatform,
  selectedDifficulty,
  setSelectedDifficulty,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <BookMarked size={16} className="text-cyan-400" />
            <span>SQL Questions ({filteredProblemsList.length})</span>
          </h3>
          {sheetData && (
            <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30">
              Total {sheetData.total_problems}
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        {/* Platform Selector Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Source:</label>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: '🌐 All' },
              { id: 'datalemur', label: 'DataLemur (50)' },
              { id: 'leetcode', label: 'LeetCode 50' },
              { id: 'hackerrank', label: 'HackerRank (50)' },
              { id: 'stratascratch', label: 'StrataScratch' },
              { id: 'sqlbolt', label: 'SQLBolt' },
            ].map((plt) => (
              <button
                key={plt.id}
                onClick={() => setSelectedPlatform(plt.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  selectedPlatform === plt.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-extrabold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {plt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty:</span>
          {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                selectedDifficulty === diff
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Scroll List */}
      <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <span>Loading SQL Questions...</span>
          </div>
        ) : filteredProblemsList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-[#0D1322] rounded-2xl border border-slate-800">
            No SQL questions found matching your filter criteria.
          </div>
        ) : (
          filteredProblemsList.map((prob) => {
            const isSelected = selectedProblem?.id === prob.id;

            let platBadge = 'LeetCode';
            let platColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            if (prob.id.startsWith('dl-')) {
              platBadge = 'DataLemur';
              platColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
            } else if (prob.id.startsWith('hr-')) {
              platBadge = 'HackerRank';
              platColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            } else if (prob.id.startsWith('ss-')) {
              platBadge = 'StrataScratch';
              platColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            } else if (prob.id.startsWith('sb-')) {
              platBadge = 'SQLBolt';
              platColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            }

            let diffColor = 'text-emerald-400';
            if (prob.difficulty === 'Medium') diffColor = 'text-amber-400';
            if (prob.difficulty === 'Hard') diffColor = 'text-rose-400';

            return (
              <button
                key={prob.id}
                onClick={() => onSelectProblem(prob)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/60 to-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                    : 'bg-[#0A101D] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${platColor}`}
                  >
                    {platBadge}
                  </span>
                  <span className={`text-[10px] font-bold font-mono ${diffColor}`}>
                    {prob.difficulty}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-100 line-clamp-1 flex items-center justify-between">
                  <span>{prob.title}</span>
                  {isSelected && <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />}
                </div>

                {prob.company && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <span>🏢 {prob.company}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
