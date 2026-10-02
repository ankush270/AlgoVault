import React from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Brain, 
  Code2, 
  Layers, 
  Cpu, 
  Database, 
  Globe2, 
  Bot, 
  Boxes,
  ArrowRight, 
  Sparkles,
  Target,
  Clock,
  Terminal,
  Dices,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import dashboardConfig from '../../public/data/config/dashboard_config.json';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Code2,
  Layers,
  Boxes,
  Cpu,
  Database,
  Globe2,
  Bot
};
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';
import { DomainType } from '../types';
import { SkillRadarChart } from './common/SkillRadarChart';
import { WeeklyActivityChart } from './common/WeeklyActivityChart';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  setSelectedDomain: (d: DomainType | 'all') => void;
  setSelectedTopicId: (id: string | null) => void;
}

// Domain card tint mapping for light theme
const domainTints: Record<string, { bg: string; iconBg: string; barColor: string; iconColor: string }> = {
  'dsa': { bg: 'bg-amber-50/80 hover:bg-amber-50 border-amber-200/60', iconBg: 'bg-amber-100', barColor: 'bg-amber-500', iconColor: 'text-amber-600' },
  'system-design': { bg: 'bg-purple-50/80 hover:bg-purple-50 border-purple-200/60', iconBg: 'bg-purple-100', barColor: 'bg-purple-500', iconColor: 'text-purple-600' },
  'os': { bg: 'bg-emerald-50/80 hover:bg-emerald-50 border-emerald-200/60', iconBg: 'bg-emerald-100', barColor: 'bg-emerald-500', iconColor: 'text-emerald-600' },
  'oops': { bg: 'bg-orange-50/80 hover:bg-orange-50 border-orange-200/60', iconBg: 'bg-orange-100', barColor: 'bg-orange-500', iconColor: 'text-orange-600' },
  'dbms-sql': { bg: 'bg-cyan-50/80 hover:bg-cyan-50 border-cyan-200/60', iconBg: 'bg-cyan-100', barColor: 'bg-cyan-500', iconColor: 'text-cyan-600' },
  'computer-networks': { bg: 'bg-rose-50/80 hover:bg-rose-50 border-rose-200/60', iconBg: 'bg-rose-100', barColor: 'bg-rose-500', iconColor: 'text-rose-600' },
  'javascript': { bg: 'bg-yellow-50/80 hover:bg-yellow-50 border-yellow-200/60', iconBg: 'bg-yellow-100', barColor: 'bg-yellow-500', iconColor: 'text-yellow-600' },
  'react': { bg: 'bg-sky-50/80 hover:bg-sky-50 border-sky-200/60', iconBg: 'bg-sky-100', barColor: 'bg-sky-500', iconColor: 'text-sky-600' },
  'nodejs': { bg: 'bg-green-50/80 hover:bg-green-50 border-green-200/60', iconBg: 'bg-green-100', barColor: 'bg-green-500', iconColor: 'text-green-600' },
  'genai-ml': { bg: 'bg-indigo-50/80 hover:bg-indigo-50 border-indigo-200/60', iconBg: 'bg-indigo-100', barColor: 'bg-indigo-500', iconColor: 'text-indigo-600' },
};

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  setSelectedDomain,
  setSelectedTopicId,
}) => {
  const { progress, updateDailyGoal, getDueRevisionsCount } = useProgress();

  const masteredCount = Object.values(progress.statuses).filter(s => s === 'mastered').length;
  const inProgressCount = Object.values(progress.statuses).filter(s => s === 'in-progress').length;
  const needsRevisionCount = Object.values(progress.statuses).filter(s => s === 'needs-revision').length;
  const dueCount = getDueRevisionsCount();
  const totalTopics = allTopics.length;
  const overallPercentage = Math.round((masteredCount / totalTopics) * 100);

  const domainStats = dashboardConfig.domains.map((d) => ({
    id: d.id as DomainType,
    label: d.label,
    icon: ICON_MAP[d.iconName] || Code2,
    color: d.color,
    bg: d.bg,
  }));

  const getDomainProgress = (domainId: DomainType) => {
    const domainTopics = allTopics.filter(t => t.domain === domainId);
    const domainMastered = domainTopics.filter(t => progress.statuses[t.id] === 'mastered').length;
    return {
      mastered: domainMastered,
      total: domainTopics.length,
      pct: Math.round((domainMastered / domainTopics.length) * 100)
    };
  };

  const handleDomainCardClick = (domainId: DomainType) => {
    setSelectedDomain(domainId);
    setActiveTab('knowledge');
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fadeIn">
      {/* 1. Hero Welcome & Daily Goal Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 sm:p-6 lg:p-8 border border-blue-200/50 shadow-sm">
        {/* Decorative gradient blob */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/30 via-purple-200/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Sparkles size={14} />
              <span>Target Switch Preparation Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ready to Ace Product Company Interviews?
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
              Track your progress across DSA, System Design, OS, DBMS, Networks, and Gen AI.
            </p>
          </div>

          {/* Daily Goal & Streak Summary Widget */}
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm w-full sm:min-w-[260px] sm:max-w-[320px] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Goal</span>
              <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Flame size={16} className="animate-bounce" />
                <span>{progress.streak} Day Streak</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">Target: {progress.dailyGoal} topics/day</span>
                <span className="text-blue-600 font-bold">{progress.todayCompletedCount} / {progress.dailyGoal}</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-bar bg-gradient-to-r from-blue-500 to-emerald-500"
                  style={{ width: `${Math.min(100, (progress.todayCompletedCount / progress.dailyGoal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Goal adjustment:</span>
              <div className="flex gap-1">
                {[2, 3, 5].map(g => (
                  <button
                    key={g}
                    onClick={() => updateDailyGoal(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      progress.dailyGoal === g 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {g}/d
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overview Metrics Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <div className="card-surface p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overall Completion</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{overallPercentage}%</div>
          <div className="progress-track">
            <div className="progress-bar bg-blue-500" style={{ width: `${overallPercentage}%` }} />
          </div>
        </div>

        <div className="card-surface p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Mastered Topics</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">{masteredCount} <span className="text-sm font-normal text-slate-400">/ {totalTopics}</span></div>
        </div>

        <div className="card-surface p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Brain className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{inProgressCount}</div>
        </div>

        <div className="card-surface p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Needs Revision</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600">{needsRevisionCount}</div>
        </div>
      </div>

      {/* 3. 🔥 Spaced Repetition Due Today Alert Banner */}
      <div 
        onClick={() => setActiveTab('revision')}
        className="card-surface card-surface-hover p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-amber-200/60 hover:border-amber-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 group"
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Flame size={22} className="animate-bounce" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] sm:text-xs font-black uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                Spaced Repetition
              </span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Memory Decay Alert</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-700 transition-colors">
              🔥 {dueCount > 0 ? dueCount : 7} questions due today
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-normal hidden sm:block">
              Calculated using Smart Adaptive Ebbinghaus Forgetting Curve. Start your daily 5-minute review session.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-100 border border-amber-200 px-4 py-2.5 rounded-xl group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all shrink-0 self-end sm:self-auto shadow-sm">
          <span>Start Revision</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 4. Interview Domains & Progress (Core Learning Modules) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Interview Domains & Core Subjects</h2>
            <p className="text-sm text-slate-500 mt-0.5">Select a subject to dive into structured modules and flashcards</p>
          </div>
          <button 
            onClick={() => { setSelectedDomain('all'); setActiveTab('knowledge'); }}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl transition-all hover:bg-blue-100 shadow-sm"
          >
            <span>Explore All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {domainStats.map((d) => {
            const Icon = d.icon;
            const stats = getDomainProgress(d.id);
            const tint = domainTints[d.id] || domainTints['dsa'];
            return (
              <div
                key={d.id}
                onClick={() => handleDomainCardClick(d.id)}
                className={`card-surface card-surface-hover p-4 sm:p-5 cursor-pointer ${tint.bg} space-y-3`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${tint.iconBg} border border-white/50`}>
                      <Icon className={`w-5 h-5 ${tint.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{d.label}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{stats.mastered} of {stats.total} Mastered</p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-700 bg-white/80 px-2.5 py-1 rounded-lg border border-white shadow-sm">
                    {stats.pct}%
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className={`progress-bar ${tint.barColor} transition-all duration-500`}
                    style={{ width: `${stats.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Visual Analytics Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="card-surface p-4 sm:p-5">
          <SkillRadarChart compact={true} />
        </div>
        <div className="card-surface p-4 sm:p-5">
          <WeeklyActivityChart />
        </div>
      </div>

      {/* 6. Quick Launch Practice Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveTab('sql-sandbox')}
          className="card-surface card-surface-hover p-5 cursor-pointer group space-y-3"
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
            <Terminal size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">Interactive SQL Sandbox</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Run live SQL queries on sample database tables in your browser.</p>
          </div>
          <div className="flex items-center text-sm font-semibold text-cyan-600 gap-1.5 pt-1">
            <span>Launch Sandbox</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('flashcards')}
          className="card-surface card-surface-hover p-5 cursor-pointer group space-y-3"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
            <Dices size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Mock Flashcard Simulator</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Randomized quick question drawers with timer to test recall.</p>
          </div>
          <div className="flex items-center text-sm font-semibold text-purple-600 gap-1.5 pt-1">
            <span>Start Practice</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('dsa-tricks')}
          className="card-surface card-surface-hover p-5 cursor-pointer group space-y-3"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">DSA Tricks & Patterns</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">48 high-frequency problem-solving tricks & cheat sheets.</p>
          </div>
          <div className="flex items-center text-sm font-semibold text-amber-600 gap-1.5 pt-1">
            <span>View Tricks</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
