import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Check } from 'lucide-react';
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

  useEffect(() => {
    if (topicId) {
      setNoteText(progress.notes[topicId] || '');
    }
  }, [topicId, progress.notes]);

  const handleSave = () => {
    if (topicId) {
      saveNote(topicId, noteText);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // If topicId is null, render all notes manager view
  if (!topicId) {
    const savedNoteEntries = Object.entries(progress.notes).filter(([_, note]) => note.trim().length > 0);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">SAVED NOTES</span>
            <span className="text-xs text-slate-400">{savedNoteEntries.length} Saved Notes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            My Study Notes & Code Snippets
          </h1>
        </div>

        {savedNoteEntries.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Notes Saved Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Open any topic and click "Add Personal Note" to write down key interview tricks or personal summaries.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedNoteEntries.map(([tId, noteContent]) => {
              const topicObj = allTopics.find(t => t.id === tId);
              return (
                <div key={tId} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">
                      {topicObj ? topicObj.title : tId}
                    </h3>
                    {topicObj && (
                      <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {topicObj.category}
                      </span>
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">Personal Note & Snippets</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-300">{topicTitle}</p>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write down personal notes, code tricks, time complexity reminders, or interview questions..."
          className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:border-purple-500 outline-none leading-relaxed resize-none"
        />

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check size={14} /> Saved to Local Storage!
            </span>
          ) : <span />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
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
