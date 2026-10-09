import React, { useState } from 'react';
import { Cloud, X, CheckCircle2, RefreshCw, Download, Upload, Lock, LogIn, ShieldCheck } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  mongoUserKey?: string;
  setMongoUserKey?: (key: string) => void;
  isSyncing: boolean;
  onMongoPush: () => void;
  onMongoPull: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  syncSuccessMsg: string;
  isAuthenticated?: boolean;
  userEmail?: string;
  userName?: string;
  onOpenAuth?: (tab?: 'login' | 'signup') => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  mongoUserKey = '',
  setMongoUserKey,
  isSyncing,
  onMongoPush,
  onMongoPull,
  onExportJSON,
  onImportJSON,
  syncSuccessMsg,
  isAuthenticated = false,
  userEmail,
  userName,
  onOpenAuth,
}) => {
  const [syncTab, setSyncTab] = useState<'mongo' | 'file'>('mongo');
  const [importJsonText, setImportJsonText] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportJSON(content);
        if (ok) {
          alert('Progress imported successfully!');
          onClose();
        } else {
          alert('Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = onImportJSON(importJsonText.trim());
    if (ok) {
      alert('Progress imported successfully!');
      setImportJsonText('');
      onClose();
    } else {
      alert('Invalid JSON content.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Cloud size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Cloud & Cross-Device Sync</h3>
            <p className="text-xs text-slate-500">Sync bookmarks & solved questions across Phone & PC</p>
          </div>
        </div>

        {/* Modal Tabs: MongoDB vs File */}
        <div className="flex gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl mb-4 text-xs font-semibold">
          <button
            onClick={() => setSyncTab('mongo')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              syncTab === 'mongo'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍃 MongoDB Live Sync
          </button>
          <button
            onClick={() => setSyncTab('file')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              syncTab === 'file'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💾 JSON File Backup
          </button>
        </div>

        {syncSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{syncSuccessMsg}</span>
          </div>
        )}

        {syncTab === 'mongo' && (
          <div className="space-y-4">
            {!isAuthenticated ? (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 mt-0.5 shrink-0">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Authentication Required</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Cloud sync securely links your streaks, solved questions, and bookmarks to your verified account to prevent data tampering.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth?.('login');
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <LogIn size={15} />
                    <span>Sign In to Enable Cloud Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth?.('signup');
                    }}
                    className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Create a Free Account</span>
                  </button>
                </div>

                <div className="pt-1 text-[11px] text-slate-500 text-center">
                  Want to backup locally without signing in? Switch to the{' '}
                  <button
                    onClick={() => setSyncTab('file')}
                    className="text-blue-600 font-semibold underline hover:text-blue-700"
                  >
                    JSON File Backup
                  </button>{' '}
                  tab.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Signed-In Account</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{userEmail || userName || 'Authenticated User'}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-xs shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sync Active
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your progress is automatically saved to MongoDB in the background. You can also trigger a manual push or pull at any time:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={onMongoPush}
                    disabled={isSyncing}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Cloud size={14} />
                    <span>{isSyncing ? 'Syncing...' : 'Push to Cloud'}</span>
                  </button>

                  <button
                    onClick={onMongoPull}
                    disabled={isSyncing}
                    className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'Pulling...' : 'Pull from Cloud'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {syncTab === 'file' && (
          <div className="space-y-4">
            {/* Download Option */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Export Progress JSON</h4>
                <p className="text-xs text-slate-500">Download your study streak & notes backup</p>
              </div>
              <button
                onClick={onExportJSON}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            </div>

            {/* Upload Option */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Import Backup File</h4>
                <p className="text-xs text-slate-500">Upload JSON backup file from your phone or PC</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex-1 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-2 border border-slate-200 transition-colors">
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
              <label className="text-xs font-medium text-slate-700">Or Paste JSON Data Directly:</label>
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste JSON content here..."
                className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 outline-none"
              />
              <button
                onClick={handleImportSubmit}
                disabled={!importJsonText.trim()}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw size={14} />
                <span>Restore Progress</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
