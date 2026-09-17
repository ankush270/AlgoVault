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
  Flame,
  Boxes,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Atom,
  Server
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
  const [isCoreOpen, setIsCoreOpen] = React.useState(true);
  const [isDevOpen, setIsDevOpen] = React.useState(true);
  const [isToolsOpen, setIsToolsOpen] = React.useState(true);

  const coreDomains: { id: DomainType; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'os', label: 'Operating Systems', icon: Cpu, color: 'text-emerald-400' },
    { id: 'oops', label: 'OOPs & LLD', icon: Boxes, color: 'text-orange-400' },
    { id: 'dbms-sql', label: 'DBMS & SQL', icon: Database, color: 'text-cyan-400' },
    { id: 'computer-networks', label: 'Computer Networks', icon: Globe2, color: 'text-rose-400' },
  ];

  const devDomains: { id: DomainType; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'dsa', label: 'DSA & Algorithms', icon: Code2, color: 'text-amber-400' },
    { id: 'system-design', label: 'System Design (HLD)', icon: Layers, color: 'text-purple-400' },
    { id: 'javascript', label: 'JavaScript & V8 Engine', icon: Terminal, color: 'text-yellow-400' },
    { id: 'react', label: 'React.js & Frontend', icon: Atom, color: 'text-sky-400' },
    { id: 'nodejs', label: 'Node.js & Backend', icon: Server, color: 'text-green-400' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', icon: Bot, color: 'text-indigo-400' },
  ];

  const tools = [
    { id: 'dsa-tricks', label: 'DSA Tricks & Patterns', icon: Sparkles, badge: '48 HOT' },
    { id: 'interview-experiences', label: 'Interview Experiences', icon: Briefcase, badge: '920+ Qs' },
    { id: 'striver-a2z', label: "DSA Sheet", icon: Flame, badge: 'A2Z' },
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
      <div className="space-y-4">
        {/* Navigation & All Modules */}
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => handleToolClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Overview Dashboard</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleDomainClick('all')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeTab === 'knowledge' && selectedDomain === 'all'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>All Tech Modules</span>
            </button>
          </li>
        </ul>

        {/* Core CS Subjects Accordion */}
        <div className="pt-2 border-t border-slate-800/60">
          <button
            onClick={() => setIsCoreOpen(!isCoreOpen)}
            className="w-full px-3 py-2 text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Core CS Subjects</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">({coreDomains.length})</span>
            </div>
            {isCoreOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isCoreOpen && (
            <ul className="mt-1 space-y-1 pl-2 border-l-2 border-emerald-500/30 ml-2">
              {coreDomains.map((d) => {
                const Icon = d.icon;
                const isSelected = activeTab === 'knowledge' && selectedDomain === d.id;
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => handleDomainClick(d.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${d.color}`} />
                        <span>{d.label}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Programming & Dev Stack Accordion */}
        <div className="pt-2 border-t border-slate-800/60">
          <button
            onClick={() => setIsDevOpen(!isDevOpen)}
            className="w-full px-3 py-2 text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Programming & Stack</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">({devDomains.length})</span>
            </div>
            {isDevOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isDevOpen && (
            <ul className="mt-1 space-y-1 pl-2 border-l-2 border-purple-500/30 ml-2">
              {devDomains.map((d) => {
                const Icon = d.icon;
                const isSelected = activeTab === 'knowledge' && selectedDomain === d.id;
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => handleDomainClick(d.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${d.color}`} />
                        <span>{d.label}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Practice Tools & Utilities Accordion */}
        <div className="pt-2 border-t border-slate-800/60">
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="w-full px-3 py-2 text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Practice & Tools</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">({tools.length})</span>
            </div>
            {isToolsOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isToolsOpen && (
            <ul className="mt-1 space-y-1 pl-2 border-l-2 border-amber-500/30 ml-2">
              {tools.map((t) => {
                const Icon = t.icon;
                const isSelected = activeTab === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => handleToolClick(t.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span>{t.label}</span>
                      </div>
                      {t.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {t.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
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
