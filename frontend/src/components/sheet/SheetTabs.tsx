import React from 'react';
import { Layers, Zap, Flame, Target, Rocket } from 'lucide-react';

interface SheetTabsProps {
  activeSheetTab: string;
  setActiveSheetTab: (tab: string) => void;
  stats: {
    striver_problems: number;
    love_babbar_problems: number;
    neetcode_150_problems: number;
    fraz_problems: number;
    multi_sheet_problems: number;
  };
}

export const SheetTabs: React.FC<SheetTabsProps> = ({
  activeSheetTab,
  setActiveSheetTab,
  stats,
}) => {
  return (
    <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0D1322]/90 border border-slate-800/90 backdrop-blur-xl shadow-xl">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSheetTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            activeSheetTab === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
              : 'bg-slate-950/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-slate-800/80'
          }`}
        >
          <Layers size={14} className={activeSheetTab === 'all' ? 'text-white' : 'text-cyan-400'} />
          <span>🌐 All Sheets Combined</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono border border-slate-700/60 font-bold">806</span>
        </button>

        <button
          onClick={() => setActiveSheetTab('striver')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            activeSheetTab === 'striver'
              ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
              : 'bg-slate-950/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-slate-800/80'
          }`}
        >
          <Zap size={14} className={activeSheetTab === 'striver' ? 'text-white' : 'text-cyan-400'} />
          <span>⚡ Striver A2Z</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono border border-slate-700/60 font-bold">{stats.striver_problems}</span>
        </button>

        <button
          onClick={() => setActiveSheetTab('love_babbar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            activeSheetTab === 'love_babbar'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25 scale-[1.02]'
              : 'bg-slate-950/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-slate-800/80'
          }`}
        >
          <Flame size={14} className={activeSheetTab === 'love_babbar' ? 'text-white' : 'text-amber-400'} />
          <span>🔥 Love Babbar 450</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono border border-slate-700/60 font-bold">{stats.love_babbar_problems}</span>
        </button>

        <button
          onClick={() => setActiveSheetTab('fraz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            activeSheetTab === 'fraz'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]'
              : 'bg-slate-950/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-slate-800/80'
          }`}
        >
          <Target size={14} className={activeSheetTab === 'fraz' ? 'text-white' : 'text-purple-400'} />
          <span>🎯 Fraz Sheet</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono border border-slate-700/60 font-bold">{stats.fraz_problems}</span>
        </button>

        <button
          onClick={() => setActiveSheetTab('neetcode')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            activeSheetTab === 'neetcode'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
              : 'bg-slate-950/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-slate-800/80'
          }`}
        >
          <Rocket size={14} className={activeSheetTab === 'neetcode' ? 'text-white' : 'text-emerald-400'} />
          <span>🚀 NeetCode 150</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono border border-slate-700/60 font-bold">{stats.neetcode_150_problems}</span>
        </button>

        <button
          onClick={() => setActiveSheetTab('multi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            activeSheetTab === 'multi'
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]'
              : 'bg-slate-950/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-slate-800/80'
          }`}
        >
          <span>👑 Multi-Sheet Overlaps</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono border border-slate-700/60 font-bold">{stats.multi_sheet_problems}</span>
        </button>
      </div>
    </div>
  );
};
