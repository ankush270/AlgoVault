import React from 'react';
import { Sparkles, CheckCircle2, Flame, Award, BarChart2, Layers } from 'lucide-react';

interface SheetHeaderProps {
  activeSheetTab: string;
  solvedCount: number;
  totalProblemsCount: number;
  progressPercentage: number;
  stats?: {
    striver_problems: number;
    love_babbar_problems: number;
    neetcode_150_problems: number;
    fraz_problems: number;
    multi_sheet_problems: number;
  };
  difficultyStats: { easy: number; medium: number; hard: number; easySolved: number; mediumSolved: number; hardSolved: number };
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({
  activeSheetTab,
  solvedCount,
  totalProblemsCount,
  progressPercentage,
  difficultyStats,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D1527] via-[#0B0F19] to-[#121B35] border border-slate-800/90 relative overflow-hidden shadow-2xl">
        {/* Glow ambient background circles */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-sm">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>Structured Master DSA Roadmap</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
              <span>Master DSA Sheet</span>
              <span className="text-xs sm:text-sm px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 via-emerald-500/20 to-amber-500/20 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm">
                {activeSheetTab === 'all' && '🌐 All Sheets Combined (806)'}
                {activeSheetTab === 'striver' && '⚡ Striver A2Z (661)'}
                {activeSheetTab === 'love_babbar' && '🔥 Love Babbar 450 (424)'}
                {activeSheetTab === 'fraz' && '🎯 Fraz Sheet (286)'}
                {activeSheetTab === 'neetcode' && '🚀 NeetCode 150 (132)'}
                {activeSheetTab === 'multi' && '👑 Multi-Sheet Overlaps (583)'}
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Zero duplicates. Master Arrays, Dynamic Programming, Trees & Graphs across Striver, Love Babbar, Fraz & NeetCode 150!
            </p>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-3 pt-1 flex-wrap text-xs text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-medium">
                <Layers size={14} className="text-cyan-400" />
                <span className="font-bold text-white">{totalProblemsCount}</span> Total Problems
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-medium">
                <Award size={14} className="text-emerald-400" />
                <span className="font-bold text-white">14</span> Core Categories
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-medium">
                <BarChart2 size={14} className="text-purple-400" />
                <span className="font-bold text-white">0</span> Duplicates
              </span>
            </div>
          </div>

          {/* Progress Card */}
          <div className="w-full lg:w-auto min-w-[270px] p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-3.5 shrink-0 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Flame size={15} className="text-amber-400" />
                <span>Completion Status</span>
              </span>
              <span className="font-black text-cyan-300 font-mono text-sm">{solvedCount} / {totalProblemsCount} ({progressPercentage}%)</span>
            </div>
            
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 font-medium">
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <CheckCircle2 size={13} /> {solvedCount} Solved
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <Flame size={13} /> {totalProblemsCount - solvedCount} Left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown Informative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Easy Card */}
        <div className="p-4.5 rounded-2xl bg-[#0D1322]/90 border border-emerald-500/25 hover:border-emerald-500/50 transition-all flex items-center justify-between shadow-xl group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Easy Problems</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {difficultyStats.easySolved} <span className="text-xs font-normal text-slate-400">/ {difficultyStats.easy}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xs font-mono group-hover:scale-105 transition-transform shadow-sm">
            {difficultyStats.easy > 0 ? Math.round((difficultyStats.easySolved / difficultyStats.easy) * 100) : 0}%
          </div>
        </div>

        {/* Medium Card */}
        <div className="p-4.5 rounded-2xl bg-[#0D1322]/90 border border-amber-500/25 hover:border-amber-500/50 transition-all flex items-center justify-between shadow-xl group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Medium Problems</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {difficultyStats.mediumSolved} <span className="text-xs font-normal text-slate-400">/ {difficultyStats.medium}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-xs font-mono group-hover:scale-105 transition-transform shadow-sm">
            {difficultyStats.medium > 0 ? Math.round((difficultyStats.mediumSolved / difficultyStats.medium) * 100) : 0}%
          </div>
        </div>

        {/* Hard Card */}
        <div className="p-4.5 rounded-2xl bg-[#0D1322]/90 border border-rose-500/25 hover:border-rose-500/50 transition-all flex items-center justify-between shadow-xl group">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider">Hard Problems</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {difficultyStats.hardSolved} <span className="text-xs font-normal text-slate-400">/ {difficultyStats.hard}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-black text-rose-400 text-xs font-mono group-hover:scale-105 transition-transform shadow-sm">
            {difficultyStats.hard > 0 ? Math.round((difficultyStats.hardSolved / difficultyStats.hard) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};
