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
  Server,
  Swords
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

  const coreDomains: { id: DomainType; label: string; icon: React.FC<{ className?: string }>; color: string; activeBg: string }[] = [
    { id: 'os', label: 'Operating Systems', icon: Cpu, color: 'text-emerald-600', activeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { id: 'oops', label: 'OOPs & LLD', icon: Boxes, color: 'text-orange-600', activeBg: 'bg-orange-50 border-orange-200 text-orange-700' },
    { id: 'dbms-sql', label: 'DBMS & SQL', icon: Database, color: 'text-cyan-600', activeBg: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
    { id: 'computer-networks', label: 'Computer Networks', icon: Globe2, color: 'text-rose-600', activeBg: 'bg-rose-50 border-rose-200 text-rose-700' },
  ];

  const devDomains: { id: DomainType; label: string; icon: React.FC<{ className?: string }>; color: string; activeBg: string }[] = [
    { id: 'dsa', label: 'DSA & Algorithms', icon: Code2, color: 'text-amber-600', activeBg: 'bg-amber-50 border-amber-200 text-amber-700' },
    { id: 'system-design', label: 'System Design (HLD)', icon: Layers, color: 'text-purple-600', activeBg: 'bg-purple-50 border-purple-200 text-purple-700' },
    { id: 'javascript', label: 'JavaScript & V8 Engine', icon: Terminal, color: 'text-yellow-600', activeBg: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { id: 'react', label: 'React.js & Frontend', icon: Atom, color: 'text-sky-600', activeBg: 'bg-sky-50 border-sky-200 text-sky-700' },
    { id: 'nodejs', label: 'Node.js & Backend', icon: Server, color: 'text-green-600', activeBg: 'bg-green-50 border-green-200 text-green-700' },
    { id: 'genai-ml', label: 'Gen AI & AI/ML', icon: Bot, color: 'text-indigo-600', activeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  ];

  const tools = [
    { id: 'jobs', label: 'Live Remote & Tech Jobs', icon: Briefcase, badge: 'LIVE', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'dsa-tricks', label: 'DSA Tricks & Patterns', icon: Sparkles },
    { id: 'interview-experiences', label: 'Interview Experiences', icon: Briefcase },
    { id: 'live-arena', label: '1v1 Speed Arena', icon: Swords, badge: 'HOT', badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'striver-a2z', label: "DSA Sheet", icon: Flame },
    { id: 'system-design-canvas', label: 'System Design Studio', icon: Layers, badge: 'NEW', badgeColor: 'bg-blue-100 text-blue-700' },
    { id: 'leetcode-explorer', label: 'LeetCode Explorer', icon: Building2 },
    { id: 'algorithms', label: 'Algorithms Encyclopedia', icon: BookOpen },
    { id: 'sql-sandbox', label: 'SQL Sandbox', icon: Terminal },
    { id: 'flashcards', label: 'Flashcard Timer', icon: Dices },
    { id: 'revision', label: 'Spaced Revision', icon: BookmarkCheck },
    { id: 'analytics', label: 'Mastery Analytics', icon: PieChart },
    { id: 'pdf-readiness', label: 'PDF & Company Readiness', icon: FileText, badge: 'PDF', badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'notes', label: 'My Notes', icon: FileText },
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
    <>
      {/* Mobile Backdrop Mask */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:relative top-[52px] sm:top-[56px] lg:top-0 left-0 z-40 lg:z-auto w-[280px] h-[calc(100vh-52px)] sm:h-[calc(100vh-56px)] lg:h-full shrink-0 bg-white border-r border-slate-200/80 flex flex-col p-4 gap-3 overflow-y-auto transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
      <div className="space-y-2">
        {/* Navigation & All Modules */}
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => handleToolClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <LayoutDashboard className={`w-[18px] h-[18px] ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Overview Dashboard</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleDomainClick('all')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'knowledge' && selectedDomain === 'all'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <BookOpen className={`w-[18px] h-[18px] ${activeTab === 'knowledge' && selectedDomain === 'all' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>All Tech Modules</span>
            </button>
          </li>
        </ul>

        {/* Core CS Subjects Accordion */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={() => setIsCoreOpen(!isCoreOpen)}
            className="w-full px-3 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between hover:text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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
            <ul className="mt-1 space-y-0.5 pl-2 border-l-2 border-emerald-200 ml-3">
              {coreDomains.map((d) => {
                const Icon = d.icon;
                const isSelected = activeTab === 'knowledge' && selectedDomain === d.id;
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => handleDomainClick(d.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? `${d.activeBg} border font-semibold shadow-sm`
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? '' : d.color}`} />
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
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={() => setIsDevOpen(!isDevOpen)}
            className="w-full px-3 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between hover:text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
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
            <ul className="mt-1 space-y-0.5 pl-2 border-l-2 border-purple-200 ml-3">
              {devDomains.map((d) => {
                const Icon = d.icon;
                const isSelected = activeTab === 'knowledge' && selectedDomain === d.id;
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => handleDomainClick(d.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? `${d.activeBg} border font-semibold shadow-sm`
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? '' : d.color}`} />
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
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="w-full px-3 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between hover:text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
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
            <ul className="mt-1 space-y-0.5 pl-2 border-l-2 border-amber-200 ml-3">
              {tools.map((t) => {
                const Icon = t.icon;
                const isSelected = activeTab === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => handleToolClick(t.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span>{t.label}</span>
                      </div>
                      {t.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${t.badgeColor || 'bg-slate-100 text-slate-600'}`}>
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
      <div className="mt-auto pt-3 border-t border-slate-100">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 text-sm space-y-1">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold text-slate-900">Target Switch</span>
            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">2026 Tier 1</span>
          </div>
          <p className="text-xs text-slate-500">FAANG & Top Tech Ready</p>
        </div>
      </div>
    </aside>
  </>
  );
};
