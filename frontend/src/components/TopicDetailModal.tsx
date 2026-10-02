import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  List,
  Menu,
  BookMarked
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { TopicItem, ItemStatus, CodeTemplate } from '../types';
import { allTopics } from '../data/allData';
import { DifficultyRatingModal } from './common/DifficultyRatingModal';
import { CodeRunnerModal } from './common/CodeRunnerModal';

interface TopicDetailModalProps {
  topic: TopicItem | null;
  onClose: () => void;
  onOpenNote: (topicId: string, topicTitle: string) => void;
}

// Clean LaTeX / Math Expressions & Superscripts/Subscripts helper
const cleanMathAndFormatting = (text: string): string => {
  if (!text) return '';
  return text
    // Remove display math delimiters $$ ... $$
    .replace(/\$\$(.*?)\$\$/g, '$1')
    // Remove inline math delimiters $ ... $
    .replace(/\$(.*?)\$/g, '$1')
    // Replace Exponents ^0, ^1, ^2, ^3, etc. with Superscript Unicode
    .replace(/\^0/g, '⁰')
    .replace(/\^1/g, '¹')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^4/g, '⁴')
    .replace(/\^5/g, '⁵')
    .replace(/\^6/g, '⁶')
    .replace(/\^7/g, '⁷')
    .replace(/\^8/g, '⁸')
    .replace(/\^9/g, '⁹')
    .replace(/\^k/g, 'ᵏ')
    .replace(/\^N/g, 'ᴺ')
    .replace(/\^i/g, 'ⁱ')
    .replace(/\^n/g, 'ⁿ')
    // Replace Subscripts _2, _10 with Subscript Unicode
    .replace(/_2\b/g, '₂')
    .replace(/_10\b/g, '₁₀')
    // Replace LaTeX commands with clean, elegant Unicode representations
    .replace(/\\to/g, '→')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\sim/g, '~')
    .replace(/\\oplus/g, '⊕')
    .replace(/\\ll/g, '<<')
    .replace(/\\gg/g, '>>')
    .replace(/\\&/g, '&')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\lfloor\s*(.*?)\s*\\rfloor/g, '⌊$1⌋')
    .replace(/\\ceil\s*(.*?)\s*\\ceil/g, '⌈$1⌉')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\,\\&\\,/g, ' & ')
    .replace(/\\,/g, ' ')
    .replace(/\\_/g, '_')
    .replace(/\\mid/g, '|');
};

// Apple / macOS Styled Code Block Component
const AppleCodeBlock: React.FC<{ code: string; language?: string; filename?: string }> = ({ code, language = 'code', filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = code.split('\n');

  return (
    <div className="my-8 rounded-2xl overflow-hidden bg-[#0d1117] border border-slate-800 shadow-2xl ring-1 ring-white/10 transition-all duration-300 hover:border-slate-700">
      {/* Apple / macOS Window Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800/90 select-none">
        {/* Left: 3 macOS Traffic Light Dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/60 shadow-sm cursor-pointer hover:opacity-80 transition-opacity" title="Close" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/60 shadow-sm cursor-pointer hover:opacity-80 transition-opacity" title="Minimize" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/60 shadow-sm cursor-pointer hover:opacity-80 transition-opacity" title="Expand" />
        </div>

        {/* Center: Language / File Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 text-xs font-mono font-semibold tracking-wide shadow-inner">
          <Code2 size={13} className="text-cyan-400" />
          <span>{filename || language.toUpperCase()}</span>
        </div>

        {/* Right: Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/70 transition-all cursor-pointer shadow-sm active:scale-95"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed custom-scrollbar max-h-[600px] overflow-y-auto bg-[#0d1117]">
        <div className="flex min-w-full">
          {/* Line Numbers Gutter */}
          <div className="select-none text-slate-600 pr-4 text-right border-r border-slate-800/80 shrink-0 font-mono text-xs select-none">
            {codeLines.map((_, i) => (
              <div key={i} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual Code with Syntax Formatting */}
          <pre className="pl-4 text-emerald-300 flex-1 whitespace-pre leading-relaxed font-mono selection:bg-cyan-500/30 selection:text-white">
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Formatted Markdown Renderer Component
const FormattedMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = 'code';
  let tableRows: string[][] = [];
  let inTable = false;

  const processInlineFormatting = (rawText: string) => {
    const text = cleanMathAndFormatting(rawText);
    // Split by **bold**, *italic*, and `code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-slate-600">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="px-2 py-0.5 rounded-md bg-white border border-slate-200/90 font-mono text-cyan-700 text-xs sm:text-sm font-semibold">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const renderTable = (rows: string[][], tableIdx: number) => {
    if (rows.length === 0) return null;
    const header = rows[0];
    const body = rows.slice(1).filter(r => !r.every(c => c.trim().match(/^:?-+:?$/)));

    return (
      <div key={`table-${tableIdx}`} className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                {header.map((col, cIdx) => (
                  <th key={cIdx} className="px-5 py-4 font-extrabold uppercase tracking-wider text-cyan-700 bg-slate-100/70 border-r border-slate-200 last:border-r-0">
                    {processInlineFormatting(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {body.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/40">
                  {row.map((cell, cIdx) => {
                    const cellText = cleanMathAndFormatting(cell);
                    const isMathEquation = cellText.includes('×') || cellText.includes('⁰') || cellText.includes('¹') || cellText.includes('²') || cellText.includes('³') || cellText.includes('⁴') || cellText.includes('→') || cellText.includes('==') || cellText.includes('!=') || cellText.includes('₂');
                    return (
                      <td key={cIdx} className="px-5 py-3.5 text-slate-700 text-xs sm:text-sm leading-relaxed border-r border-slate-100 last:border-r-0">
                        {isMathEquation ? (
                          <span className="font-mono text-cyan-800 bg-cyan-50/80 px-2.5 py-1 rounded-lg border border-cyan-200 inline-block font-semibold">
                            {processInlineFormatting(cell)}
                          </span>
                        ) : (
                          processInlineFormatting(cell)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Table line processing (| col | col |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      inTable = true;
      return;
    } else if (inTable) {
      elements.push(renderTable(tableRows, index));
      tableRows = [];
      inTable = false;
    }

    // Code block toggle (```lang)
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <AppleCodeBlock key={`code-${index}`} code={codeBuffer.join('\n')} language={codeLang} />
        );
        codeBuffer = [];
        codeLang = 'code';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim() || 'code';
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Image (![alt](url))
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((https?:\/\/.*?)\)/);
    if (imgMatch) {
      const alt = imgMatch[1] || 'Architecture Diagram';
      const src = imgMatch[2];
      elements.push(
        <div key={`img-${index}`} className="my-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xl text-center">
          <img 
            src={src} 
            alt={alt} 
            className="max-h-[520px] w-auto mx-auto rounded-xl object-contain shadow-md hover:scale-[1.01] transition-transform duration-300" 
            loading="lazy" 
          />
          {alt && <p className="text-xs text-slate-500 mt-3 font-semibold italic">🖼️ {alt}</p>}
        </div>
      );
      return;
    }

    // Horizontal Rule (--- or ***)
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={index} className="my-8 border-t-2 border-slate-200/80" />);
      return;
    }

    // Callout / Blockquote (> ...)
    if (trimmed.startsWith('> ')) {
      elements.push(
        <div key={index} className="my-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-l-4 border-blue-600 text-sm sm:text-base text-slate-800 font-medium shadow-sm leading-relaxed">
          {processInlineFormatting(trimmed.slice(2))}
        </div>
      );
      return;
    }

    // Major Section Heading (##)
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-2xl sm:text-3xl font-black text-slate-900 mt-12 mb-6 pt-6 border-t-2 border-slate-200 tracking-tight">
          {processInlineFormatting(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    // Section / Step Heading (###)
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-xl sm:text-2xl font-black text-slate-900 mt-10 mb-5 pb-2.5 border-b border-slate-200 tracking-tight">
          {processInlineFormatting(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // Subheading (####)
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={index} className="text-base sm:text-lg font-extrabold text-blue-700 mt-8 mb-3.5 tracking-wide uppercase">
          {processInlineFormatting(trimmed.slice(5))}
        </h4>
      );
      return;
    }

    // Unordered List Items (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={index} className="flex items-start gap-3 my-2.5 ml-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0 shadow-sm" />
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
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
        <div key={index} className="flex items-start gap-3 my-2.5 ml-2">
          <span className="text-sm font-extrabold text-blue-600 shrink-0 mt-0.5 font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">{numberedMatch[1]}.</span>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {processInlineFormatting(numberedMatch[2])}
          </p>
        </div>
      );
      return;
    }

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={index} className="h-3" />);
      return;
    }

    // Normal Paragraph Text
    elements.push(
      <p key={index} className="text-sm sm:text-base text-slate-700 leading-relaxed my-3 font-normal">
        {processInlineFormatting(line)}
      </p>
    );
  });

  if (inTable && tableRows.length > 0) {
    elements.push(renderTable(tableRows, 9999));
  }

  return <div className="space-y-2">{elements}</div>;
};

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic: initialTopic,
  onClose,
  onOpenNote,
}) => {
  const { progress, updateStatus, toggleStar, getRevisionRecord } = useProgress();

  const [currentTopic, setCurrentTopic] = useState<TopicItem | null>(initialTopic);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'code' | 'qa'>('content');
  const [selectedLang, setSelectedLang] = useState<string>('cpp');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCodeWorkspace, setShowCodeWorkspace] = useState(false);

  useEffect(() => {
    setCurrentTopic(initialTopic);
    if (initialTopic?.codeTemplates && initialTopic.codeTemplates.length > 0) {
      setSelectedLang(initialTopic.codeTemplates[0].language);
    }
  }, [initialTopic]);

  // Handle ESC key to exit full page reader
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!currentTopic) return null;

  const topic = currentTopic;

  // Filter sibling topics in the same category/module for navigation
  const categoryTopics = allTopics.filter(t =>
    topic.category
      ? t.domain === topic.domain && t.category === topic.category
      : t.domain === topic.domain
  );
  const currentIndex = categoryTopics.findIndex(t => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? categoryTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < categoryTopics.length - 1 ? categoryTopics[currentIndex + 1] : null;

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
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-800 flex flex-col overflow-hidden animate-fadeIn">
      {/* Top sticky navbar */}
      <header className="h-auto min-h-16 py-2.5 bg-white border-b border-slate-200 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="inline sm:inline">Back</span>
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              sidebarOpen
                ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Toggle Curriculum Sidebar"
          >
            <List size={15} className="text-blue-600" />
            <span>Topics ({categoryTopics.length})</span>
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 min-w-0 truncate pl-2 border-l border-slate-200">
            <span className="uppercase font-extrabold text-blue-600">{topic.domain}</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-slate-600 truncate">{topic.category}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={() => toggleStar(topic.id)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-amber-600 border border-slate-200 transition-all"
            title="Star Topic"
          >
            <Star size={16} className={isStarred ? 'fill-amber-500 text-amber-500' : ''} />
          </button>

          <button
            onClick={() => onOpenNote(topic.id, topic.title)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              hasNote
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <FileText size={14} />
            <span className="hidden sm:inline">{hasNote ? 'Edit Note' : 'Add Note'}</span>
          </button>

          <button
            onClick={() => setShowRatingModal(true)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-200 flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Rate Understanding</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all ml-0.5"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Main Full Page Content Split View */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Backdrop on mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm transition-opacity"
          />
        )}

        {/* Left Sidebar: Topics Navigation Panel */}
        {sidebarOpen && (
          <aside className="fixed md:relative inset-y-0 left-0 w-80 max-w-[85vw] h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-40 md:z-10 animate-slideRight shadow-lg md:shadow-none">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked size={16} className="text-blue-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Module Index</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  {categoryTopics.length} Topics
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 transition-all"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {categoryTopics.map((t, idx) => {
                const active = t.id === topic.id;
                const status = progress.statuses[t.id] || 'todo';
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTopic(t);
                      setSelectedLang(t.codeTemplates && t.codeTemplates.length > 0 ? t.codeTemplates[0].language : 'cpp');
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${
                      active
                        ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                      active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className={`text-xs font-bold leading-snug line-clamp-2 ${active ? 'text-blue-950 font-extrabold' : 'text-slate-800'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className={`font-semibold ${
                          t.difficulty === 'Easy' ? 'text-emerald-600' :
                          t.difficulty === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {t.difficulty}
                        </span>
                        <span>•</span>
                        <span className="capitalize text-slate-500">{status.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Right Reader Container */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
          {/* Top Banner & Topic Title */}
          <div className="border-b border-slate-200 bg-white/40 px-6 sm:px-10 py-6">
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                    {topic.category}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    topic.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    topic.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {topic.difficulty}
                  </span>
                  {revRecord && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                      Next Revision: {revRecord.nextRevisionDateFormatted}
                    </span>
                  )}
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 px-2">Status:</span>
                  {(['todo', 'in-progress', 'mastered', 'needs-revision'] as ItemStatus[]).map((statusOption) => {
                    const active = currentStatus === statusOption;
                    return (
                      <button
                        key={statusOption}
                        onClick={() => updateStatus(topic.id, statusOption)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                          active && statusOption === 'mastered' ? 'bg-emerald-600 text-white shadow' :
                          active && statusOption === 'in-progress' ? 'bg-amber-600 text-white shadow' :
                          active && statusOption === 'needs-revision' ? 'bg-purple-600 text-white shadow' :
                          active && statusOption === 'todo' ? 'bg-slate-700 text-white' :
                          'text-slate-400 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        {statusOption.replace('-', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                {topic.title}
              </h1>

              {/* Company Tags */}
              {topic.companyTags && topic.companyTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                  <Building2 size={14} className="text-slate-500" />
                  <span className="font-semibold text-slate-400">Asked in:</span>
                  {topic.companyTags.map((c, idx) => (
                    <span key={idx} className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-slate-500 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="border-b border-slate-200 bg-white/40 px-6 sm:px-10 sticky top-0 z-10 backdrop-blur-md">
            <div className="max-w-6xl mx-auto flex items-center gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-3.5 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'content' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles size={16} />
                <span>Deep Dive Study Guide</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen size={16} />
                <span>Summary & Key Concepts</span>
              </button>

              {topic.codeTemplates && topic.codeTemplates.length > 0 && (
                <button
                  onClick={() => setActiveTab('code')}
                  className={`py-3.5 flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'code' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Code2 size={16} />
                  <span>Code Templates ({topic.codeTemplates.length})</span>
                </button>
              )}

              {topic.interviewQuestions && topic.interviewQuestions.length > 0 && (
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`py-3.5 flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'qa' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle size={16} />
                  <span>Interview Q&A ({topic.interviewQuestions.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Reader Body Content */}
          <div className="flex-1 px-6 sm:px-10 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
              {activeTab === 'content' && (
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-600 shadow-md space-y-4">
                  <FormattedMarkdown content={topic.detailedContent} />
                </div>
              )}

              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Executive Summary</h4>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">{topic.summary}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-600" />
                      <span>Key Concepts & Invariants</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {topic.keyConcepts.map((concept, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-3.5">
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-blue-500/20">
                            {idx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {cleanMathAndFormatting(concept)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-4">
                  {/* Language Selector */}
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                    <div className="flex gap-1.5">
                      {topic.codeTemplates?.map((c) => (
                        <button
                          key={c.language}
                          onClick={() => setSelectedLang(c.language)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                            selectedLang === c.language
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-slate-400 hover:text-white hover:bg-slate-100'
                          }`}
                        >
                          {c.language}
                        </button>
                      ))}
                    </div>
                    {getActiveCodeTemplate() && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowCodeWorkspace(true)}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-900 text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          <Code2 size={14} />
                          <span>Run in Workspace</span>
                        </button>

                        <button
                          onClick={() => handleCopyCode(getActiveCodeTemplate()!.code)}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                        >
                          {copiedCode ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          <span>{copiedCode ? 'Copied Code!' : 'Copy Snippet'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Code Editor Box */}
                  {getActiveCodeTemplate() && (
                    <AppleCodeBlock 
                      code={getActiveCodeTemplate()!.code} 
                      language={selectedLang} 
                      filename={`${topic.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${selectedLang === 'cpp' ? 'cpp' : selectedLang === 'java' ? 'java' : selectedLang === 'javascript' ? 'js' : selectedLang === 'sql' ? 'sql' : 'py'}`} 
                    />
                  )}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="space-y-4">
                  {topic.interviewQuestions?.map((q, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-lg">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold shrink-0">
                          Q{idx + 1}
                        </span>
                        <h4 className="font-bold text-white text-sm sm:text-base leading-snug">{q.question}</h4>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {cleanMathAndFormatting(q.answer)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Pagination / Sequential Reader Controls */}
              <div className="pt-8 pb-4 pr-48 sm:pr-56 border-t border-slate-200 flex items-center justify-between gap-4">
                {prevTopic ? (
                  <button
                    onClick={() => {
                      setCurrentTopic(prevTopic);
                      setSelectedLang(prevTopic.codeTemplates && prevTopic.codeTemplates.length > 0 ? prevTopic.codeTemplates[0].language : 'cpp');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 transition-all"
                  >
                    <ChevronLeft size={16} />
                    <div className="text-left hidden sm:block">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Previous Topic</span>
                      <span className="truncate max-w-[180px] block">{prevTopic.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextTopic ? (
                  <button
                    onClick={() => {
                      setCurrentTopic(nextTopic);
                      setSelectedLang(nextTopic.codeTemplates && nextTopic.codeTemplates.length > 0 ? nextTopic.codeTemplates[0].language : 'cpp');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-200 ml-auto"
                  >
                    <div className="text-right hidden sm:block">
                      <span className="block text-[10px] text-blue-200 uppercase font-semibold">Next Topic</span>
                      <span className="truncate max-w-[180px] block">{nextTopic.title}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-200 ml-auto"
                  >
                    <CheckCircle2 size={16} />
                    <span>Finish Module</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Embedded Spaced Repetition Rating Modal */}
      {showRatingModal && (
        <DifficultyRatingModal
          topic={topic}
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
        />
      )}

      {showCodeWorkspace && topic && (
        <CodeRunnerModal
          isOpen={showCodeWorkspace}
          onClose={() => setShowCodeWorkspace(false)}
          problemTitle={topic.title}
          problemDescription={topic.summary}
          initialCode={getActiveCodeTemplate()?.code}
          initialLanguage={selectedLang}
        />
      )}
    </div>
  );
};
