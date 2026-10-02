import React from 'react';
import { BookOpen, Building2, CheckCircle2, Bookmark, BarChart3, PieChart } from 'lucide-react';
import { LeetCodeCompany } from '../../types';

interface LeetCodeCompanyStatsProps {
  totalQuestions: number;
  totalCompanies: number;
  solvedCount: number;
  reviewCount: number;
  companyAnalytics: { name: string; questionCount: number }[];
  onSelectCompany: (company: string) => void;
  difficultyStats: { easy: number; medium: number; hard: number };
}

export const LeetCodeCompanyStats: React.FC<LeetCodeCompanyStatsProps> = ({
  totalQuestions,
  totalCompanies,
  solvedCount,
  reviewCount,
  companyAnalytics,
  onSelectCompany,
  difficultyStats,
}) => {
  const topCompanies = companyAnalytics.slice(0, 10);
  const maxCount = topCompanies[0]?.questionCount || 1;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-sm">
          <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Questions</p>
            <p className="text-lg font-black text-white">{totalQuestions.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-sm">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Companies</p>
            <p className="text-lg font-black text-white">{totalCompanies}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solved</p>
            <p className="text-lg font-black text-emerald-600">{solvedCount}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm shadow-sm">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-500/20">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review List</p>
            <p className="text-lg font-black text-amber-600">{reviewCount}</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-5 rounded-3xl border border-slate-200 space-y-4 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Top Tech Companies Question Frequency</h3>
                <p className="text-[11px] text-slate-400">Question count distribution across top tech giants</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            {topCompanies.map((c) => {
              const pct = Math.round((c.questionCount / maxCount) * 100);
              return (
                <button
                  key={c.name}
                  onClick={() => onSelectCompany(c.name)}
                  className="group p-3 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500/50 hover:bg-slate-50 transition-all text-left flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-cyan-700 truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50 px-1.5 py-0.5 rounded-md border border-cyan-500/20">
                      {c.questionCount}
                    </span>
                  </div>

                  <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500 group-hover:from-cyan-400 group-hover:to-emerald-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Distribution Card */}
        <div className="card-surface p-5 rounded-3xl border border-slate-200 space-y-4 bg-slate-50/80 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-500/20 text-purple-600">
              <PieChart size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Difficulty Breakdown</h3>
              <p className="text-[11px] text-slate-400">Question split across Easy, Medium & Hard</p>
            </div>
          </div>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600">Easy</span>
                <span className="text-slate-500 font-mono">{difficultyStats.easy}</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{
                    width: `${Math.round(
                      (difficultyStats.easy / (totalQuestions || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-600">Medium</span>
                <span className="text-slate-500 font-mono">{difficultyStats.medium}</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{
                    width: `${Math.round(
                      (difficultyStats.medium / (totalQuestions || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-rose-600">Hard</span>
                <span className="text-slate-500 font-mono">{difficultyStats.hard}</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-rose-400 h-full rounded-full"
                  style={{
                    width: `${Math.round(
                      (difficultyStats.hard / (totalQuestions || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
