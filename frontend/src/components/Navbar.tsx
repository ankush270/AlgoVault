import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Search, 
  Menu, 
  X, 
  Cloud, 
  Bookmark, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Command,
  LayoutDashboard,
  Layers,
  Swords,
  Briefcase
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useMongoSync } from '../hooks/useMongoSync';
import { SyncModal } from '../features/sync/components/SyncModal';
import { getPathForState } from '../utils/routing';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth?: (tab?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  setActiveTab,
  onOpenAuth,
}) => {
  const { progress, exportProgressJSON, importProgressJSON } = useProgress();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    mongoUserKey,
    setMongoUserKey,
    isSyncing,
    showSyncModal,
    setShowSyncModal,
    syncSuccessMsg,
    handleMongoPush,
    handleMongoPull,
    lastSyncTime,
    isAutoSyncActive
  } = useMongoSync();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const SEARCHABLE_TABS = ['knowledge', 'striver-a2z', 'jobs', 'leetcode-explorer', 'dsa-tricks'];

  const getSearchPlaceholder = (tab: string) => {
    switch (tab) {
      case 'striver-a2z':
        return 'Search Striver DSA sheet...';
      case 'leetcode-explorer':
        return 'Search 400+ LeetCode problems...';
      case 'jobs':
        return 'Search jobs by role, company, skills...';
      case 'dsa-tricks':
        return 'Search DSA tricks & techniques...';
      case 'knowledge':
      default:
        return 'Search topics, questions, tags...';
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && !SEARCHABLE_TABS.includes(activeTab)) {
      setActiveTab('knowledge');
    }
  };

  // Keyboard shortcut (Ctrl+K or Cmd+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (window.innerWidth < 768) {
          setMobileSearchOpen(true);
          setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
        } else {
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const quickNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'striver-a2z', label: 'DSA Sheet', icon: Flame },
    { id: 'system-design-hub', label: 'System Design', icon: Layers },
    { id: 'live-arena', label: '1v1 Arena', icon: Swords },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          
          {/* ================= LEFT SECTION: Brand & Quick Tabs ================= */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200 transition-colors shadow-2xs"
              title="Toggle Menu"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>

            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-blue-600 bg-slate-100/90 hover:bg-blue-50 transition-colors shadow-2xs"
              title="Toggle Search"
              aria-label="Toggle Mobile Search"
            >
              <Search size={18} />
            </button>

            {/* Brand Logo & Title */}
            <a 
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  setActiveTab('dashboard');
                }
              }}
              className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            >
              <div 
                onClick={() => setActiveTab('dashboard')}
                className="relative shrink-0"
              >
                <img
                  src="/logo.png"
                  alt="AlgoVault Logo"
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-none">
                    AlgoVault
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs tracking-wider uppercase leading-none">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block tracking-wide mt-0.5 leading-none">
                  DSA & System Design Vault
                </span>
              </div>
            </a>

            {/* Desktop Quick Nav Pill Links */}
            <nav className="hidden 2xl:flex items-center gap-1 pl-3 ml-2 border-l border-slate-200">
              {quickNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const itemPath = getPathForState(item.id);
                return (
                  <a
                    key={item.id}
                    href={itemPath}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                        e.preventDefault();
                        setActiveTab(item.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* ================= CENTER SECTION: Modern Search Bar ================= */}
          <div className="hidden md:flex items-center flex-1 max-w-lg lg:max-w-xl mx-2">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={getSearchPlaceholder(activeTab)}
                className="w-full bg-slate-100/70 hover:bg-slate-100 focus:bg-white border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-16 py-2 outline-none transition-all shadow-2xs"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded-lg transition-colors"
                >
                  Clear
                </button>
              ) : (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200/90 text-[10px] font-semibold text-slate-400 pointer-events-none shadow-2xs">
                  <kbd className="font-sans text-[9px]">⌘/Ctrl</kbd>
                  <span>K</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT SECTION: Stats, Revision, Sync & Auth ================= */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Streak Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 font-bold text-xs shadow-2xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span className="hidden sm:inline font-mono">{progress.streak ?? 0} Day Streak</span>
              <span className="sm:hidden font-mono">{progress.streak ?? 0}d</span>
            </div>

            {/* Quick Revision Button */}
            <a
              href="/revision"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  setActiveTab('revision');
                }
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'revision'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200 hover:border-purple-300 shadow-2xs'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${activeTab === 'revision' ? 'text-white' : 'text-purple-600'}`} />
              <span>Revision</span>
            </a>

            {/* Cloud Sync Button */}
            <button
              onClick={() => setShowSyncModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs shrink-0"
              title="Backup & Sync Progress"
            >
              <Cloud className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="hidden xl:inline">Sync</span>
            </button>

            {/* User Auth / Profile Section */}
            {isAuthenticated && user ? (
              <div className="relative shrink-0" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-800 text-xs font-bold transition-all shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate font-semibold">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                    <div className="p-3 border-b border-slate-100">
                      <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate font-mono">{user.email}</p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                        <ShieldCheck size={14} className={`text-emerald-600 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>
                          {isSyncing
                            ? 'Syncing changes...'
                            : isAutoSyncActive
                              ? `MongoDB Auto-Sync Active${lastSyncTime ? ` (${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : ''}`
                              : 'Cloud Sync Ready'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 space-y-1">
                      <button
                        onClick={() => {
                          setShowSyncModal(true);
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Cloud size={15} className="text-blue-500" />
                        <span>Manage Cloud Backup</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/35 transition-all transform active:scale-95 shrink-0"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign In / Register</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Expandable Search Bar Strip */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-slate-200/90 bg-slate-50/95 backdrop-blur-md px-3 py-2.5 transition-all">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={getSearchPlaceholder(activeTab)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-16 py-2 outline-none shadow-xs"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-9 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg transition-colors"
                >
                  Clear
                </button>
              ) : null}
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                title="Close Search"
                aria-label="Close Mobile Search"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Backup & Import Modal */}
      <SyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        isAuthenticated={isAuthenticated}
        userEmail={user?.email}
        userName={user?.name}
        onOpenAuth={onOpenAuth}
        mongoUserKey={mongoUserKey}
        setMongoUserKey={setMongoUserKey}
        isSyncing={isSyncing}
        onMongoPush={handleMongoPush}
        onMongoPull={handleMongoPull}
        onExportJSON={exportProgressJSON}
        onImportJSON={importProgressJSON}
        syncSuccessMsg={syncSuccessMsg}
      />
    </>
  );
};
