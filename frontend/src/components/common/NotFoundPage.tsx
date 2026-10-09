import React, { useState } from 'react';
import { 
  Compass, 
  Home, 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Flame, 
  Swords, 
  Layers, 
  Sparkles, 
  Cpu, 
  Database,
  HelpCircle 
} from 'lucide-react';
import { DomainType } from '../../types';

interface NotFoundPageProps {
  currentPath: string;
  onNavigate: (tab: string, domain?: DomainType | 'all') => void;
  onSearch: (query: string) => void;
  onBack?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  currentPath,
  onNavigate,
  onSearch,
  onBack,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onNavigate('knowledge', 'all');
    }
  };

  const quickLinks = [
    {
      tab: 'dashboard',
      label: 'Home Dashboard',
      description: 'Your learning metrics, streak, and daily roadmap.',
      icon: Home,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200 hover:border-blue-400',
    },
    {
      tab: 'striver-a2z',
      label: 'DSA Practice Sheet',
      description: 'Curated 450+ problems with progress tracking and revision.',
      icon: Flame,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200 hover:border-amber-400',
    },
    {
      tab: 'live-arena',
      label: '1v1 Coding Arena',
      description: 'Battle peers in real-time speed coding challenges.',
      icon: Swords,
      color: 'from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200 hover:border-rose-400',
    },
    {
      tab: 'system-design-hub',
      label: 'System Design Hub',
      description: 'High-level & low-level architecture interview blueprints.',
      icon: Layers,
      color: 'from-purple-500/10 to-violet-500/10 text-purple-600 border-purple-200 hover:border-purple-400',
    },
  ];

  const popularDomains: { domain: DomainType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { domain: 'os', label: 'Operating Systems', icon: Cpu },
    { domain: 'dbms-sql', label: 'DBMS & SQL', icon: Database },
    { domain: 'system-design', label: 'System Design', icon: Layers },
    { domain: 'dsa', label: 'DSA & Algorithms', icon: Sparkles },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn text-center max-w-4xl mx-auto">
      {/* 404 Badge & Visual Glow */}
      <div className="relative mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-cyan-500/20 border border-purple-200 flex items-center justify-center text-purple-600 shadow-xl shadow-purple-500/10 mx-auto">
          <Compass size={52} className="animate-spin-slow stroke-[1.75]" />
        </div>
        <div className="absolute -bottom-2.5 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-xs font-black tracking-wider uppercase shadow-md">
          404 Error
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed">
        The route <code className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono text-purple-700 font-bold text-xs sm:text-sm break-all">{currentPath || '/'}</code> does not exist or may have been relocated.
      </p>

      {/* Search Bar for Quick Recovery */}
      <form onSubmit={handleSearchSubmit} className="mt-6 w-full max-w-md">
        <div className="relative flex items-center shadow-sm">
          <Search size={18} className="absolute left-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search concepts, DSA topics, algorithms..."
            className="w-full pl-11 pr-24 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Action Navigation Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-200 flex items-center gap-2 active:scale-95"
        >
          <Home size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => onBack ? onBack() : window.history.back()}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Go Previous</span>
        </button>
      </div>

      {/* Recommended Hubs Grid */}
      <div className="mt-10 w-full text-left">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>Popular Destinations</span>
          </span>
          <span className="text-xs text-slate-400">Click to explore</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.tab}
                onClick={() => onNavigate(link.tab)}
                className={`p-4 rounded-2xl border text-left transition-all hover:-translate-y-0.5 shadow-sm bg-gradient-to-br ${link.color} flex items-start gap-3.5 group`}
              >
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{link.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {link.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Core Domain Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <BookOpen size={13} /> Or browse core subjects:
          </span>
          {popularDomains.map((d) => {
            const DomainIcon = d.icon;
            return (
              <button
                key={d.domain}
                onClick={() => onNavigate('knowledge', d.domain)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 hover:text-purple-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <DomainIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
