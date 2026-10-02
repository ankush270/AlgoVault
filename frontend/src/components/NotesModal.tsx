import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, FileText, Check, Search, Trash2, Edit3, Sparkles, BookOpen } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';

interface NotesModalProps {
  topicId: string | null;
  topicTitle?: string;
  onClose: () => void;
  onSelectTopicById?: (id: string) => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  topicId,
  topicTitle,
  onClose,
  onSelectTopicById,
}) => {
  const { progress, saveNote } = useProgress();
  const [noteText, setNoteText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (topicId) {
      setNoteText(progress.notes[topicId] || '');
    }
  }, [topicId, progress.notes]);

  const handleSave = () => {
    const target = topicId || editingTargetId;
    if (target) {
      saveNote(target, noteText);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (topicId) onClose();
        if (editingTargetId) setEditingTargetId(null);
      }, 1000);
    }
  };

  const formatFallbackTitle = (id: string) => {
    return id
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // If topicId is null, render all notes manager view
  if (!topicId && !editingTargetId) {
    const savedNoteEntries = Object.entries(progress.notes).filter(
      ([_, note]) => note && note.trim().length > 0
    );

    const filteredEntries = savedNoteEntries.filter(([id, note]) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const topicObj = allTopics.find((t) => t.id === id);
      const title = topicObj ? topicObj.title : formatFallbackTitle(id);
      return title.toLowerCase().includes(q) || note.toLowerCase().includes(q) || id.toLowerCase().includes(q);
    });

    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        <div className="card-surface p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <BookOpen size={13} />
                <span>SAVED NOTES</span>
              </span>
              <span className="text-xs text-slate-500 font-semibold">{savedNoteEntries.length} Questions & Topics</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              My Study Notes & Code Snippets
            </h1>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in saved notes..."
              className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="card-surface p-12 rounded-3xl border border-slate-200 text-center space-y-3 bg-white">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">
              {savedNoteEntries.length === 0 ? 'No Notes Saved Yet' : 'No matching notes found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {savedNoteEntries.length === 0
                ? 'Click on the 📝 Note icon on any question or topic in the sheet to write down key intuition, edge cases, and code tricks for future revision.'
                : 'Try adjusting your search query.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map(([tId, noteContent]) => {
              const topicObj = allTopics.find((t) => t.id === tId);
              const displayTitle = topicObj ? topicObj.title : formatFallbackTitle(tId);
              const isQuestion = !topicObj;

              return (
                <div key={tId} className="card-surface p-5 rounded-2xl border border-slate-200 space-y-3 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {displayTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 pt-1">
                        {topicObj ? (
                          <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {topicObj.category}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            DSA Question Note
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTargetId(tId);
                          setNoteText(noteContent);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Edit Note"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete notes for "${displayTitle}"?`)) {
                            saveNote(tId, '');
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {noteContent}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const activeId = topicId || editingTargetId;
  const activeTopicObj = activeId ? allTopics.find((t) => t.id === activeId) : null;
  const headerTitle = topicTitle || (activeTopicObj ? activeTopicObj.title : activeId ? formatFallbackTitle(activeId) : 'Revision Note');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">Personal Revision Note</h3>
          </div>
          <button
            onClick={() => {
              if (topicId) onClose();
              if (editingTargetId) setEditingTargetId(null);
            }}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-600">{headerTitle}</p>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write down personal notes, code tricks, time complexity reminders, key edge cases, or interview questions..."
          className="w-full h-48 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-2xl p-4 text-xs font-mono text-slate-800 placeholder-slate-400 outline-none leading-relaxed resize-none transition-all shadow-inner"
        />

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Check size={14} /> Saved to Local Storage!
            </span>
          ) : <span />}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (topicId) onClose();
                if (editingTargetId) setEditingTargetId(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-200 transition-all active:scale-95"
            >
              <Save size={14} />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
