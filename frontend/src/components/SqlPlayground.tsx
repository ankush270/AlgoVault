import React, { useState, useEffect, useMemo } from 'react';
import alasql from 'alasql';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Database, 
  Table, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter,
  BookOpen,
  Code2,
  Eye,
  EyeOff,
  ChevronRight,
  Layers,
  Building,
  HelpCircle,
  Zap,
  Check,
  ExternalLink,
  BookMarked,
  ListFilter,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { SqlSchemaERDChart } from './common/SqlSchemaERDChart';
import { SqlQueryPlanFlow } from './common/SqlQueryPlanFlow';

export interface InputTable {
  table_name: string;
  columns: string[];
  rows: Record<string, any>[];
}

export interface SqlProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  url: string;
  tags: string[];
  company?: string;
  concept?: string;
  question: string;
  schema: string;
  sample_input: string;
  sample_output: string;
  sql_solution: string;
  explanation: string;
  input_tables?: InputTable[];
}

export interface SqlTopic {
  topic_name: string;
  problems: SqlProblem[];
}

export interface SqlStep {
  step_id: number;
  step_title: string;
  topics: SqlTopic[];
}

export interface SqlMasterSheetData {
  sheet: string;
  total_problems: number;
  stats: {
    datalemur_problems: number;
    leetcode_sql50_problems: number;
    hackerrank_sql50_problems: number;
    stratascratch_problems: number;
    sqlbolt_lessons: number;
  };
  platforms: string[];
  steps: SqlStep[];
}

export const SqlPlayground: React.FC = () => {
  const [sheetData, setSheetData] = useState<SqlMasterSheetData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Selected Problem
  const [selectedProblem, setSelectedProblem] = useState<SqlProblem | null>(null);
  
  // Query Editor State
  const [query, setQuery] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);

  // Filters State
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Schema Explorer Active Table State
  const [activeSchemaTab, setActiveSchemaTab] = useState<string>('employees');

  const [sqlInitScript, setSqlInitScript] = useState<string>('');

  useEffect(() => {
    fetch('/data/sql/sql_playground_tables.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.sql_init_script) {
          setSqlInitScript(data.sql_init_script);
          try {
            alasql(data.sql_init_script);
          } catch (e) {
            console.error('Failed to init alaSQL tables from JSON:', e);
          }
        }
      })
      .catch((err) => console.error('Error fetching sql_playground_tables.json:', err));
  }, []);

  // Initialize AlaSQL Default General Database Schema & Seed Data
  const initDefaultTables = () => {
    try {
      if (sqlInitScript) {
        alasql(sqlInitScript);
      }
    } catch (e) {
      console.error('Failed to initialize AlaSQL default tables', e);
    }
  };

  // Seed question-specific input_tables into AlaSQL dynamically
  const seedProblemTables = (prob: SqlProblem) => {
    initDefaultTables();
    if (!prob.input_tables || prob.input_tables.length === 0) return;

    try {
      prob.input_tables.forEach((tbl) => {
        try { alasql(`DROP TABLE IF EXISTS ${tbl.table_name};`); } catch (e) {}

        const colDefs = tbl.columns.map((c) => {
          if (c.includes('DATETIME') || c.includes('DATE')) {
            return c.replace('DATETIME', 'STRING').replace('DATE', 'STRING');
          }
          return c;
        }).join(', ');

        alasql(`CREATE TABLE IF NOT EXISTS ${tbl.table_name} (${colDefs});`);

        if (tbl.rows && tbl.rows.length > 0) {
          tbl.rows.forEach((r) => {
            const keys = Object.keys(r);
            const vals = keys.map((k) => {
              const v = r[k];
              if (v === null || v === undefined) return 'NULL';
              if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
              return v;
            }).join(', ');
            alasql(`INSERT INTO ${tbl.table_name} (${keys.join(', ')}) VALUES (${vals});`);
          });
        }
      });

      if (prob.input_tables.length > 0) {
        setActiveSchemaTab(prob.input_tables[0].table_name);
      }
    } catch (err) {
      console.error('Error seeding problem tables in AlaSQL:', err);
    }
  };

  // Load SQL Master Sheet JSON on Mount
  useEffect(() => {
    fetch('/data/sql/sql_master_sheet.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data: SqlMasterSheetData) => {
        setSheetData(data);
        setIsLoading(false);
        
        // Default select first problem
        if (data.steps && data.steps.length > 0 && data.steps[0].topics.length > 0 && data.steps[0].topics[0].problems.length > 0) {
          const firstProb = data.steps[0].topics[0].problems[0];
          setSelectedProblem(firstProb);
          seedProblemTables(firstProb);
          setQuery(firstProb.sql_solution || 'SELECT * FROM employees;');
          handleRunQuery(firstProb.sql_solution || 'SELECT * FROM employees;');
        }
      })
      .catch((err) => {
        console.error('Error loading SQL Master Sheet:', err);
        setIsLoading(false);
      });
  }, []);

  const handleRunQuery = (sqlToRun: string) => {
    setErrorMessage(null);
    const start = performance.now();
    try {
      const res = alasql(sqlToRun);
      const end = performance.now();
      setExecutionTime(parseFloat((end - start).toFixed(2)));

      if (Array.isArray(res)) {
        setQueryResults(res);
      } else {
        setQueryResults([{ result: res }]);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'SQL Execution Error');
      setQueryResults(null);
    }
  };

  const handleSelectProblem = (prob: SqlProblem) => {
    setSelectedProblem(prob);
    setShowSolution(false);
    seedProblemTables(prob);
    const initialSql = prob.sql_solution || `SELECT * FROM ${prob.input_tables && prob.input_tables.length > 0 ? prob.input_tables[0].table_name : 'employees'};`;
    setQuery(initialSql);
    handleRunQuery(initialSql);
  };

  // Filter problems based on search query, platform, and difficulty
  const filteredProblemsList = useMemo(() => {
    if (!sheetData) return [];
    const list: SqlProblem[] = [];

    sheetData.steps.forEach((step) => {
      step.topics.forEach((topic) => {
        topic.problems.forEach((prob) => {
          if (selectedPlatform !== 'all') {
            if (selectedPlatform === 'datalemur' && !prob.id.startsWith('dl-')) return;
            if (selectedPlatform === 'leetcode' && !prob.id.startsWith('lc-')) return;
            if (selectedPlatform === 'hackerrank' && !prob.id.startsWith('hr-')) return;
            if (selectedPlatform === 'stratascratch' && !prob.id.startsWith('ss-')) return;
            if (selectedPlatform === 'sqlbolt' && !prob.id.startsWith('sb-')) return;
          }

          if (selectedDifficulty !== 'all' && prob.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
            return;
          }

          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = prob.title.toLowerCase().includes(q);
            const matchQuestion = prob.question.toLowerCase().includes(q);
            const matchCompany = (prob.company || '').toLowerCase().includes(q);
            const matchConcept = (prob.concept || '').toLowerCase().includes(q);
            const matchTag = prob.tags.some((t) => t.toLowerCase().includes(q));

            if (!matchTitle && !matchQuestion && !matchCompany && !matchConcept && !matchTag) {
              return;
            }
          }

          list.push(prob);
        });
      });
    });

    return list;
  }, [sheetData, selectedPlatform, selectedDifficulty, searchQuery]);

  // Compute active table metadata & preview rows from AlaSQL or selectedProblem.input_tables
  const activeTableInfo: InputTable | null = useMemo(() => {
    if (selectedProblem && selectedProblem.input_tables) {
      const found = selectedProblem.input_tables.find((t) => t.table_name === activeSchemaTab);
      if (found) return found;
    }

    // Fallback: Query AlaSQL directly for active schema tab
    try {
      const rows: Record<string, any>[] = alasql(`SELECT * FROM ${activeSchemaTab};`);
      if (Array.isArray(rows) && rows.length > 0) {
        const cols = Object.keys(rows[0]).map((k) => `${k} STRING`);
        return {
          table_name: activeSchemaTab,
          columns: cols,
          rows: rows
        };
      }
    } catch (e) {}

    return null;
  }, [selectedProblem, activeSchemaTab]);

  const handleCopySolution = () => {
    if (!selectedProblem) return;
    navigator.clipboard.writeText(selectedProblem.sql_solution);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-['Inter',sans-serif]">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0E172A] via-[#111C33] to-[#0A1120] border border-cyan-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-700 border border-cyan-200 flex items-center gap-1.5">
              <Sparkles size={12} className="text-cyan-600" /> AlaSQL Live Sandbox
            </span>
            <span className="text-xs text-slate-400 font-mono font-semibold">
              193 Questions with Exact Sample Tables & Data
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>⚡ Interactive SQL Practice Sandbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Select SQL interview problems, view exact dummy table schemas & rows, write custom queries, execute them in real-time, and check step-by-step solutions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => handleRunQuery(query)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-cyan-200 scale-[1.02] active:scale-95"
          >
            <Play size={16} className="fill-white" />
            <span>Execute Query</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Problem Selector + Playground Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Questions Explorer (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookMarked size={16} className="text-cyan-600" />
                <span>SQL Questions ({filteredProblemsList.length})</span>
              </h3>
              {sheetData && (
                <span className="text-[10px] font-mono text-cyan-600 font-bold px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200">
                  Total {sheetData.total_problems}
                </span>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, company, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Platform Selector Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Source:</label>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: '🌐 All' },
                  { id: 'datalemur', label: 'DataLemur (50)' },
                  { id: 'leetcode', label: 'LeetCode 50' },
                  { id: 'hackerrank', label: 'HackerRank (50)' },
                  { id: 'stratascratch', label: 'StrataScratch' },
                  { id: 'sqlbolt', label: 'SQLBolt' }
                ].map((plt) => (
                  <button
                    key={plt.id}
                    onClick={() => setSelectedPlatform(plt.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      selectedPlatform === plt.id
                        ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-500/40 font-extrabold'
                        : 'bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200'
                    }`}
                  >
                    {plt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty:</span>
              {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-slate-100 text-cyan-700 border border-cyan-200'
                      : 'text-slate-500 hover:text-slate-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Scroll List */}
          <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <span>Loading SQL Questions...</span>
              </div>
            ) : filteredProblemsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                No SQL questions found matching your filter criteria.
              </div>
            ) : (
              filteredProblemsList.map((prob) => {
                const isSelected = selectedProblem?.id === prob.id;
                
                let platBadge = 'LeetCode';
                let platColor = 'bg-amber-50 text-amber-600 border-amber-200';
                if (prob.id.startsWith('dl-')) {
                  platBadge = 'DataLemur';
                  platColor = 'bg-cyan-50 text-cyan-600 border-cyan-200';
                } else if (prob.id.startsWith('hr-')) {
                  platBadge = 'HackerRank';
                  platColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';
                } else if (prob.id.startsWith('ss-')) {
                  platBadge = 'StrataScratch';
                  platColor = 'bg-purple-50 text-purple-600 border-purple-200';
                } else if (prob.id.startsWith('sb-')) {
                  platBadge = 'SQLBolt';
                  platColor = 'bg-blue-50 text-blue-600 border-blue-200';
                }

                let diffColor = 'text-emerald-600';
                if (prob.difficulty === 'Medium') diffColor = 'text-amber-600';
                if (prob.difficulty === 'Hard') diffColor = 'text-rose-600';

                return (
                  <div
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#111C33] to-[#0D1527] border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                        : 'bg-white/80 hover:bg-slate-50 border-slate-200 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs font-bold transition-colors line-clamp-1 ${isSelected ? 'text-cyan-700 font-extrabold' : 'text-slate-600'}`}>
                        {prob.title}
                      </h4>
                      <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${diffColor} bg-slate-50/80 border-slate-200 shrink-0`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md font-extrabold border ${platColor}`}>
                        {platBadge}
                      </span>
                      {prob.company && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 font-medium border border-slate-200 flex items-center gap-1">
                          <Building size={10} className="text-cyan-600" />
                          {prob.company}
                        </span>
                      )}
                      {prob.tags && prob.tags.slice(0, 1).map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white text-slate-400 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Problem Details + Query Editor + Live Execution (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedProblem ? (
            <div className="space-y-5">
              
              {/* Question Statement & Meta Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-black uppercase text-cyan-600 px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200">
                        {selectedProblem.id}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {selectedProblem.company ? `${selectedProblem.company} Interview Question` : 'SQL Practice Challenge'}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                      <span>{selectedProblem.title}</span>
                    </h2>
                  </div>

                  <a
                    href={selectedProblem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-cyan-600 hover:text-cyan-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all shrink-0"
                  >
                    <span>Practice on Platform</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Question Text */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-cyan-600" />
                    <span>Problem Statement:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                    {selectedProblem.question}
                  </p>
                </div>

                {/* Schema & Expected Output Preview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 flex items-center gap-1.5">
                      <Table size={12} /> Target Schema Overview
                    </span>
                    <pre className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {selectedProblem.schema}
                    </pre>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> Expected Output Result
                    </span>
                    <pre className="text-[11px] font-mono text-emerald-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {selectedProblem.sample_output}
                    </pre>
                  </div>
                </div>

                {/* Solution Toggle & Explanation Bar */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSolution((prev) => !prev)}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-500 flex items-center gap-1.5 border border-slate-200 transition-all"
                    >
                      {showSolution ? <EyeOff size={14} className="text-amber-600" /> : <Eye size={14} className="text-cyan-600" />}
                      <span>{showSolution ? 'Hide Solution & Explanation' : 'Show Solution & Explanation'}</span>
                    </button>

                    <button
                      onClick={() => setQuery(selectedProblem.sql_solution)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-500/20 text-cyan-700 text-xs font-bold flex items-center gap-1.5 border border-cyan-200 transition-all"
                    >
                      <Code2 size={14} />
                      <span>Load Solution to Editor</span>
                    </button>
                  </div>

                  {showSolution && (
                    <button
                      onClick={handleCopySolution}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-500 flex items-center gap-1.5 border border-slate-200 transition-all"
                    >
                      {copiedSolution ? <Check size={14} className="text-emerald-600" /> : <Code2 size={14} className="text-slate-400" />}
                      <span>{copiedSolution ? 'Copied!' : 'Copy Solution SQL'}</span>
                    </button>
                  )}
                </div>

                {/* Revealed Solution Box */}
                {showSolution && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-cyan-200 space-y-3 animate-fadeIn">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 flex items-center gap-1.5">
                        <Code2 size={14} /> Optimal SQL Solution
                      </span>
                      <pre className="text-xs font-mono text-cyan-200 bg-slate-50 p-3 rounded-xl border border-slate-200 overflow-x-auto leading-relaxed">
                        {selectedProblem.sql_solution}
                      </pre>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Zap size={14} className="text-amber-600" /> Step-by-Step Explanation
                      </span>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                        {selectedProblem.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SQL Query Editor & Execution Output Panel */}
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Terminal size={16} className="text-cyan-600" />
                      <span>SQL Query Editor (AlaSQL Sandbox)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuery('')}
                        className="text-[11px] text-slate-400 hover:text-slate-900 font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200"
                      >
                        Clear Editor
                      </button>
                      <button
                        onClick={() => handleRunQuery(query)}
                        className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-200"
                      >
                        <Play size={14} className="fill-white" />
                        <span>Run SQL Query</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-44 bg-slate-50 p-4 text-xs sm:text-sm font-mono text-cyan-700 focus:outline-none resize-none leading-relaxed rounded-2xl border border-slate-200 focus:border-cyan-500/50 shadow-sm"
                    placeholder="Type your SQL query here (e.g. SELECT * FROM pages LEFT JOIN page_likes...)..."
                  />
                </div>

                {/* Execution Results */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 min-h-[200px] shadow-md">
                  <div className="flex items-center justify-between text-xs font-black text-slate-500 pb-2.5 border-b border-slate-200">
                    <span className="flex items-center gap-2">
                      <Database size={16} className="text-cyan-600" />
                      <span>Execution Output Grid</span>
                      {queryResults && (
                        <span className="text-[10px] font-mono text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 font-bold">
                          {queryResults.length} {queryResults.length === 1 ? 'row' : 'rows'}
                        </span>
                      )}
                    </span>
                    {executionTime !== null && (
                      <span className="text-slate-400 text-[11px] font-mono font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        ⚡ {executionTime} ms
                      </span>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 font-mono leading-relaxed">
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                      <div>
                        <span className="font-bold text-rose-600 block mb-1">SQL Syntax / Execution Error:</span>
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {queryResults && queryResults.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[300px]">
                      <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b border-slate-200 sticky top-0">
                          <tr>
                            {Object.keys(queryResults[0]).map((key) => (
                              <th key={key} className="px-4 py-3 tracking-wider">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                          {queryResults.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-100/40 transition-colors">
                              {Object.values(row).map((val: any, cIdx) => (
                                <td key={cIdx} className="px-4 py-2.5 text-cyan-700">
                                  {val !== null && val !== undefined ? String(val) : <span className="text-slate-600 italic">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : !errorMessage && (
                    <div className="p-6 text-center text-xs text-slate-500 font-mono bg-slate-50/50 rounded-2xl border border-slate-100">
                      No rows returned or empty query result.
                    </div>
                  )}
                </div>

                {/* Advanced Schema & Dummy Sample Rows Explorer (NEW IMPROVED LAYOUT) */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black uppercase text-cyan-600 px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200">
                          Question Schema Explorer
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 mt-1">
                        <Table size={16} className="text-cyan-600" />
                        <span>Interactive Dummy Sample Tables & Columns</span>
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        const sql = `SELECT * FROM ${activeSchemaTab};`;
                        setQuery(sql);
                        handleRunQuery(sql);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-cyan-600 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-all shrink-0"
                    >
                      <ArrowRight size={14} />
                      <span>Query Table '{activeSchemaTab}'</span>
                    </button>
                  </div>

                  {/* Interactive Table Selection Tabs */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Table to Preview:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProblem.input_tables && selectedProblem.input_tables.length > 0 ? (
                        selectedProblem.input_tables.map((tbl) => (
                          <button
                            key={tbl.table_name}
                            onClick={() => setActiveSchemaTab(tbl.table_name)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                              activeSchemaTab === tbl.table_name
                                ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                                : 'bg-slate-50/80 text-slate-400 hover:text-slate-600 border border-slate-200'
                            }`}
                          >
                            <Table size={14} className={activeSchemaTab === tbl.table_name ? 'text-cyan-600' : 'text-slate-500'} />
                            <span>{tbl.table_name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white text-[10px] font-sans border border-slate-200 text-slate-400 font-semibold">
                              {tbl.rows.length} rows
                            </span>
                          </button>
                        ))
                      ) : (
                        ['employees', 'departments', 'orders', 'pages', 'page_likes', 'parts_assembly', 'viewership', 'Products', 'Customer', 'World', 'CITY', 'Movies'].map((tbl) => (
                          <button
                            key={tbl}
                            onClick={() => setActiveSchemaTab(tbl)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                              activeSchemaTab === tbl
                                ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-500/50'
                                : 'bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200'
                            }`}
                          >
                            {tbl}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Active Table Details: Column Definitions + Dummy Sample Rows Table */}
                  {activeTableInfo ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
                      
                      {/* Column Types List (4 Cols) */}
                      <div className="lg:col-span-4 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-[11px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                            <Layers size={13} className="text-cyan-600" />
                            <span>Columns & Types</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{activeTableInfo.columns.length} cols</span>
                        </div>

                        <div className="space-y-1.5 font-mono text-[11px] max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                          {activeTableInfo.columns.map((col, idx) => {
                            const parts = col.split(' ');
                            const colName = parts[0];
                            const colType = parts.slice(1).join(' ');

                            return (
                              <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                                <span className="text-cyan-700 font-bold truncate">{colName}</span>
                                <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 shrink-0">
                                  {colType}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sample Rows Data Preview Table (8 Cols) */}
                      <div className="lg:col-span-8 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-[11px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                            <Database size={13} className="text-emerald-600" />
                            <span>Sample Input Data ({activeTableInfo.rows.length} rows)</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-500/20">
                            Dummy Data Table
                          </span>
                        </div>

                        {activeTableInfo.rows.length > 0 ? (
                          <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[180px]">
                            <table className="w-full text-left text-xs text-slate-600">
                              <thead className="bg-white text-slate-400 uppercase text-[10px] font-black border-b border-slate-200 sticky top-0">
                                <tr>
                                  {Object.keys(activeTableInfo.rows[0]).map((key) => (
                                    <th key={key} className="px-3 py-2 font-mono">{key}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                                {activeTableInfo.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-100/40 transition-colors">
                                    {Object.values(row).map((val: any, cIdx) => (
                                      <td key={cIdx} className="px-3 py-2 text-cyan-700">
                                        {val !== null && val !== undefined ? String(val) : <span className="text-slate-600 italic">NULL</span>}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-xs text-slate-500 font-mono">
                            No rows available for table '{activeSchemaTab}'.
                          </div>
                        )}
                      </div>

                    </div>
                  ) : null}

                </div>

              </div>

              {/* Visual Schema ERD & Execution Flow Charts */}
              <div className="space-y-6 pt-4">
                <SqlSchemaERDChart />
                <SqlQueryPlanFlow />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              Select a question from the left sidebar to start practicing.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
