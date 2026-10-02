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
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-sm gap-3 sm:gap-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 shrink-0 transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="AlgoVault Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-blue-200 shadow-sm group-hover:scale-105 group-hover:border-blue-400 transition-all duration-300"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="hidden sm:block min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-600 transition-colors truncate">AlgoVault</span>
                <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm shrink-0">PRO</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden md:block">Interview Questions & Revision Vault</p>
            </div>
          </div>
        </div>

        {/* Center: Universal Search */}
        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-2 lg:mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, tags..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & Streak & Sync */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* Streak Counter Badge */}
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs sm:text-sm shrink-0">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline">{progress.streak} Day Streak</span>
            <span className="sm:hidden">{progress.streak}d</span>
          </div>

          {/* Quick Revision Queue Button */}
          <button
            onClick={() => setActiveTab('revision')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeTab === 'revision'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Revision</span>
          </button>

          {/* Sync / Export Backup Button */}
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 transition-all shrink-0"
            title="Backup & Sync Progress"
          >
            <Cloud className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="hidden md:inline">Sync</span>
          </button>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 text-slate-800 text-xs font-semibold transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-slate-900 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-md p-2 z-50 animate-fadeIn">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <ShieldCheck size={13} />
                      <span>MongoDB Auto-Sync Active</span>
                    </div>
                  </div>

                  <div className="pt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowSyncModal(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <Cloud size={16} className="text-blue-500" />
                      <span>Manage Cloud Backup</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <LogOut size={16} />
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
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-200 hover:shadow-lg transition-all transform active:scale-95 shrink-0"
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
