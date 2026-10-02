import React from 'react';
import { Difficulty } from '../../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'md',
  showDot = false,
}) => {
  const diffLower = (difficulty || 'medium').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-500 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (diffLower === 'easy') {
    colorClasses = 'bg-emerald-50 text-emerald-600 border-emerald-500/20';
    dotColor = 'bg-emerald-400';
  } else if (diffLower === 'medium') {
    colorClasses = 'bg-amber-50 text-amber-600 border-amber-500/20';
    dotColor = 'bg-amber-400';
  } else if (diffLower === 'hard') {
    colorClasses = 'bg-rose-50 text-rose-600 border-rose-500/20';
    dotColor = 'bg-rose-400';
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3 py-1 text-xs'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${colorClasses} ${sizeClasses}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {difficulty}
    </span>
  );
};
