import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconDimensions = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className={`relative ${iconDimensions} flex items-center justify-center shrink-0`}>
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        
        {/* SVG Logo Mark */}
        <svg
          className="relative w-full h-full drop-shadow-md"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Hexagon Outline */}
          <polygon
            points="50,5 90,25 90,75 50,95 10,75 10,25"
            fill="url(#logoGrad)"
            opacity="0.2"
          />
          <polygon
            points="50,5 90,25 90,75 50,95 10,75 10,25"
            stroke="url(#logoGrad)"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Inner Dynamic Switch Arrows */}
          <path
            d="M32 45 L50 28 L68 45 M50 28 L50 62"
            stroke="#06B6D4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M68 55 L50 72 L32 55 M50 72 L50 38"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`${textSize} font-black text-white tracking-tight font-mono`}>
            Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400">Switch</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
            PRO
          </span>
        </div>
      )}
    </div>
  );
};
