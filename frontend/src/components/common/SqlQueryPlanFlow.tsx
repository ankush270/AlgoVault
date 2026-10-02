import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, Terminal, Cpu } from 'lucide-react';

interface StepDef {
  stepNum: number;
  clause: string;
  name: string;
  desc: string;
  iconColor: string;
  borderColor: string;
  bgColor: string;
}

export const SqlQueryPlanFlow: React.FC<{ userQuery?: string }> = ({ userQuery }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps: StepDef[] = [
    { stepNum: 1, clause: 'FROM & JOIN', name: 'Load Tables', desc: 'Identify target tables & compute Cartesian product / join predicates', iconColor: 'text-cyan-600', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-50' },
    { stepNum: 2, clause: 'WHERE', name: 'Row Filtering', desc: 'Apply boolean conditions to eliminate non-matching individual rows early', iconColor: 'text-blue-600', borderColor: 'border-blue-200', bgColor: 'bg-blue-50' },
    { stepNum: 3, clause: 'GROUP BY', name: 'Row Aggregation', desc: 'Group remaining rows into buckets based on specified key columns', iconColor: 'text-purple-600', borderColor: 'border-purple-200', bgColor: 'bg-purple-50' },
    { stepNum: 4, clause: 'HAVING', name: 'Group Filtering', desc: 'Filter aggregated groups using aggregate function criteria (SUM, COUNT)', iconColor: 'text-amber-600', borderColor: 'border-amber-200', bgColor: 'bg-amber-50' },
    { stepNum: 5, clause: 'SELECT', name: 'Column Projection', desc: 'Select requested expressions, aliases, and window functions', iconColor: 'text-emerald-600', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-50' },
    { stepNum: 6, clause: 'ORDER BY', name: 'Sorting', desc: 'Sort final dataset according to ASC / DESC ordering criteria', iconColor: 'text-rose-600', borderColor: 'border-rose-500/40', bgColor: 'bg-rose-50' },
    { stepNum: 7, clause: 'LIMIT / OFFSET', name: 'Output Slicing', desc: 'Cap total returned rows for display or pagination', iconColor: 'text-indigo-600', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-50' },
  ];

  return (
    <div className="card-surface p-6 rounded-3xl border border-slate-200 space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-500/20 text-purple-600">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              SQL Engine Query Execution Order Flow
            </h3>
            <p className="text-xs text-slate-400">Step-by-step visual execution pipeline inside database engine</p>
          </div>
        </div>

        <div className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Logical Order $\neq$ Written Order
        </div>
      </div>

      {/* Steps Flow Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2">
        {steps.map((s) => {
          const isActive = activeStep === s.stepNum;
          return (
            <div
              key={s.stepNum}
              onClick={() => setActiveStep(s.stepNum)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                isActive
                  ? `${s.bgColor} ${s.borderColor} shadow-lg scale-105`
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>STEP {s.stepNum}</span>
                {isActive && <CheckCircle2 size={12} className={s.iconColor} />}
              </div>
              <div className={`font-black text-xs ${isActive ? s.iconColor : 'text-slate-600'}`}>
                {s.clause}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.name}</div>
            </div>
          );
        })}
      </div>

      {/* Active Step Details Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border flex-shrink-0 ${steps[activeStep - 1].bgColor} ${steps[activeStep - 1].borderColor} ${steps[activeStep - 1].iconColor}`}>
          {activeStep}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold text-sm ${steps[activeStep - 1].iconColor}`}>
              {steps[activeStep - 1].clause}
            </span>
            <span className="text-xs font-semibold text-slate-500">({steps[activeStep - 1].name})</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {steps[activeStep - 1].desc}
          </p>
        </div>
      </div>
    </div>
  );
};
