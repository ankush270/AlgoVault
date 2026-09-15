import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { allTopics } from '../../data/allData';
import { DomainType } from '../../types';
import { Sparkles, Brain } from 'lucide-react';

interface DomainMetric {
  id: DomainType;
  label: string;
  shortLabel: string;
  color: string;
  strokeColor: string;
  mastered: number;
  total: number;
  pct: number;
}

export const SkillRadarChart: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { progress } = useProgress();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const domainDefs: { id: DomainType; label: string; shortLabel: string; color: string; strokeColor: string }[] = [
    { id: 'dsa', label: 'DSA & Algorithms', shortLabel: 'DSA', color: '#f59e0b', strokeColor: 'rgba(245, 158, 11, 0.8)' },
    { id: 'system-design', label: 'System Design', shortLabel: 'SysDesign', color: '#c084fc', strokeColor: 'rgba(192, 132, 252, 0.8)' },
    { id: 'os', label: 'Operating Systems', shortLabel: 'OS', color: '#34d399', strokeColor: 'rgba(52, 211, 153, 0.8)' },
    { id: 'dbms-sql', label: 'DBMS & SQL', shortLabel: 'DBMS/SQL', color: '#22d3ee', strokeColor: 'rgba(34, 211, 238, 0.8)' },
    { id: 'computer-networks', label: 'Computer Networks', shortLabel: 'Networks', color: '#fb7185', strokeColor: 'rgba(251, 113, 133, 0.8)' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', shortLabel: 'GenAI/ML', color: '#818cf8', strokeColor: 'rgba(129, 140, 248, 0.8)' },
  ];

  const metrics: DomainMetric[] = domainDefs.map(d => {
    const domainTopics = allTopics.filter(t => t.domain === d.id);
    const domainMastered = domainTopics.filter(t => progress.statuses[t.id] === 'mastered').length;
    const total = domainTopics.length || 1;
    const pct = Math.round((domainMastered / total) * 100);
    return {
      ...d,
      mastered: domainMastered,
      total,
      pct,
    };
  });

  const overallReadiness = Math.round(metrics.reduce((acc, m) => acc + m.pct, 0) / metrics.length);

  // SVG Geometry
  const size = compact ? 240 : 300;
  const center = size / 2;
  const radius = compact ? 80 : 105;
  const numSides = metrics.length;
  const angleStep = (2 * Math.PI) / numSides;

  const getCoordinates = (index: number, valFactor: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valFactor;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Concentric web levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const polygonPoints = metrics
    .map((m, i) => {
      const factor = Math.max(0.08, m.pct / 100);
      const { x, y } = getCoordinates(i, factor);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col items-center relative overflow-hidden ${compact ? '' : 'w-full'}`}>
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Brain size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              Domain Skill Matrix
            </h3>
            <p className="text-[11px] text-slate-400">Multi-axis proficiency radar chart</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Readiness</span>
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            {overallReadiness}%
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <radialGradient id="radarFillGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
            </radialGradient>
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Grid Web Lines */}
          {levels.map((lvl, lIdx) => {
            const points = metrics
              .map((_, i) => {
                const { x, y } = getCoordinates(i, lvl);
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <polygon
                key={`lvl-${lIdx}`}
                points={points}
                fill="none"
                stroke="rgba(51, 65, 85, 0.4)"
                strokeDasharray={lIdx === levels.length - 1 ? 'none' : '3 3'}
                strokeWidth={lIdx === levels.length - 1 ? '1.5' : '1'}
              />
            );
          })}

          {/* Radial Spokes */}
          {metrics.map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(51, 65, 85, 0.5)"
                strokeWidth="1"
              />
            );
          })}

          {/* Skill Radar Filled Area */}
          <polygon
            points={polygonPoints}
            fill="url(#radarFillGradient)"
            stroke="#60a5fa"
            strokeWidth="2.5"
            filter="url(#radarGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Vertices & Hover Targets */}
          {metrics.map((m, i) => {
            const factor = Math.max(0.08, m.pct / 100);
            const { x, y } = getCoordinates(i, factor);
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={`vertex-${i}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer group"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? '7' : '4.5'}
                  fill={m.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke={m.color}
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}
              </g>
            );
          })}

          {/* Label Text Pills */}
          {metrics.map((m, i) => {
            const labelPos = getCoordinates(i, compact ? 1.25 : 1.22);
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={`label-${i}`}
                transform={`translate(${labelPos.x}, ${labelPos.y})`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer select-none"
              >
                <rect
                  x="-34"
                  y="-11"
                  width="68"
                  height="22"
                  rx="11"
                  fill={isHovered ? '#1e293b' : '#0f172a'}
                  stroke={isHovered ? m.color : '#334155'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                  className="transition-all duration-300 shadow-lg"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fontSize={compact ? '9' : '10'}
                  fontWeight="bold"
                  fill={isHovered ? m.color : '#e2e8f0'}
                >
                  {m.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Info Card / Domain Details */}
      <div className="w-full mt-2 pt-3 border-t border-slate-800/80">
        {hoveredIdx !== null ? (
          <div className="flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: metrics[hoveredIdx].color }}
              />
              <span className="font-bold text-white">{metrics[hoveredIdx].label}</span>
            </div>
            <span className="font-black text-slate-200">
              {metrics[hoveredIdx].mastered} / {metrics[hoveredIdx].total} ({metrics[hoveredIdx].pct}%)
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            {metrics.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                <span className="truncate">{m.shortLabel}: <strong className="text-slate-200">{m.pct}%</strong></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
