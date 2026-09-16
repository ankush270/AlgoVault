import React, { useState } from 'react';
import { Cloud, X, CheckCircle2, RefreshCw, Download, Upload } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  mongoUserKey: string;
  setMongoUserKey: (key: string) => void;
  isSyncing: boolean;
  onMongoPush: () => void;
  onMongoPull: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  syncSuccessMsg: string;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  mongoUserKey,
  setMongoUserKey,
  isSyncing,
  onMongoPush,
  onMongoPull,
  onExportJSON,
  onImportJSON,
  syncSuccessMsg,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
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
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Your Cross-Device Sync Key:
                </label>
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
                  onClick={onMongoPush}
                  disabled={isSyncing}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Cloud size={14} />
                  <span>{isSyncing ? 'Syncing...' : 'Push to MongoDB'}</span>
                </button>

                <button
                  onClick={onMongoPull}
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
                onClick={onExportJSON}
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
  );
};
