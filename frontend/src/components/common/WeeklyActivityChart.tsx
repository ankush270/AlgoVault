import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Flame, Calendar, TrendingUp } from 'lucide-react';

export const WeeklyActivityChart: React.FC = () => {
  const { progress } = useProgress();

  // Days of week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Convert Sun=0 to Sun=6 index

  // Calculate dynamic weekly counts (today has `progress.todayCompletedCount`, simulated historical baseline based on streak)
  const weeklyCounts = days.map((day, idx) => {
    if (idx === todayIdx) return progress.todayCompletedCount;
    if (idx < todayIdx) {
      // Past days in current week - if streak active, show goal or near goal
      return Math.max(1, Math.min(progress.dailyGoal + 1, Math.floor(progress.dailyGoal * 0.9 + (idx % 2))));
    }
    return 0; // Future days
  });

  const maxVal = Math.max(progress.dailyGoal + 2, ...weeklyCounts, 5);

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Weekly Momentum</h3>
            <p className="text-[11px] text-slate-400">7-Day Study Activity & Streak</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Flame size={14} className="animate-bounce" />
          <span>{progress.streak} Day Streak</span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative pt-4 pb-2">
        {/* Goal Target Dashed Line */}
        <div 
          className="absolute left-0 right-0 border-b border-dashed border-blue-400/40 z-10 flex justify-end pr-1 pointer-events-none"
          style={{ bottom: `${(progress.dailyGoal / maxVal) * 100 + 15}%` }}
        >
          <span className="text-[9px] font-bold text-blue-400 bg-slate-900 px-1 py-0.5 rounded border border-blue-500/30">
            Goal: {progress.dailyGoal}/d
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 h-36 px-2">
          {days.map((day, i) => {
            const count = weeklyCounts[i];
            const heightPct = Math.round((count / maxVal) * 100);
            const isToday = i === todayIdx;
            const metGoal = count >= progress.dailyGoal;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {count}
                </span>

                <div className="w-full bg-slate-900/80 rounded-t-xl h-full flex items-end p-1 border border-slate-800">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-lg shadow-cyan-500/20'
                        : metGoal
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : count > 0
                        ? 'bg-gradient-to-t from-slate-700 to-slate-500'
                        : 'bg-slate-800/40'
                    }`}
                    style={{ height: `${Math.max(6, heightPct)}%` }}
                  />
                </div>

                <div className={`text-[11px] font-bold ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
