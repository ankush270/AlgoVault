import React, { useState } from 'react';
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
  ChevronDown 
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0B0F19] border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xl">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800/60"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="TechSwitch Logo"
                className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">AlgoVault</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm">PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Interview Questions & Revision Vault</p>
            </div>
          </div>
        </div>

        {/* Center: Universal Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, tags (e.g. Dynamic Programming, Base62, ACID)..."
              className="w-full bg-slate-900/90 border border-slate-700/70 focus:border-blue-500/80 text-sm text-slate-100 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & Streak & Sync */}
        <div className="flex items-center gap-3">
          {/* Streak Counter Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs sm:text-sm">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{progress.streak} Day Streak</span>
          </div>

          {/* Quick Revision Queue Button */}
          <button
            onClick={() => setActiveTab('revision')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeTab === 'revision'
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:border-purple-500/50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
            <span>Revision</span>
          </button>

          {/* Sync / Export Backup Button */}
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all"
            title="Backup & Sync Progress"
          >
            <Cloud className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Sync & Cloud</span>
          </button>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-white text-xs font-semibold transition-all shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px]">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0D1322] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="p-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <ShieldCheck size={12} />
                      <span>MongoDB Auto-Sync Active</span>
                    </div>
                  </div>

                  <div className="pt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowSyncModal(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all"
                    >
                      <Cloud size={14} className="text-cyan-400" />
                      <span>Manage Cloud Backup</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <LogOut size={14} />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
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
