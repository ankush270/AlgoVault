import React from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  Layers, 
  Cpu, 
  Database, 
  Globe2, 
  Bot, 
  Terminal, 
  Dices, 
  BookmarkCheck, 
  PieChart,
  BookOpen,
  FileText,
  Building2,
  Flame
} from 'lucide-react';
import { DomainType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDomain: DomainType | 'all';
  setSelectedDomain: (domain: DomainType | 'all') => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedDomain,
  setSelectedDomain,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const domains: { id: DomainType | 'all'; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'all', label: 'All Tech Modules', icon: BookOpen, color: 'text-blue-400' },
    { id: 'dsa', label: 'DSA & Algorithms', icon: Code2, color: 'text-amber-400' },
    { id: 'system-design', label: 'System Design (HLD/LLD)', icon: Layers, color: 'text-purple-400' },
    { id: 'os', label: 'Operating Systems', icon: Cpu, color: 'text-emerald-400' },
    { id: 'dbms-sql', label: 'DBMS & SQL', icon: Database, color: 'text-cyan-400' },
    { id: 'computer-networks', label: 'Computer Networks', icon: Globe2, color: 'text-rose-400' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', icon: Bot, color: 'text-indigo-400' },
  ];

  const tools = [
    { id: 'striver-a2z', label: "Striver's A2Z DSA Sheet", icon: Flame, badge: 'A2Z' },
    { id: 'leetcode-explorer', label: 'LeetCode Company Explorer', icon: Building2, badge: '3.4k Qs' },
    { id: 'algorithms', label: 'Algorithms Encyclopedia', icon: BookOpen, badge: 'NEW' },
    { id: 'sql-sandbox', label: 'Interactive SQL Sandbox', icon: Terminal, badge: 'LIVE' },
    { id: 'flashcards', label: 'Mock Flashcard Timer', icon: Dices, badge: 'PRACTICE' },
    { id: 'revision', label: 'Spaced Revision List', icon: BookmarkCheck },
    { id: 'analytics', label: 'Mastery Analytics', icon: PieChart },
    { id: 'notes', label: 'My Saved Notes', icon: FileText },
  ];

  const handleDomainClick = (domainId: DomainType | 'all') => {
    setSelectedDomain(domainId);
    setActiveTab('knowledge');
    setMobileMenuOpen(false);
  };

  const handleToolClick = (toolId: string) => {
    setActiveTab(toolId);
    setMobileMenuOpen(false);
  };

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 z-20 w-64 h-[calc(100vh-4rem)] bg-[#0D1322] border-r border-slate-800/80 flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="space-y-6">
        {/* Main Dashboard Link */}
        <div>
          <button
            onClick={() => handleToolClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Overview Dashboard</span>
          </button>
        </div>

        {/* Technical Domains Section */}
        <div>
          <h4 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Interview Domains
          </h4>
          <div className="space-y-1">
            {domains.map((d) => {
              const Icon = d.icon;
              const isSelected = activeTab === 'knowledge' && selectedDomain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDomainClick(d.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${d.color}`} />
                    <span>{d.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice Tools & Utilities Section */}
        <div>
          <h4 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Practice & Revision
          </h4>
          <div className="space-y-1">
            {tools.map((t) => {
              const Icon = t.icon;
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleToolClick(t.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span>{t.label}</span>
                  </div>
                  {t.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info Card */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-white">Target Switch</span>
            <span className="text-emerald-400 font-bold">2026 Tier 1</span>
          </div>
          <p className="text-[11px] text-slate-400">FAANG & Top Tech Ready</p>
        </div>
      </div>
    </aside>
  );
};
