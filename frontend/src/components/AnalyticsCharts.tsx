import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';
import { DomainType } from '../types';
import { SkillRadarChart } from './common/SkillRadarChart';
import { DomainDonutChart } from './common/DomainDonutChart';
import { WeeklyActivityChart } from './common/WeeklyActivityChart';
import { Trophy, Flame, Target, CheckCircle2, Brain, Clock, BarChart3 } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { progress } = useProgress();

  const domains: { id: DomainType; label: string; color: string }[] = [
    { id: 'dsa', label: 'DSA & Algorithms', color: 'bg-amber-400' },
    { id: 'system-design', label: 'System Design (HLD)', color: 'bg-purple-400' },
    { id: 'oops', label: 'OOPs & Low-Level Design', color: 'bg-orange-400' },
    { id: 'os', label: 'Operating Systems', color: 'bg-emerald-400' },
    { id: 'dbms-sql', label: 'DBMS & SQL', color: 'bg-cyan-400' },
    { id: 'computer-networks', label: 'Computer Networks', color: 'bg-rose-400' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', color: 'bg-indigo-400' },
  ];

  const masteredCount = Object.values(progress.statuses).filter(s => s === 'mastered').length;
  const inProgressCount = Object.values(progress.statuses).filter(s => s === 'in-progress').length;
  const totalTopics = allTopics.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <BarChart3 size={14} /> VISUAL ANALYTICS & METRICS HUB
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Performance & Skill Matrix Breakdown
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time spider radar, donut distribution, and weekly activity tracker</p>
        </div>
      </div>

      {/* Main Charts Grid: Skill Radar + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillRadarChart />
        <DomainDonutChart />
      </div>

      {/* Weekly Momentum Bar Chart */}
      <WeeklyActivityChart />

      {/* Domain Progress Bars */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="font-bold text-white text-base">Progress Per Tech Domain</h3>
        <div className="space-y-5">
          {domains.map((d) => {
            const domainTopics = allTopics.filter(t => t.domain === d.id);
            const domainMastered = domainTopics.filter(t => progress.statuses[t.id] === 'mastered').length;
            const pct = Math.round((domainMastered / domainTopics.length) * 100);

            return (
              <div key={d.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{d.label}</span>
                  <span className="text-slate-400">{domainMastered} / {domainTopics.length} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${d.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

