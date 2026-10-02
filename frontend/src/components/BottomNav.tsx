import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Briefcase,
  MoreHorizontal,
  Flame,
  Sparkles,
  Swords,
  Layers,
  Building2,
  Terminal,
  Dices,
  BookmarkCheck,
  PieChart,
  FileText,
  X,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const primaryTabs = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'knowledge', label: 'Learn', icon: BookOpen },
  { id: 'striver-a2z', label: 'DSA Sheet', icon: Code2 },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

const moreTabs = [
  { id: 'dsa-tricks', label: 'DSA Tricks', icon: Sparkles },
  { id: 'interview-experiences', label: 'Interviews', icon: Briefcase },
  { id: 'live-arena', label: '1v1 Arena', icon: Swords },
  { id: 'system-design-canvas', label: 'System Design', icon: Layers },
  { id: 'leetcode-explorer', label: 'LeetCode', icon: Building2 },
  { id: 'algorithms', label: 'Algorithms', icon: BookOpen },
  { id: 'sql-sandbox', label: 'SQL Sandbox', icon: Terminal },
  { id: 'flashcards', label: 'Flashcards', icon: Dices },
  { id: 'revision', label: 'Revision', icon: BookmarkCheck },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'pdf-readiness', label: 'PDF Ready', icon: FileText },
  { id: 'notes', label: 'My Notes', icon: FileText },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [showMore, setShowMore] = useState(false);

  const isActiveInMore = moreTabs.some((t) => t.id === activeTab);

  const handleTabClick = (tabId: string) => {
    if (tabId === 'more') {
      setShowMore(!showMore);
      return;
    }
    setActiveTab(tabId);
    setShowMore(false);
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-[68px] left-3 right-3 z-50 lg:hidden animate-slideUp">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-3 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-700">All Sections</span>
                <button
                  onClick={() => setShowMore(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moreTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                      <span className="text-[10px] font-semibold leading-tight">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Tab Bar */}
      <nav className="bottom-nav lg:hidden">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isMore = tab.id === 'more';
            const isActive = isMore ? (showMore || isActiveInMore) : activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="truncate">{tab.label}</span>
                {isMore && isActiveInMore && !showMore && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
