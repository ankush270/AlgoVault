import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Edit3, 
  Eye, 
  Columns, 
  ExternalLink, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Copy, 
  Check, 
  EyeOff, 
  Sparkles, 
  BookOpen, 
  Link2,
  Code2,
  List,
  Heading1,
  Heading2,
  Table as TableIcon,
  Quote
} from 'lucide-react';
import { 
  VaultSubtopicNote, 
  VaultProblem, 
  VaultMedia, 
  vaultService 
} from '../services/vaultService';

interface VaultNoteEditorProps {
  subtopic: VaultSubtopicNote;
  topicTitle: string;
  domainName: string;
  categoryName: string;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
  onSubtopicUpdated: (updated: VaultSubtopicNote) => void;
  onSubtopicDeleted: (subtopicId: string) => void;
}

// LaTeX / Math character cleaner
const cleanMathAndFormatting = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\$\$(.*?)\$\$/g, '$1')
    .replace(/\$(.*?)\$/g, '$1')
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
    .replace(/_2\b/g, '₂');
};

// Rich Markdown View Component
const RichMarkdownViewer: React.FC<{ content: string; activeRecallMode: boolean }> = ({ content, activeRecallMode }) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [revealedBlocks, setRevealedBlocks] = useState<Record<number, boolean>>({});

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const toggleReveal = (idx: number) => {
    setRevealedBlocks(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!content) {
    return (
      <div className="py-12 text-center text-slate-400">
        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No notes written yet. Click <strong>Edit Notes</strong> above to start writing.</p>
      </div>
    );
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = 'code';
  let tableRows: string[][] = [];
  let inTable = false;
  let codeBlockCounter = 0;

  const processInline = (raw: string) => {
    const text = cleanMathAndFormatting(raw);
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs font-semibold">{part.slice(1, -1)}</code>;
      }
      // Link markdown [text](url)
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-1">
            {linkMatch[1]}
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }
      return part;
    });
  };

  const renderTable = (rows: string[][], tableIdx: number) => {
    if (rows.length === 0) return null;
    const header = rows[0];
    const body = rows.slice(1).filter(r => !r.every(c => c.trim().match(/^:?-+:?$/)));

    return (
      <div key={`table-${tableIdx}`} className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                {header.map((col, cIdx) => (
                  <th key={cIdx} className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-700 bg-slate-100/70 border-r border-slate-200 last:border-r-0">
                    {processInline(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {body.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors even:bg-slate-50/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 text-slate-700 border-r border-slate-100 last:border-r-0">
                      {processInline(cell)}
                    </td>
                  ))}
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

    // Code block check
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        const fullCode = codeBuffer.join('\n');
        const currentCounter = codeBlockCounter++;
        const isHidden = activeRecallMode && !revealedBlocks[currentCounter];

        elements.push(
          <div key={`code-${index}`} className="my-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase">{codeLang || 'Code'}</span>
              <div className="flex items-center gap-2">
                {activeRecallMode && (
                  <button
                    onClick={() => toggleReveal(currentCounter)}
                    className="px-2 py-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded flex items-center gap-1 transition"
                  >
                    {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {isHidden ? 'Reveal Code' : 'Hide (Recall)'}
                  </button>
                )}
                <button
                  onClick={() => handleCopy(fullCode, currentCounter)}
                  className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded flex items-center gap-1 transition"
                >
                  {copiedCodeIdx === currentCounter ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCodeIdx === currentCounter ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            {isHidden ? (
              <div 
                onClick={() => toggleReveal(currentCounter)}
                className="p-8 text-center bg-slate-950/80 cursor-pointer hover:bg-slate-900 transition flex flex-col items-center justify-center space-y-2"
              >
                <EyeOff className="w-6 h-6 text-amber-400 opacity-60" />
                <p className="text-xs font-mono text-amber-300">Code hidden for Active Recall. Click to test yourself!</p>
              </div>
            ) : (
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed whitespace-pre">
                <code>{fullCode}</code>
              </pre>
            )}
          </div>
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = 'code';
      } else {
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim() || 'code';
        codeBuffer = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Markdown Table check
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      tableRows.push(cells);
      return;
    } else if (inTable) {
      elements.push(renderTable(tableRows, index));
      tableRows = [];
      inTable = false;
    }

    // Callout alert
    if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!TIP]') || trimmed.startsWith('> [!WARNING]')) {
      const type = trimmed.includes('WARNING') ? 'warning' : trimmed.includes('TIP') ? 'tip' : 'note';
      const borderCol = type === 'warning' ? 'border-amber-500 bg-amber-50/70 text-amber-900' : type === 'tip' ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900' : 'border-indigo-500 bg-indigo-50/70 text-indigo-900';
      
      elements.push(
        <div key={index} className={`my-4 p-4 rounded-xl border-l-4 ${borderCol} shadow-xs`}>
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            {processInline(line.replace(/^>\s*\[!.*?\]\s*/, ''))}
          </p>
        </div>
      );
      return;
    }

    // Standard blockquote
    if (trimmed.startsWith('>')) {
      elements.push(
        <blockquote key={index} className="my-3 pl-4 border-l-4 border-slate-300 text-slate-700 italic text-sm">
          {processInline(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
      return;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-2xl font-black text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">{processInline(trimmed.slice(2))}</h1>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-xl font-extrabold text-slate-900 mt-6 mb-3">{processInline(trimmed.slice(3))}</h2>);
      return;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-lg font-bold text-slate-800 mt-5 mb-2">{processInline(trimmed.slice(4))}</h3>);
      return;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(<h4 key={index} className="text-base font-semibold text-slate-800 mt-4 mb-2">{processInline(trimmed.slice(5))}</h4>);
      return;
    }

    // Unordered List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={index} className="ml-5 list-disc text-sm text-slate-700 leading-relaxed my-1">
          {processInline(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <li key={index} className="ml-5 list-decimal text-sm text-slate-700 leading-relaxed my-1">
          {processInline(numMatch[2])}
        </li>
      );
      return;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={index} className="my-6 border-slate-200" />);
      return;
    }

    // Empty line
    if (!trimmed) {
      elements.push(<div key={index} className="h-3" />);
      return;
    }

    // Paragraph
    elements.push(
      <p key={index} className="text-sm sm:text-base text-slate-800 leading-relaxed my-2">
        {processInline(line)}
      </p>
    );
  });

  if (inTable && tableRows.length > 0) {
    elements.push(renderTable(tableRows, lines.length));
  }

  return <div className="space-y-1">{elements}</div>;
};

export const VaultNoteEditor: React.FC<VaultNoteEditorProps> = ({
  subtopic,
  topicTitle,
  domainName,
  categoryName,
  isAuthenticated,
  onRequireAuth,
  onSubtopicUpdated,
  onSubtopicDeleted
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'split'>('preview');
  const [title, setTitle] = useState(subtopic.title);
  const [markdown, setMarkdown] = useState(subtopic.contentMarkdown);
  const [problems, setProblems] = useState<VaultProblem[]>(subtopic.problems || []);
  const [media, setMedia] = useState<VaultMedia[]>(subtopic.media || []);
  const [revisionStatus, setRevisionStatus] = useState(subtopic.revisionStatus || 'moderate');
  const [activeRecallMode, setActiveRecallMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modal / Inline Add States
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbNum, setNewProbNum] = useState('');
  const [newProbPlatform, setNewProbPlatform] = useState<VaultProblem['platform']>('leetcode');
  const [newProbUrl, setNewProbUrl] = useState('');

  const [showAddMedia, setShowAddMedia] = useState(false);
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | 'pdf'>('video');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // Sync state when incoming subtopic changes
  useEffect(() => {
    setTitle(subtopic.title);
    setMarkdown(subtopic.contentMarkdown);
    setProblems(subtopic.problems || []);
    setMedia(subtopic.media || []);
    setRevisionStatus(subtopic.revisionStatus || 'moderate');
    setIsEditing(false);
  }, [subtopic._id]);

  const handleEditClick = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    setIsEditing(true);
    setViewMode('split');
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    try {
      setIsSaving(true);
      const updated = await vaultService.updateSubtopic(subtopic._id, {
        title,
        contentMarkdown: markdown,
        problems,
        media,
        revisionStatus
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setIsEditing(false);
      onSubtopicUpdated(updated);
    } catch (err: any) {
      setIsSaving(false);
      alert(err.message || 'Failed to save notes');
    }
  };

  const handleRevisionChange = async (newStatus: 'weak' | 'moderate' | 'mastered') => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    setRevisionStatus(newStatus);
    try {
      const updated = await vaultService.updateRevisionStatus(subtopic._id, newStatus);
      onSubtopicUpdated(updated);
    } catch (err: any) {
      console.error('Failed to update revision status:', err);
    }
  };

  const handleAddProblem = () => {
    if (!newProbTitle.trim()) return;
    const newProb: VaultProblem = {
      platform: newProbPlatform,
      problemNumber: newProbNum.trim(),
      title: newProbTitle.trim(),
      url: newProbUrl.trim() || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(newProbTitle)}`,
      status: 'todo'
    };
    const updated = [...problems, newProb];
    setProblems(updated);
    setNewProbTitle('');
    setNewProbNum('');
    setNewProbUrl('');
    setShowAddProblem(false);
  };

  const handleToggleProblemStatus = (idx: number) => {
    const nextStatusMap: Record<VaultProblem['status'], VaultProblem['status']> = {
      todo: 'solved',
      solved: 'review',
      review: 'todo'
    };
    const updated = [...problems];
    updated[idx].status = nextStatusMap[updated[idx].status];
    setProblems(updated);
    if (!isEditing && isAuthenticated) {
      vaultService.updateSubtopic(subtopic._id, { problems: updated }).then(onSubtopicUpdated);
    }
  };

  const handleRemoveProblem = (idx: number) => {
    const updated = problems.filter((_, i) => i !== idx);
    setProblems(updated);
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const newM: VaultMedia = {
      type: newMediaType,
      title: newMediaTitle.trim() || `${newMediaType.toUpperCase()} Reference`,
      url: newMediaUrl.trim()
    };
    const updated = [...media, newM];
    setMedia(updated);
    setNewMediaTitle('');
    setNewMediaUrl('');
    setShowAddMedia(false);
  };

  const handleRemoveMedia = (idx: number) => {
    const updated = media.filter((_, i) => i !== idx);
    setMedia(updated);
  };

  const insertMarkdownSyntax = (syntax: string, placeholder = 'text') => {
    setMarkdown(prev => prev + `\n${syntax} ${placeholder}`);
  };

  const formatLastRevised = (dateStr: string) => {
    if (!dateStr) return 'Never revised';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  // Extract YouTube Embed URL helper
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col gap-3">
        {/* Breadcrumb & Revision Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{domainName}</span>
            <span>/</span>
            <span>{categoryName}</span>
            <span>/</span>
            <span className="text-slate-700">{topicTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Revision Status Pill */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
              <button
                onClick={() => handleRevisionChange('weak')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  revisionStatus === 'weak' 
                    ? 'bg-rose-500 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Needs quick revision"
              >
                🔴 Weak
              </button>
              <button
                onClick={() => handleRevisionChange('moderate')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  revisionStatus === 'moderate' 
                    ? 'bg-amber-500 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Understood, needs practice"
              >
                🟡 Moderate
              </button>
              <button
                onClick={() => handleRevisionChange('mastered')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  revisionStatus === 'mastered' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Solid mastery"
              >
                🟢 Mastered
              </button>
            </div>

            {/* Active Recall Mode Toggle */}
            <button
              onClick={() => setActiveRecallMode(!activeRecallMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                activeRecallMode
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Hide code snippets & answers to test recall"
            >
              {activeRecallMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{activeRecallMode ? 'Quiz Mode ON' : 'Quiz Mode'}</span>
            </button>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Notes</span>
              </button>
            )}
          </div>
        </div>

        {/* Title & Last Revised Info */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl sm:text-2xl font-black text-slate-900 bg-white border border-indigo-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-xl"
              placeholder="Subtopic Title"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Revised {formatLastRevised(subtopic.lastRevisedAt)}</span>
            </span>
            {saveSuccess && (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Linked Problems Bar */}
      <div className="px-5 py-3 bg-slate-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Practice Problems ({problems.length}):</span>
          </span>

          {problems.map((prob, idx) => {
            const statusBg = prob.status === 'solved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : prob.status === 'review' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-700';
            const statusDot = prob.status === 'solved' ? 'bg-emerald-500' : prob.status === 'review' ? 'bg-amber-500' : 'bg-slate-400';

            return (
              <div 
                key={idx} 
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${statusBg} shadow-2xs`}
              >
                <button
                  onClick={() => handleToggleProblemStatus(idx)}
                  title="Click to toggle status (Todo -> Solved -> Review)"
                  className="flex items-center gap-1 hover:opacity-80"
                >
                  <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                  <span className="font-semibold uppercase text-[10px] tracking-wider opacity-80">{prob.platform}</span>
                </button>
                <a 
                  href={prob.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>{prob.problemNumber ? `#${prob.problemNumber} ` : ''}{prob.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
                {isEditing && (
                  <button 
                    onClick={() => handleRemoveProblem(idx)}
                    className="ml-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => {
              if (!isAuthenticated) { onRequireAuth(); return; }
              setShowAddProblem(true);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition"
          >
            <Plus className="w-3 h-3" />
            <span>Attach Problem</span>
          </button>
        </div>
      </div>

      {/* 3. Media Attachments Bar */}
      {media.length > 0 && (
        <div className="px-5 py-3 bg-white border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-rose-500" />
              <span>Media & Visual References ({media.length})</span>
            </span>
            <button
              onClick={() => {
                if (!isAuthenticated) { onRequireAuth(); return; }
                setShowAddMedia(true);
              }}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add More Media
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {media.map((item, mIdx) => {
              const ytEmbed = item.type === 'video' ? getYouTubeEmbedUrl(item.url) : null;

              return (
                <div key={mIdx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2 relative">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      {item.type === 'video' && <Video className="w-3.5 h-3.5 text-rose-500" />}
                      {item.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-sky-500" />}
                      {item.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{item.title}</span>
                    </span>
                    {isEditing && (
                      <button 
                        onClick={() => handleRemoveMedia(mIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {ytEmbed ? (
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 shadow-xs">
                      <iframe
                        src={ytEmbed}
                        title={item.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : item.type === 'image' ? (
                    <div className="rounded-lg overflow-hidden border border-slate-200 max-h-60 bg-white">
                      <img src={item.url} alt={item.title} className="w-full h-auto object-contain max-h-60" />
                    </div>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 hover:text-indigo-600 transition"
                    >
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span>Open PDF Document</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Edit Toolbars & View Area */}
      {isEditing && (
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Markdown Shortcuts */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => insertMarkdownSyntax('##', 'Section Title')}
              className="p-1.5 hover:bg-white rounded text-slate-700 font-bold text-xs"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('###', 'Subsection')}
              className="p-1.5 hover:bg-white rounded text-slate-700 font-bold text-xs"
              title="Heading 3"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('**bold**')}
              className="p-1.5 hover:bg-white rounded text-slate-700 font-bold text-xs"
              title="Bold"
            >
              B
            </button>
            <button
              onClick={() => insertMarkdownSyntax('```cpp\n// C++ Code here\n```')}
              className="p-1.5 hover:bg-white rounded text-slate-700 font-mono text-xs flex items-center gap-1"
              title="Code Block"
            >
              <Code2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('| Term | Description |\n| :--- | :--- |\n| A | B |')}
              className="p-1.5 hover:bg-white rounded text-slate-700 text-xs flex items-center gap-1"
              title="Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('> [!NOTE]\n> Key intuition note here')}
              className="p-1.5 hover:bg-white rounded text-slate-700 text-xs flex items-center gap-1"
              title="Callout Note"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddMedia(true)}
              className="p-1.5 hover:bg-white rounded text-slate-700 text-xs flex items-center gap-1"
              title="Attach Video or Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Split vs Preview */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'split' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
              }`}
            >
              <Columns className="w-3.5 h-3.5 inline mr-1" />
              Split Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'preview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Preview Only
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Canvas / Editor Pane */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        {isEditing && viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
            {/* Editor Textarea */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Markdown Source (Hinglish/English, Formulas, Code)
              </label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your intuition, code snippets, formulas, constraints rules..."
                className="flex-1 w-full p-4 font-mono text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none min-h-[450px]"
              />
            </div>

            {/* Live Rendered Output */}
            <div className="flex flex-col h-full border-l lg:border-slate-200 lg:pl-6 overflow-y-auto">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                Live Preview
              </label>
              <div className="prose max-w-none">
                <RichMarkdownViewer content={markdown} activeRecallMode={activeRecallMode} />
              </div>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <RichMarkdownViewer content={markdown} activeRecallMode={activeRecallMode} />
          </div>
        )}
      </div>

      {/* Modal: Attach Problem */}
      {showAddProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Attach Practice Problem</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Platform</label>
                <select
                  value={newProbPlatform}
                  onChange={(e) => setNewProbPlatform(e.target.value as any)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="leetcode">LeetCode</option>
                  <option value="striver">Striver SDE Sheet</option>
                  <option value="gfg">GeeksforGeeks</option>
                  <option value="codeforces">Codeforces</option>
                  <option value="other">Other Platform</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Problem Number (Optional, e.g. 207)</label>
                <input
                  type="text"
                  value={newProbNum}
                  onChange={(e) => setNewProbNum(e.target.value)}
                  placeholder="e.g. 207"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Problem Title</label>
                <input
                  type="text"
                  value={newProbTitle}
                  onChange={(e) => setNewProbTitle(e.target.value)}
                  placeholder="e.g. Course Schedule (Cycle Detection)"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">URL / Link</label>
                <input
                  type="text"
                  value={newProbUrl}
                  onChange={(e) => setNewProbUrl(e.target.value)}
                  placeholder="https://leetcode.com/problems/course-schedule/"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddProblem(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProblem}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold"
              >
                Attach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Attach Media (YouTube / Image / PDF) */}
      {showAddMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Media & References</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Media Type</label>
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as any)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="video">YouTube Video Lecture</option>
                  <option value="image">Image / Diagram URL</option>
                  <option value="pdf">PDF Document / Cheat Sheet Link</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Title / Caption</label>
                <input
                  type="text"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  placeholder="e.g. Striver Graph Playlist Lecture 1"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">URL</label>
                <input
                  type="text"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://image-url"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddMedia(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedia}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold"
              >
                Embed Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
