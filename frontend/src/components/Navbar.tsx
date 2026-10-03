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
  Sparkles
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useMongoSync } from '../hooks/useMongoSync';
import { AuthModal } from './AuthModal';
import { SyncModal } from '../features/sync/components/SyncModal';

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
  } = useMongoSync();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between shadow-xs gap-2.5 sm:gap-6">
        {/* Left: Mobile Toggle & Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
            title="Toggle Menu"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="relative shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl blur-[2px] opacity-40 group-hover:opacity-75 transition duration-300" />
              <img
                src="/logo.png"
                alt="AlgoVault Logo"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-white shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  AlgoVault
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs tracking-wider uppercase shrink-0">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden md:block leading-tight -mt-0.5">
                Interview Questions & Revision Vault
              </p>
            </div>
          </div>
        </div>

        {/* Center: Universal Search */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-2 lg:mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, tags..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-16 py-2 outline-none transition-all shadow-xs"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-200 px-2 py-0.5 rounded-lg transition-colors"
              >
                Clear
              </button>
            ) : (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-400 pointer-events-none shadow-2xs">
                <kbd className="font-sans">Ctrl</kbd>
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions, Streaks, Revision, Sync & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Streak Counter Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-800 font-bold text-xs sm:text-sm shadow-2xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30 animate-pulse shrink-0" />
            <span className="hidden sm:inline">{progress.streak || 1} Day Streak</span>
            <span className="sm:hidden">{progress.streak || 1}d</span>
          </div>

          {/* Quick Revision Queue Button */}
          <button
            onClick={() => setActiveTab('revision')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeTab === 'revision'
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                : 'bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200 hover:border-purple-200 shadow-2xs'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Revision</span>
          </button>

          {/* Sync / Export Backup Button */}
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all shadow-2xs shrink-0"
            title="Backup & Sync Progress"
          >
            <Cloud className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="hidden md:inline">Sync</span>
          </button>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative shrink-0" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-800 text-xs font-semibold transition-all shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate font-medium">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                      <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                      <span>MongoDB Auto-Sync Active</span>
                    </div>
                  </div>

                  <div className="pt-1.5 space-y-1">
                    <button
                      onClick={() => {
                        setShowSyncModal(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl transition-all"
                    >
                      <Cloud size={15} className="text-blue-500" />
                      <span>Manage Cloud Backup</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth('login');
                } else {
                  setShowAuthModal(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/25 hover:shadow-blue-500/35 transition-all transform active:scale-95 shrink-0"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Sign In / Register</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Backup & Import Modal */}
      <SyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        mongoUserKey={mongoUserKey}
        setMongoUserKey={setMongoUserKey}
        isSyncing={isSyncing}
        onMongoPush={handleMongoPush}
        onMongoPull={handleMongoPull}
        onExportJSON={exportProgressJSON}
        onImportJSON={importProgressJSON}
        syncSuccessMsg={syncSuccessMsg}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
