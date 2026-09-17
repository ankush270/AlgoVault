import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Star, 
  Code2, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  Zap, 
  Target, 
  BookOpen,
  X,
  Lightbulb,
  Workflow,
  Tag
} from 'lucide-react';
import { TrickItem, TrickProblem, CodeTemplateItem } from '../types';
import { parseTrickJsonText } from '../utils/tricksParser';

export const TricksExplorer: React.FC = () => {
  const [tricks, setTricks] = useState<TrickItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<number | 'All'>('All');
  const [activeTrick, setActiveTrick] = useState<TrickItem | null>(null);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<number>(0);

  // Fetch and parse public/data/dsa/trick.json directly
  useEffect(() => {
    fetch('/data/dsa/trick.json')
      .then(res => res.text())
      .then(text => {
        const parsed = parseTrickJsonText(text);
        setTricks(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading trick.json:', err);
        setLoading(false);
      });
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    tricks.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [tricks]);

  // Filtered tricks
  const filteredTricks = useMemo(() => {
    return tricks.filter(t => {
      // Category filter
      if (selectedCategory !== 'All' && t.category !== selectedCategory) {
        return false;
      }
      // Rating filter
      if (selectedRating !== 'All' && t.rating !== selectedRating) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchCat = t.category.toLowerCase().includes(q);
        const matchTag = t.tags.some(tag => tag.toLowerCase().includes(q));
        const matchWhen = t.whenToUse.items.some(item => item.toLowerCase().includes(q));
        const matchMust = (t.mustMaster || []).some(m => m.toLowerCase().includes(q));
        return matchTitle || matchCat || matchTag || matchWhen || matchMust;
      }
      return true;
    });
  }, [tricks, selectedCategory, selectedRating, searchQuery]);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium text-sm animate-pulse">Loading 48 Master DSA Tricks & Patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>48 Master Patterns & Tricks</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              DSA Pattern Recognition Vault
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Instant interview wording clues, decision flowcharts, C++ code templates, and standard practice problems to solve any coding question faster.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center min-w-[100px]">
              <div className="text-xl font-bold text-amber-400">{tricks.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Tricks</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-center min-w-[100px]">
              <div className="text-xl font-bold text-purple-400">{categories.length - 1}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-4 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tricks by pattern name, keyword (e.g. 'subarray', 'frequency'), or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Rating:
            </span>
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
              {['All', 5, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRating(r as number | 'All')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    selectedRating === r
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'All' ? 'All' : `${r}★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Chips Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tricks Cards Grid */}
      {filteredTricks.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl space-y-3">
          <Target className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No DSA Tricks Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRating('All'); }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTricks.map((trick) => (
            <div
              key={trick.id}
              onClick={() => { setActiveTrick(trick); setActiveCodeTab(0); }}
              className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between cursor-pointer group border-slate-800/80 hover:border-amber-500/40"
            >
              <div className="space-y-3">
                {/* Category & Rating */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-[10px] font-semibold">
                    {trick.category}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                    <span>{trick.rating}</span>
                    <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>{trick.id}. {trick.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </h3>

                {/* Keywords Preview */}
                {trick.whenToUse.items.length > 0 && (
                  <div className="text-xs text-slate-300 line-clamp-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-amber-400 font-semibold mr-1">Clues:</span>
                    {trick.whenToUse.items.slice(0, 3).join(', ')}
                    {trick.whenToUse.items.length > 3 && '...'}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {trick.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                  {trick.tags.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
                      +{trick.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  {trick.codeTemplates.length > 0 ? `${trick.codeTemplates.length} Template` : 'Code Logic'}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  {trick.problems.length} Problems
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeTrick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel bg-[#0B0F19] border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/80">
              <div className="space-y-1.5 pr-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    {activeTrick.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <span>{activeTrick.rating} / 5</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                  <span>{activeTrick.id}. {activeTrick.title}</span>
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTrick.tags.map(t => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setActiveTrick(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Description if present */}
              {activeTrick.description && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs md:text-sm text-blue-200 leading-relaxed">
                  {activeTrick.description}
                </div>
              )}

              {/* 💡 When to Use Section */}
              {activeTrick.whenToUse.items.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>When to Use & Interview Wording Clues</span>
                  </h3>
                  {activeTrick.whenToUse.intro && (
                    <p className="text-xs text-slate-300 font-medium">{activeTrick.whenToUse.intro}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeTrick.whenToUse.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ⚡ Recognition Flowchart */}
              {activeTrick.recognitionFlow.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-purple-400" />
                    <span>Pattern Recognition Flowchart</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-2">
                    {activeTrick.recognitionFlow.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                          step.result
                            ? 'bg-purple-600/30 text-purple-200 border-purple-500/40 font-extrabold shadow-md shadow-purple-500/10'
                            : step.condition
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}>
                          {step.question && <span>❓ {step.question}</span>}
                          {step.condition && <span>🔍 {step.condition}</span>}
                          {step.action && <span>⚡ {step.action}</span>}
                          {step.result && <span>🎯 {step.result}</span>}
                          {!step.question && !step.condition && !step.action && !step.result && (
                            <span>⚡ {typeof step === 'string' ? step : JSON.stringify(step)}</span>
                          )}
                        </div>
                        {idx < activeTrick.recognitionFlow.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* 💻 Code Templates Section */}
              {activeTrick.codeTemplates.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>Code Template & Boilerplate</span>
                    </h3>

                    {/* Template Tab Selector if multiple */}
                    {activeTrick.codeTemplates.length > 1 && (
                      <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                        {activeTrick.codeTemplates.map((tmpl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveCodeTab(idx)}
                            className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-all ${
                              activeCodeTab === idx
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {tmpl.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {activeTrick.codeTemplates[activeCodeTab] && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070A11]">
                      {/* Code Header */}
                      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 font-mono uppercase">
                          {activeTrick.codeTemplates[activeCodeTab].language || 'C++'} — {activeTrick.codeTemplates[activeCodeTab].name}
                        </span>
                        <button
                          onClick={() => handleCopyCode(activeTrick.codeTemplates[activeCodeTab].code, activeCodeTab)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
                        >
                          {copiedCodeIndex === activeCodeTab ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Block */}
                      <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed bg-[#070A11] max-h-80">
                        <code>{activeTrick.codeTemplates[activeCodeTab].code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* 🎯 Must Master / Core Principles */}
              {activeTrick.mustMaster && activeTrick.mustMaster.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>Core Patterns & Key Takeaways</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeTrick.mustMaster.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🎯 Practice Problems List */}
              {activeTrick.problems.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Practice Problems ({activeTrick.problems.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeTrick.problems.map((p, idx) => {
                      const searchUrl = p.leetcode 
                        ? `https://leetcode.com/problemset/all/?search=${encodeURIComponent(p.problem)}`
                        : `https://www.geeksforgeeks.org/search/?gq=${encodeURIComponent(p.problem)}`;
                      
                      return (
                        <a
                          key={idx}
                          href={searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center border border-slate-700">
                              {p.number || idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                              {p.problem}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.leetcode && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {p.leetcode}
                              </span>
                            )}
                            {p.gfg && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                GFG
                              </span>
                            )}
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
