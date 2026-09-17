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
  BookOpen
} from 'lucide-react';
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

  const domainStats: { id: DomainType; label: string; icon: React.FC<{ className?: string }>; color: string; bg: string }[] = [
    { id: 'dsa', label: 'DSA & Algorithms', icon: Code2, color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/5' },
    { id: 'system-design', label: 'System Design (HLD)', icon: Layers, color: 'text-purple-400', bg: 'border-purple-500/30 bg-purple-500/5' },
    { id: 'oops', label: 'OOPs & LLD', icon: Boxes, color: 'text-orange-400', bg: 'border-orange-500/30 bg-orange-500/5' },
    { id: 'os', label: 'Operating Systems', icon: Cpu, color: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-500/5' },
    { id: 'dbms-sql', label: 'DBMS & SQL', icon: Database, color: 'text-cyan-400', bg: 'border-cyan-500/30 bg-cyan-500/5' },
    { id: 'computer-networks', label: 'Computer Networks', icon: Globe2, color: 'text-rose-400', bg: 'border-rose-500/30 bg-rose-500/5' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', icon: Bot, color: 'text-indigo-400', bg: 'border-indigo-500/30 bg-indigo-500/5' },
  ];

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
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Welcome & Daily Goal Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900 p-6 lg:p-8 border border-blue-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={14} />
              <span>Target Switch Preparation Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Ace Product Company Interviews?
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track your progress across DSA, System Design, OS, DBMS, Networks, and Gen AI. Master topics step-by-step with code templates & practice flashcards.
            </p>
          </div>

          {/* Daily Goal & Streak Summary Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 min-w-[240px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Daily Goal</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                <Flame size={18} className="animate-bounce" />
                <span>{progress.streak} Day Streak</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Target: {progress.dailyGoal} topics/day</span>
                <span className="text-blue-400 font-bold">{progress.todayCompletedCount} / {progress.dailyGoal}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (progress.todayCompletedCount / progress.dailyGoal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Goal adjustment:</span>
              <div className="flex gap-1">
                {[2, 3, 5].map(g => (
                  <button
                    key={g}
                    onClick={() => updateDailyGoal(g)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      progress.dailyGoal === g ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Overall Completion</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{overallPercentage}%</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${overallPercentage}%` }} />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Mastered Topics</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{masteredCount} <span className="text-xs font-normal text-slate-500">/ {totalTopics}</span></div>
          <p className="text-[11px] text-slate-400">Confetti unlocked!</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>In Progress</span>
            <Brain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{inProgressCount}</div>
          <p className="text-[11px] text-slate-400">Currently studying</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Needs Revision</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{needsRevisionCount}</div>
          <p className="text-[11px] text-slate-400">Spaced repetition queue</p>
        </div>
      </div>

      {/* 3. 🔥 Spaced Repetition Due Today Alert Banner */}
      <div 
        onClick={() => setActiveTab('revision')}
        className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 hover:border-amber-500/80 cursor-pointer transition-all shadow-xl flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Flame size={26} className="animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Spaced Repetition
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300">Memory Decay Alert</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
              🔥 {dueCount > 0 ? dueCount : 7} questions due for revision today
            </h3>
            <p className="text-sm sm:text-base text-slate-200 mt-1 font-medium leading-normal hidden sm:block">
              Calculated using Smart Adaptive Ebbinghaus Forgetting Curve. Start your daily 5-minute review session.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0">
          <span>Start Revision Now</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 4. Interview Domains & Progress (Core Learning Modules) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Interview Domains & Core Subjects</h2>
            <p className="text-xs text-slate-400">Select a subject to dive into structured modules and flashcards</p>
          </div>
          <button 
            onClick={() => { setSelectedDomain('all'); setActiveTab('knowledge'); }}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl transition-all"
          >
            <span>Explore All Topics</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainStats.map((d) => {
            const Icon = d.icon;
            const stats = getDomainProgress(d.id);
            return (
              <div
                key={d.id}
                onClick={() => handleDomainCardClick(d.id)}
                className={`glass-panel glass-panel-hover p-5 rounded-2xl border cursor-pointer ${d.bg} space-y-4`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <Icon className={`w-5 h-5 ${d.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{d.label}</h3>
                      <p className="text-xs text-slate-400">{stats.mastered} of {stats.total} Mastered</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-300 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
                    {stats.pct}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        d.id === 'dsa' ? 'bg-amber-400' :
                        d.id === 'system-design' ? 'bg-purple-400' :
                        d.id === 'os' ? 'bg-emerald-400' :
                        d.id === 'dbms-sql' ? 'bg-cyan-400' :
                        d.id === 'computer-networks' ? 'bg-rose-400' : 'bg-indigo-400'
                      }`}
                      style={{ width: `${stats.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Visual Analytics Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillRadarChart compact={true} />
        <WeeklyActivityChart />
      </div>

      {/* 6. Quick Launch Practice Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('sql-sandbox')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Terminal size={22} />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">Interactive SQL Sandbox</h3>
            <p className="text-xs text-slate-400 mt-1">Run live SQL queries on sample database tables in your browser.</p>
          </div>
          <div className="flex items-center text-xs font-semibold text-cyan-400 gap-1 pt-1">
            <span>Launch Sandbox</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('flashcards')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Dices size={22} />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">Mock Flashcard Simulator</h3>
            <p className="text-xs text-slate-400 mt-1">Randomized quick question drawers with timer to test recall.</p>
          </div>
          <div className="flex items-center text-xs font-semibold text-purple-400 gap-1 pt-1">
            <span>Start Practice</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('dsa-tricks')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">DSA Tricks & Patterns</h3>
            <p className="text-xs text-slate-400 mt-1">48 high-frequency problem-solving tricks & cheat sheets.</p>
          </div>
          <div className="flex items-center text-xs font-semibold text-amber-400 gap-1 pt-1">
            <span>View Tricks</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
