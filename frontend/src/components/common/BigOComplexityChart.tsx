import React, { useState } from 'react';
import { Activity, Sliders, Info, Zap } from 'lucide-react';

interface CurveDef {
  label: string;
  name: string;
  color: string;
  calc: (n: number) => number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Horrible';
  ratingColor: string;
}

export const BigOComplexityChart: React.FC = () => {
  const [inputN, setInputN] = useState<number>(20);
  const [scaleMode, setScaleMode] = useState<'linear' | 'log'>('linear');
  const [hoveredCurve, setHoveredCurve] = useState<string | null>(null);

  const curves: CurveDef[] = [
    { label: 'O(1)', name: 'Constant Time', color: '#10b981', calc: () => 1, rating: 'Excellent', ratingColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'O(log N)', name: 'Logarithmic', color: '#06b6d4', calc: (n) => Math.log2(Math.max(1, n)), rating: 'Excellent', ratingColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { label: 'O(N)', name: 'Linear Time', color: '#3b82f6', calc: (n) => n, rating: 'Good', ratingColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { label: 'O(N log N)', name: 'Linearithmic', color: '#f59e0b', calc: (n) => n * Math.log2(Math.max(1, n)), rating: 'Fair', ratingColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { label: 'O(N^2)', name: 'Quadratic', color: '#f97316', calc: (n) => n * n, rating: 'Poor', ratingColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { label: 'O(2^N)', name: 'Exponential', color: '#ef4444', calc: (n) => Math.pow(2, Math.min(n, 20)), rating: 'Horrible', ratingColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  // Graph Canvas Dimensions
  const svgWidth = 560;
  const svgHeight = 240;
  const padding = 40;
  const plotW = svgWidth - padding * 2;
  const plotH = svgHeight - padding * 2;

  // Max cap for linear scaling
  const maxCap = scaleMode === 'linear' ? 400 : Math.log10(1000000);

  const samplePoints = 50;

  const getPoints = (calc: (n: number) => number) => {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= samplePoints; i++) {
      const nVal = 1 + (i / samplePoints) * (inputN - 1);
      const rawY = calc(nVal);

      let normY = 0;
      if (scaleMode === 'linear') {
        normY = Math.min(rawY, maxCap) / maxCap;
      } else {
        const logVal = Math.log10(Math.max(1, rawY));
        normY = Math.min(logVal, maxCap) / maxCap;
      }

      const x = padding + (i / samplePoints) * plotW;
      const y = svgHeight - padding - normY * plotH;
      points.push({ x, y });
    }
    return points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Activity size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Big-O Time Complexity Comparison Graph
            </h2>
            <p className="text-xs text-slate-400">Visual growth curves for algorithm efficiency evaluation</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {/* Input N Slider */}
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-slate-300">Input Size N = <strong className="text-cyan-400 font-extrabold">{inputN}</strong></span>
            <input
              type="range"
              min="2"
              max="100"
              value={inputN}
              onChange={(e) => setInputN(Number(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Scale Toggle */}
          <div className="flex bg-slate-800 rounded-xl p-0.5 text-xs font-semibold">
            <button
              onClick={() => setScaleMode('linear')}
              className={`px-3 py-1 rounded-lg transition-all ${
                scaleMode === 'linear' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setScaleMode('log')}
              className={`px-3 py-1 rounded-lg transition-all ${
                scaleMode === 'log' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Log Scale
            </button>
          </div>
        </div>
      </div>

      {/* SVG Growth Graph */}
      <div className="relative overflow-hidden bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex justify-center">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-3xl overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = svgHeight - padding - pct * plotH;
            return (
              <g key={`grid-${idx}`}>
                <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} stroke="rgba(51, 65, 85, 0.3)" strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#64748b" fontWeight="bold">
                  {scaleMode === 'linear'
                    ? Math.round(pct * maxCap)
                    : `$10^{${(pct * maxCap).toFixed(1)}}$`}
                </text>
              </g>
            );
          })}

          {/* X Axis & Y Axis */}
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#475569" strokeWidth="1.5" />
          <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#475569" strokeWidth="1.5" />
          <text x={svgWidth / 2} y={svgHeight - 8} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold">
            Elements (N) $\rightarrow$
          </text>
          <text x={12} y={svgHeight / 2} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold" transform={`rotate(-90 12 ${svgHeight / 2})`}>
            Operations $\rightarrow$
          </text>

          {/* Curve Polylines */}
          {curves.map((c) => {
            const points = getPoints(c.calc);
            const isHovered = hoveredCurve === c.label;

            return (
              <polyline
                key={c.label}
                points={points}
                fill="none"
                stroke={c.color}
                strokeWidth={isHovered ? '4' : '2.5'}
                strokeOpacity={hoveredCurve && !isHovered ? 0.3 : 1}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCurve(c.label)}
                onMouseLeave={() => setHoveredCurve(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Interactive Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {curves.map((c) => {
          const ops = Math.round(c.calc(inputN));
          const isHovered = hoveredCurve === c.label;

          return (
            <div
              key={c.label}
              onMouseEnter={() => setHoveredCurve(c.label)}
              onMouseLeave={() => setHoveredCurve(null)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                isHovered ? 'bg-slate-800/90 border-slate-600 scale-105 shadow-xl' : 'bg-slate-900/50 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm" style={{ color: c.color }}>{c.label}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${c.ratingColor}`}>
                  {c.rating}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{c.name}</p>
              <div className="text-xs font-bold text-white pt-1 border-t border-slate-800">
                {ops >= 1000000 ? `${(ops / 1000000).toFixed(1)}M` : ops.toLocaleString()} ops
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
