import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Brain, 
  Star, 
  Code2, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Copy, 
  Check, 
  Sparkles,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { TopicItem, ItemStatus, CodeTemplate } from '../types';
import { DifficultyRatingModal } from './common/DifficultyRatingModal';

interface TopicDetailModalProps {
  topic: TopicItem | null;
  onClose: () => void;
  onOpenNote: (topicId: string, topicTitle: string) => void;
}

// Formatted Markdown Renderer Helper Component
const FormattedMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  const processInlineFormatting = (text: string) => {
    // Split by **bold**, *italic*, and `code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-slate-300">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-xs">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Code block toggle
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-3 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            <pre>{codeBuffer.join('\n')}</pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Headings (Removing raw # and formatting into styled headers)
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={index} className="text-sm font-bold text-cyan-400 mt-4 mb-2">
          {processInlineFormatting(trimmed.slice(5))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base sm:text-lg font-black text-white mt-5 mb-2 pb-1 border-b border-slate-800">
          {processInlineFormatting(trimmed.slice(4))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg sm:text-xl font-black text-white mt-6 mb-3">
          {processInlineFormatting(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    // Unordered List Items (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={index} className="flex items-start gap-2.5 my-1.5 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {processInlineFormatting(trimmed.slice(2))}
          </p>
        </div>
      );
      return;
    }

    // Numbered List Items (1. , 2. )
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      elements.push(
        <div key={index} className="flex items-start gap-2.5 my-1.5 ml-2">
          <span className="text-xs font-bold text-cyan-400 shrink-0 mt-0.5">{numberedMatch[1]}.</span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {processInlineFormatting(numberedMatch[2])}
          </p>
        </div>
      );
      return;
    }

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={index} className="h-1.5" />);
      return;
    }

    // Normal Paragraph Text
    elements.push(
      <p key={index} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-1">
        {processInlineFormatting(line)}
      </p>
    );
  });

  return <div className="space-y-1">{elements}</div>;
};

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  onClose,
  onOpenNote,
}) => {
  if (!topic) return null;

  const { progress, updateStatus, toggleStar, recordRevision, getRevisionRecord } = useProgress();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'code' | 'qa'>('overview');
  const [selectedLang, setSelectedLang] = useState<string>(
    topic.codeTemplates && topic.codeTemplates.length > 0 ? topic.codeTemplates[0].language : 'python'
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const isStarred = !!progress.starred[topic.id];
  const currentStatus = progress.statuses[topic.id] || 'todo';
  const hasNote = !!progress.notes[topic.id];
  const revRecord = getRevisionRecord(topic.id);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getActiveCodeTemplate = (): CodeTemplate | undefined => {
    return topic.codeTemplates?.find(c => c.language === selectedLang) || topic.codeTemplates?.[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400">
                {topic.category}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                topic.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                topic.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {topic.difficulty}
              </span>
              {revRecord && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Next revision: {revRecord.nextRevisionDateFormatted}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {topic.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <Building2 size={14} className="text-slate-500" />
              <span>Asked in:</span>
              {topic.companyTags.map((c, idx) => (
                <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStar(topic.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-all"
            >
              <Star size={18} className={isStarred ? 'fill-amber-400 text-amber-400' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Status Action Selector */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-300">Update Status:</span>
          <div className="flex items-center gap-2">
            {(['todo', 'in-progress', 'mastered', 'needs-revision'] as ItemStatus[]).map((statusOption) => {
              const active = currentStatus === statusOption;
              return (
                <button
                  key={statusOption}
                  onClick={() => updateStatus(topic.id, statusOption)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all capitalize ${
                    active && statusOption === 'mastered' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' :
                    active && statusOption === 'in-progress' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' :
                    active && statusOption === 'needs-revision' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' :
                    active && statusOption === 'todo' ? 'bg-slate-700 text-white' :
                    'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {statusOption.replace('-', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="px-6 pt-3 bg-slate-900/40 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={15} />
            <span>Overview & Key Concepts</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'content' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={15} />
            <span>Deep Dive Breakdown</span>
          </button>

          {topic.codeTemplates && topic.codeTemplates.length > 0 && (
            <button
              onClick={() => setActiveTab('code')}
              className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'code' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Code2 size={15} />
              <span>Code Templates ({topic.codeTemplates.length})</span>
            </button>
          )}

          {topic.interviewQuestions && topic.interviewQuestions.length > 0 && (
            <button
              onClick={() => setActiveTab('qa')}
              className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'qa' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle size={15} />
              <span>Interview Q&A ({topic.interviewQuestions.length})</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Summary</h4>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">{topic.summary}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-400" />
                  <span>Key Concepts & Core Invariants</span>
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {topic.keyConcepts.map((concept, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{concept}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200">
              <FormattedMarkdown content={topic.detailedContent} />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Language Switcher */}
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="flex gap-1">
                  {topic.codeTemplates?.map((c) => (
                    <button
                      key={c.language}
                      onClick={() => setSelectedLang(c.language)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedLang === c.language
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {c.language}
                    </button>
                  ))}
                </div>
                {getActiveCodeTemplate() && (
                  <button
                    onClick={() => handleCopyCode(getActiveCodeTemplate()!.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                )}
              </div>

              {/* Code Snippet */}
              {getActiveCodeTemplate() && (
                <div className="rounded-2xl bg-[#090D16] border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed">
                  <pre>{getActiveCodeTemplate()!.code}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-4">
              {topic.interviewQuestions?.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      Q{idx + 1}
                    </span>
                    <h4 className="font-bold text-white text-sm leading-snug">{q.question}</h4>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    {q.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
          <button
            onClick={() => onOpenNote(topic.id, topic.title)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              hasNote
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>{hasNote ? 'Edit My Note' : 'Add Personal Note'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRatingModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Rate Understanding (Spaced Repetition)</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Difficulty Rating Modal */}
      {showRatingModal && (
        <DifficultyRatingModal
          topic={topic}
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};
