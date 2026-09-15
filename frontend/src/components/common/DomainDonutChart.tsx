import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { allTopics } from '../../data/allData';
import { PieChart, CheckCircle2, Brain, Clock, CircleAlert } from 'lucide-react';

export const DomainDonutChart: React.FC = () => {
  const { progress } = useProgress();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const masteredCount = Object.values(progress.statuses).filter(s => s === 'mastered').length;
  const inProgressCount = Object.values(progress.statuses).filter(s => s === 'in-progress').length;
  const needsRevisionCount = Object.values(progress.statuses).filter(s => s === 'needs-revision').length;
  const total = allTopics.length;
  const unreadCount = Math.max(0, total - masteredCount - inProgressCount - needsRevisionCount);

  const segments = [
    { label: 'Mastered', count: masteredCount, color: '#10b981', hoverColor: '#34d399', icon: CheckCircle2 },
    { label: 'In Progress', count: inProgressCount, color: '#f59e0b', hoverColor: '#fbbf24', icon: Brain },
    { label: 'Needs Revision', count: needsRevisionCount, color: '#a855f7', hoverColor: '#c084fc', icon: Clock },
    { label: 'Not Started', count: unreadCount, color: '#334155', hoverColor: '#475569', icon: CircleAlert },
  ];

  // Donut SVG geometry
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedAngle = 0;

  const masteredPct = Math.round((masteredCount / total) * 100);

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <PieChart size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Mastery Breakdown</h3>
            <p className="text-[11px] text-slate-400">Status distribution gauge</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-2">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {segments.map((seg, i) => {
              const pct = seg.count / total;
              const strokeDasharray = `${pct * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedAngle * circumference;
              accumulatedAngle += pct;
              const isSelected = activeIdx === i;

              return (
                <circle
                  key={seg.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={isSelected ? seg.hoverColor : seg.color}
                  strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  className="cursor-pointer transition-all duration-300 ease-out"
                />
              );
            })}
          </svg>

          {/* Central Donut Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-white">{masteredPct}%</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mastered</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 w-full sm:w-auto">
          {segments.map((seg, i) => {
            const Icon = seg.icon;
            const pct = Math.round((seg.count / total) * 100);
            const isHovered = activeIdx === i;

            return (
              <div
                key={seg.label}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`flex items-center justify-between gap-4 p-2 rounded-xl transition-all cursor-pointer border ${
                  isHovered ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-900/40 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  <Icon size={14} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-300">{seg.label}</span>
                </div>
                <span className="text-xs font-bold text-white">
                  {seg.count} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
