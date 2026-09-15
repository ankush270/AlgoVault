import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Download, 
  Upload, 
  Menu, 
  X, 
  Sparkles,
  Cloud,
  CheckCircle2,
  Bookmark,
  RefreshCw,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { checkMongoHealth, fetchFromMongo, pushToMongo } from '../services/mongoSync';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  setActiveTab,
}) => {
  const { progress, exportProgressJSON, importProgressJSON } = useProgress();
  const { user, isAuthenticated, logout } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [syncTab, setSyncTab] = useState<'mongo' | 'file'>('mongo');

  const [mongoUserKey, setMongoUserKey] = useState<string>(() => {
    return user?.email || localStorage.getItem('mongo_sync_user_key') || 'ankush-user-1';
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync user email when user logs in
  useEffect(() => {
    if (user?.email) {
      setMongoUserKey(user.email);
      // Auto fetch progress on login
      fetchFromMongo(user.email).then((data) => {
        if (data && data.leetcodeSolvedStatus) {
          localStorage.setItem('leetcode_solved_questions_status_v1', JSON.stringify(data.leetcodeSolvedStatus));
          window.dispatchEvent(new Event('storage'));
        }
      });
    }
  }, [user]);

  const handleMongoPush = async () => {
    if (!mongoUserKey.trim()) return;
    setIsSyncing(true);
    localStorage.setItem('mongo_sync_user_key', mongoUserKey.trim());
    
    // Gather LeetCode solved status from localStorage
    let leetcodeSolvedStatus = {};
    try {
      const saved = localStorage.getItem('leetcode_solved_status');
      if (saved) leetcodeSolvedStatus = JSON.parse(saved);
    } catch (e) {}

    const success = await pushToMongo(mongoUserKey, leetcodeSolvedStatus, progress);
    setIsSyncing(false);

    if (success) {
      setSyncSuccessMsg(`Successfully synced data to MongoDB under Key '${mongoUserKey.trim()}'!`);
      setTimeout(() => setSyncSuccessMsg(''), 3000);
    } else {
      alert('Could not push to MongoDB server. Ensure server.js is running.');
    }
  };

  const handleMongoPull = async () => {
    if (!mongoUserKey.trim()) return;
    setIsSyncing(true);
    localStorage.setItem('mongo_sync_user_key', mongoUserKey.trim());

    const result = await fetchFromMongo(mongoUserKey);
    setIsSyncing(false);

    if (result) {
      if (result.leetcodeSolvedStatus) {
        localStorage.setItem('leetcode_solved_status', JSON.stringify(result.leetcodeSolvedStatus));
      }
      if (result.progressState && result.progressState.statuses) {
        importProgressJSON(JSON.stringify(result.progressState));
      }
      setSyncSuccessMsg(`Restored synced data from MongoDB for Key '${mongoUserKey.trim()}'!`);
      setTimeout(() => setSyncSuccessMsg(''), 3000);
      window.location.reload(); // Refresh state
    } else {
      alert(`No data found for Key '${mongoUserKey.trim()}'. Click 'Push Data' first.`);
    }
  };

  const handleImportSubmit = () => {
    if (importProgressJSON(importJsonText)) {
      setSyncSuccessMsg('Progress successfully restored from backup!');
      setTimeout(() => {
        setSyncSuccessMsg('');
        setShowSyncModal(false);
        setImportJsonText('');
      }, 1500);
    } else {
      alert('Invalid JSON backup file. Please check the file contents.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          if (importProgressJSON(content)) {
            setSyncSuccessMsg('Backup imported successfully!');
            setTimeout(() => {
              setSyncSuccessMsg('');
              setShowSyncModal(false);
            }, 1500);
          } else {
            alert('Could not parse JSON backup file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

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

          {/* User Auth Section: Profile Dropdown or Sign In CTA */}
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
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </header>

      {/* Backup & Import Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowSyncModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cloud size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cloud & Cross-Device Sync</h3>
                <p className="text-xs text-slate-400">Sync bookmarks & solved questions across Phone & PC</p>
              </div>
            </div>

            {/* Modal Tabs: MongoDB vs File */}
            <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4 text-xs font-semibold">
              <button
                onClick={() => setSyncTab('mongo')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  syncTab === 'mongo'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🍃 MongoDB Live Sync
              </button>
              <button
                onClick={() => setSyncTab('file')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  syncTab === 'file'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💾 JSON File Backup
              </button>
            </div>

            {syncSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{syncSuccessMsg}</span>
              </div>
            )}

            {syncTab === 'mongo' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Your Cross-Device Sync Key:</label>
                    <input
                      type="text"
                      value={mongoUserKey}
                      onChange={(e) => setMongoUserKey(e.target.value)}
                      placeholder="e.g. ankush-sync-2026"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:border-emerald-500 outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter the same key on both Computer & Phone to sync your bookmarks!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleMongoPush}
                      disabled={isSyncing}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      <Cloud size={14} />
                      <span>{isSyncing ? 'Syncing...' : 'Push to MongoDB'}</span>
                    </button>

                    <button
                      onClick={handleMongoPull}
                      disabled={isSyncing}
                      className="py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-600/20"
                    >
                      <RefreshCw size={14} />
                      <span>{isSyncing ? 'Pulling...' : 'Pull from MongoDB'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {syncTab === 'file' && (
              <div className="space-y-4">
                {/* Download Option */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Export Progress JSON</h4>
                    <p className="text-xs text-slate-400">Download your study streak & notes backup</p>
                  </div>
                  <button
                    onClick={exportProgressJSON}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>

                {/* Upload Option */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Import Backup File</h4>
                    <p className="text-xs text-slate-400">Upload JSON backup file from your phone or PC</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700">
                      <Upload size={14} />
                      <span>Choose JSON File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Paste JSON raw option */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Or Paste JSON Data Directly:</label>
                  <textarea
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder="Paste JSON content here..."
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={handleImportSubmit}
                    disabled={!importJsonText.trim()}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw size={14} />
                    <span>Restore Progress</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal for Login & Register */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
