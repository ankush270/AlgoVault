import React, { useState } from 'react';
import {
  FileText,
  Download,
  Building2,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  Layers,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { COMPANY_BENCHMARKS, calculateCompanyReadiness, CompanyBenchmark } from '../utils/readinessMath';
import type { PdfNoteItem, PdfTrickItem } from './RevisionPdfDocument';
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';

const DEFAULT_DSA_TRICKS: PdfTrickItem[] = [
  {
    title: 'Two Pointer Technique',
    pattern: 'Arrays & Strings',
    keyTakeaway: 'Use left/right pointers moving inwards for sorted arrays (e.g., Two Sum II, 3Sum, Container With Most Water).'
  },
  {
    title: 'Sliding Window (Variable Size)',
    pattern: 'Subarrays & Substrings',
    keyTakeaway: 'Maintain window boundaries and shrink from left when condition violates (e.g. Longest Substring Without Repeating Chars).'
  },
  {
    title: 'Monotonic Stack',
    pattern: 'Next Greater Element',
    keyTakeaway: 'Maintain stack in increasing or decreasing order to process next greater/smaller element in O(N) time.'
  },
  {
    title: 'Fast & Slow Pointer (Floyd Cycle Detection)',
    pattern: 'Linked Lists & Cycles',
    keyTakeaway: 'Slow moves 1 step, Fast moves 2 steps. If they meet, cycle exists. Reset slow to head to find cycle origin.'
  },
  {
    title: 'Topological Sort (Kahn\'s Algorithm)',
    pattern: 'Directed Graphs / Dependencies',
    keyTakeaway: 'Compute in-degrees of all nodes. Push in-degree 0 nodes to queue. Process neighbors and decrement in-degrees.'
  }
];

export const CheatSheetReadinessHub: React.FC = () => {
  const { progress, getMasteredCount } = useProgress();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('google');
  const [includeNotes, setIncludeNotes] = useState<boolean>(true);
  const [includeTricks, setIncludeTricks] = useState<boolean>(true);
  const [includeWeakConcepts, setIncludeWeakConcepts] = useState<boolean>(true);
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);

  const selectedCompany = COMPANY_BENCHMARKS.find((c) => c.id === selectedCompanyId) || COMPANY_BENCHMARKS[0];

  // Calculate actual user metrics from progress context
  const masteredCount = getMasteredCount ? getMasteredCount() : 0;
  
  // Check company-tagged topics mastered
  const companyTopics = allTopics.filter((t) =>
    t.companyTags?.some(
      (c) =>
        c.toLowerCase() === selectedCompany.id.toLowerCase() ||
        c.toLowerCase() === selectedCompany.name.toLowerCase()
    )
  );
  const companyMastered = companyTopics.filter(
    (t) => progress?.statuses?.[t.id] === 'mastered'
  ).length;

  // Use company-specific mastered topics if user solved company problems, otherwise total mastered count
  const solvedCount = companyMastered > 0 ? companyMastered : masteredCount;
  const starredNotesCount = Object.keys(progress?.notes || {}).length || 0;
  const accuracyRate = 85; // Simulated baseline accuracy

  const readiness = calculateCompanyReadiness(
    selectedCompany.totalQuestions,
    solvedCount,
    accuracyRate
  );

  // Format Notes for PDF
  const pdfNotes: PdfNoteItem[] = Object.entries(progress?.notes || {}).map(([topicId, noteText]) => ({
    id: topicId,
    title: topicId.replace(/-/g, ' ').toUpperCase(),
    category: 'Personal Practice Note',
    content: noteText as string,
  }));

  if (pdfNotes.length === 0) {
    pdfNotes.push({
      id: 'default-note',
      title: 'Operating System Memory Management & Page Invalidation',
      category: 'Operating Systems',
      content: 'Page fault happens when referenced page is not in main memory MMU. Linux uses LRU clock page replacement algorithm.',
    });
  }

  const weakConceptsList = [
    'Graph Shortest Path Dijkstra & Bellman-Ford Edge Relaxation',
    'Dynamic Programming 2D Grid Knapsack & State Transitions',
    'System Design Distributed Caching & Cache Invalidation Strategies',
    'PostgreSQL Indexing & B-Tree vs Hash Index Performance'
  ];

  const handleDownloadPdf = async () => {
    try {
      setGeneratingPdf(true);
      const [{ pdf }, { RevisionPdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./RevisionPdfDocument'),
      ]);

      const doc = React.createElement(RevisionPdfDocument, {
        candidateName: 'DevForge Candidate',
        targetCompany: selectedCompany.name,
        readinessScore: readiness.score,
        readinessStatus: readiness.statusLabel,
        notes: includeNotes ? pdfNotes : [],
        dsaTricks: includeTricks ? DEFAULT_DSA_TRICKS : [],
        weakConcepts: includeWeakConcepts ? weakConceptsList : [],
      });

      const blob = await pdf(doc as any).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DevForge_${selectedCompany.name}_CheatSheet.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to compile PDF:', err);
      alert('Could not compile PDF cheat sheet. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="card-surface p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              PDF Cheat Sheet & Company Readiness Predictor
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                FAANG Target Engine
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Calculate your readiness score per company and generate a custom printable PDF cheat sheet for last-minute revision.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs">
          <Target className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-600 font-medium">Readiness Benchmark</span>
        </div>
      </div>

      {/* Main Grid: Readiness Predictor (Left) & PDF Exporter (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Target Company Readiness Predictor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-surface rounded-3xl p-6 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Target Company Selection
              </h2>
              <span className="text-xs text-slate-500 font-mono">Select target company</span>
            </div>

            {/* Company Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COMPANY_BENCHMARKS.map((company) => {
                const isSelected = company.id === selectedCompanyId;
                return (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompanyId(company.id)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500/50 shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{company.name}</span>
                      <Building2 className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded w-fit ${company.badgeColor}`}>
                      Target: {company.totalQuestions} Qs
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Company Readiness Gauge Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {selectedCompany.name} Interview Readiness
                  </span>
                  <div className={`text-2xl font-black ${readiness.statusColor} flex items-center gap-2`}>
                    {readiness.statusLabel}
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm">
                    {selectedCompany.description}
                  </p>
                </div>

                {/* Score Gauge Circle */}
                <div className="relative w-28 h-28 flex items-center justify-center bg-white rounded-full border-4 border-slate-200 shadow-sm">
                  <div className="text-center">
                    <span className="text-2xl font-black text-slate-900 font-mono">{readiness.score}%</span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">Readiness</span>
                  </div>
                </div>
              </div>

              {/* Progress Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Target Coverage:</span>
                    <strong className="text-slate-600">{solvedCount} / {selectedCompany.totalQuestions} Qs</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                      style={{ width: `${readiness.coveragePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Benchmark Passing Score:</span>
                    <strong className="text-amber-600">{selectedCompany.passingThreshold}% Target</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                      style={{ width: `${selectedCompany.passingThreshold}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actionable Tips */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Targeted Recommendations for {selectedCompany.name}:
                </h4>
                <ul className="space-y-1.5">
                  {readiness.actionableTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: PDF Cheat Sheet Generator & Downloader */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600" />
                PDF Exporter Settings
              </h2>
            </div>

            {/* Customization Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Include Starred Personal Notes</div>
                  <div className="text-[10px] text-slate-400">Export {starredNotesCount} user notes & summaries</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={includeTricks}
                  onChange={(e) => setIncludeTricks(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Include Essential DSA Pattern Formulas</div>
                  <div className="text-[10px] text-slate-400">Export top 5 key algorithmic takeaways</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={includeWeakConcepts}
                  onChange={(e) => setIncludeWeakConcepts(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Include Priority Weak Concepts Checklist</div>
                  <div className="text-[10px] text-slate-400">Export key revision checklist for last minute</div>
                </div>
              </label>
            </div>

            {/* Document Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Cheat Sheet Output Preview</span>
                <span className="text-[10px] font-mono text-emerald-600">Ready for Download</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono space-y-1">
                <div>• Target Company: <strong className="text-slate-600">{selectedCompany.name}</strong></div>
                <div>• Notes Included: <strong className="text-slate-600">{includeNotes ? pdfNotes.length : 0} items</strong></div>
                <div>• DSA Formulas: <strong className="text-slate-600">{includeTricks ? DEFAULT_DSA_TRICKS.length : 0} items</strong></div>
                <div>• Revision Checklists: <strong className="text-slate-600">{includeWeakConcepts ? weakConceptsList.length : 0} items</strong></div>
              </div>
            </div>

            {/* On-Demand Download Button using dynamic @react-pdf/renderer */}
            <button
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-slate-900 text-xs font-bold px-4 py-4 rounded-2xl transition shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{generatingPdf ? 'Compiling Vector PDF Engine...' : `Download ${selectedCompany.name} PDF Cheat Sheet`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
