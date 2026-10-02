import React, { useState, useEffect } from 'react';
import { X, Save, Star, Trash2, ExternalLink, Sparkles, BookOpen, Clock, AlertTriangle, Code2, Check } from 'lucide-react';
import { StriverProblem } from './types';
import { useProgress } from '../../context/ProgressContext';

interface QuestionNotesModalProps {
  problem: StriverProblem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionNotesModal: React.FC<QuestionNotesModalProps> = ({
  problem,
  isOpen,
  onClose,
}) => {
  const { progress, saveNote, toggleStar } = useProgress();
  const [noteText, setNoteText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (problem) {
      setNoteText(progress.notes[problem.id] || '');
    }
  }, [problem, progress.notes]);

  if (!isOpen || !problem) return null;

  const isStarred = !!progress.starred[problem.id];

  const handleSave = () => {
    saveNote(problem.id, noteText);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear this question note?')) {
      setNoteText('');
      saveNote(problem.id, '');
    }
  };

  const insertTemplate = (template: string) => {
    setNoteText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n\n${template}` : template;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative space-y-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 shrink-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <BookOpen size={12} />
                <span>Revision Note</span>
              </span>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  problem.difficulty === 'Easy'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {problem.difficulty}
              </span>

              {problem.source && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {problem.source}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate">
                {problem.title}
              </h3>
              {problem.url && (
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-cyan-600 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                  title="Open problem in new tab"
                >
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Star Toggle in Header */}
            <button
              onClick={() => toggleStar(problem.id)}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isStarred
                  ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-sm'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-500 hover:border-amber-200'
              }`}
              title={isStarred ? 'Starred for revision (click to unstar)' : 'Star mark for revision'}
            >
              <Star
                size={16}
                className={isStarred ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}
              />
              <span className="hidden sm:inline">{isStarred ? 'Starred' : 'Star'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Insert Snippet Buttons */}
        <div className="space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-0.5">
            <span className="flex items-center gap-1 text-purple-700 font-bold">
              <Sparkles size={12} />
              <span>Quick Revision Templates:</span>
            </span>
            <span>Click to add structured section</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => insertTemplate('💡 **Key Intuition & Approach:**\n- ')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 transition-all flex items-center gap-1"
            >
              💡 Intuition
            </button>

            <button
              type="button"
              onClick={() => insertTemplate('⚡ **Time & Space Complexity:**\n- Time: O()\n- Space: O()')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-200 hover:border-cyan-300 transition-all flex items-center gap-1"
            >
              <Clock size={11} /> Complexity
            </button>

            <button
              type="button"
              onClick={() => insertTemplate('⚠️ **Edge Cases & Traps:**\n- Array length 0 or 1\n- Duplicates / Negative numbers\n- Integer overflow')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 hover:border-amber-300 transition-all flex items-center gap-1"
            >
              <AlertTriangle size={11} /> Edge Cases
            </button>

            <button
              type="button"
              onClick={() => insertTemplate('💻 **Code Snippet / Trick:**\n```cpp\n// Optimal two-pointer / hashing trick\n```')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all flex items-center gap-1"
            >
              <Code2 size={11} /> Code Trick
            </button>
          </div>
        </div>

        {/* Textarea Editor */}
        <div className="relative flex-1 min-h-[180px]">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write personal revision notes, key logic tricks, corner cases, or optimal pattern reminders for this question..."
            className="w-full h-full min-h-[220px] bg-slate-50/90 border border-slate-200 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-100 rounded-2xl p-4 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 outline-none leading-relaxed resize-none shadow-inner transition-all"
            autoFocus
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            {noteText.trim() && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Clear note text"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
            <span className="text-[11px] text-slate-400 font-mono">
              {noteText.length} characters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-200 active:scale-95'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check size={14} className="stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
