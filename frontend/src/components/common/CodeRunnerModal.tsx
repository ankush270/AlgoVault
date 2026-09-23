import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  X,
  Play,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  Code2,
  Copy,
  Check,
  Zap,
  Terminal,
  Brain,
  Sliders,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { executeCode, languageMap, ExecutionResult } from '../../services/codeExecutionService';
import { analyzeCodeWithAI, CodeReviewResult } from '../../services/aiReviewService';

interface CodeRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemTitle?: string;
  problemDescription?: string;
  initialCode?: string;
  initialLanguage?: string;
}

export const CodeRunnerModal: React.FC<CodeRunnerModalProps> = ({
  isOpen,
  onClose,
  problemTitle = 'Code Sandbox',
  problemDescription = 'Write and test your solution below.',
  initialCode,
  initialLanguage = 'python',
}) => {
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [code, setCode] = useState<string>('');
  const [stdin, setStdin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'output' | 'stdin' | 'ai'>('output');
  
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);

  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState<CodeReviewResult | null>(null);

  const [copiedOptimal, setCopiedOptimal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const selectedLang = languageMap[language] ? language : 'python';
      const defaultCode = initialCode || languageMap[selectedLang]?.defaultBoilerplate || '';
      setCode(defaultCode);
      setExecResult(null);
      setAiResult(null);
      setActiveTab('output');
    }
  }, [isOpen, initialCode, initialLanguage]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (!initialCode || code === languageMap[language]?.defaultBoilerplate) {
      setCode(languageMap[newLang]?.defaultBoilerplate || '');
    }
  };

  const handleRun = async () => {
    setExecuting(true);
    setActiveTab('output');
    try {
      const result = await executeCode(language, code, stdin);
      setExecResult(result);
    } catch (err: any) {
      setExecResult({
        output: '',
        stderr: err?.message || 'Execution error',
        executionTime: 0,
        memory: 0,
        status: 'ERROR'
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleAIAnalysis = async () => {
    setAnalyzingAI(true);
    setActiveTab('ai');
    try {
      const result = await analyzeCodeWithAI(code, language, problemTitle, problemDescription);
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleCopyOptimal = () => {
    if (aiResult?.optimalSnippet) {
      navigator.clipboard.writeText(aiResult.optimalSnippet);
      setCopiedOptimal(true);
      setTimeout(() => setCopiedOptimal(false), 2000);
    }
  };

  const handleApplyOptimal = () => {
    if (aiResult?.optimalSnippet) {
      setCode(aiResult.optimalSnippet);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 md:p-6 animate-fadeIn">
      <div className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/70 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {problemTitle}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                {problemDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="python">Python 3 (3.10)</option>
              <option value="cpp">C++ (17 / GCC 10.2)</option>
              <option value="java">Java (15.0)</option>
              <option value="javascript">JavaScript (Node 18)</option>
            </select>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={executing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
            >
              {executing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{executing ? 'Executing...' : 'Run Code'}</span>
            </button>

            {/* AI Complexity Review Button */}
            <button
              onClick={handleAIAnalysis}
              disabled={analyzingAI}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
            >
              {analyzingAI ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{analyzingAI ? 'Analyzing...' : 'AI Complexity Review'}</span>
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              title={isMaximized ? 'Restore Size' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Monaco Code Editor Area */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950">
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                solution.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'js'}
              </span>
              <span className="text-[11px] text-slate-500">Auto-saved to local workspace</span>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <Editor
                height="100%"
                language={language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : language === 'java' ? 'java' : 'javascript'}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  padding: { top: 12, bottom: 12 },
                  fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                }}
              />
            </div>
          </div>

          {/* Console Output & AI Review Side Panel */}
          <div className="lg:col-span-5 flex flex-col bg-slate-900/50">
            {/* Panel Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900 px-4">
              <button
                onClick={() => setActiveTab('output')}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'output'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Execution Output
                {execResult && (
                  <span className={`w-2 h-2 rounded-full ${execResult.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                )}
              </button>

              <button
                onClick={() => setActiveTab('stdin')}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'stdin'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Custom Input (STDIN)
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'ai'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                AI Analysis
                {aiResult && <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {/* Output Tab */}
              {activeTab === 'output' && (
                <div className="space-y-4">
                  {!execResult && !executing && (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 font-sans text-center">
                      <Terminal className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm font-medium">No execution output yet.</p>
                      <p className="text-xs text-slate-600 mt-1">Click "Run Code" to execute your solution in the cloud container.</p>
                    </div>
                  )}

                  {executing && (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-sans">
                      <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
                      <p className="text-xs font-semibold">Running code in Piston Sandbox...</p>
                    </div>
                  )}

                  {execResult && !executing && (
                    <div className="space-y-3">
                      {/* Status Banner */}
                      <div className={`p-3 rounded-xl border flex items-center justify-between font-sans ${
                        execResult.status === 'SUCCESS'
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400'
                          : 'bg-rose-950/30 border-rose-800/50 text-rose-400'
                      }`}>
                        <div className="flex items-center gap-2">
                          {execResult.status === 'SUCCESS' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <span className="font-bold text-xs uppercase tracking-wider">{execResult.status}</span>
                        </div>
                        {execResult.executionTime > 0 && (
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {execResult.executionTime} ms
                            </span>
                            {execResult.memory > 0 && (
                              <span className="flex items-center gap-1">
                                <Cpu className="w-3.5 h-3.5" />
                                {(execResult.memory / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Standard Output */}
                      {execResult.output && (
                        <div>
                          <div className="text-[11px] font-sans font-semibold text-slate-400 mb-1">Standard Output (stdout):</div>
                          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                            {execResult.output}
                          </pre>
                        </div>
                      )}

                      {/* Standard Error */}
                      {execResult.stderr && (
                        <div>
                          <div className="text-[11px] font-sans font-semibold text-rose-400 mb-1">Standard Error (stderr):</div>
                          <pre className="p-3 bg-slate-950 border border-rose-900/40 rounded-xl text-rose-300 overflow-x-auto whitespace-pre-wrap">
                            {execResult.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STDIN Tab */}
              {activeTab === 'stdin' && (
                <div className="space-y-3 font-sans">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Standard Input (STDIN)</span>
                    <span className="text-[11px] text-slate-500">Passed directly to stdin during execution</span>
                  </div>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter test inputs here (e.g. 5&#10;1 2 3 4 5)..."
                    className="w-full h-64 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>
              )}

              {/* AI Analysis Tab */}
              {activeTab === 'ai' && (
                <div className="space-y-4 font-sans">
                  {!aiResult && !analyzingAI && (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center">
                      <Sparkles className="w-10 h-10 mb-3 text-purple-400/40" />
                      <p className="text-sm font-medium text-slate-300">No AI analysis generated yet.</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">
                        Click "AI Complexity Review" in the top bar to inspect time & space complexity, code quality score, and edge-case suggestions.
                      </p>
                    </div>
                  )}

                  {analyzingAI && (
                    <div className="h-64 flex flex-col items-center justify-center text-purple-400">
                      <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mb-3" />
                      <p className="text-xs font-semibold text-slate-300">AlgoVault AI is evaluating your solution...</p>
                    </div>
                  )}

                  {aiResult && !analyzingAI && (
                    <div className="space-y-4">
                      {/* Metric Badges */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <div className="text-[10px] uppercase font-bold text-slate-500">Time Complexity</div>
                          <div className="text-sm font-extrabold text-indigo-400 mt-0.5">{aiResult.timeComplexity}</div>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <div className="text-[10px] uppercase font-bold text-slate-500">Space Complexity</div>
                          <div className="text-sm font-extrabold text-purple-400 mt-0.5">{aiResult.spaceComplexity}</div>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <div className="text-[10px] uppercase font-bold text-slate-500">Quality Score</div>
                          <div className="text-sm font-extrabold text-emerald-400 mt-0.5">{aiResult.codeQualityScore} / 100</div>
                        </div>
                      </div>

                      {/* Optimality Indicator */}
                      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                        aiResult.isOptimal
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                          : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                      }`}>
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4 fill-current" />
                          {aiResult.isOptimal ? 'Optimal Time & Space Solution' : 'Sub-Optimal Solution (Can be improved)'}
                        </span>
                      </div>

                      {/* AI Suggestions */}
                      <div>
                        <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-purple-400" />
                          Optimization Suggestions & Edge Cases:
                        </div>
                        <ul className="space-y-2">
                          {aiResult.suggestions.map((item, idx) => (
                            <li key={idx} className="p-2.5 bg-slate-950/80 border border-slate-800/60 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Optimal Snippet */}
                      {aiResult.optimalSnippet && (
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                            <span>Recommended Optimal Solution:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleApplyOptimal}
                                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 transition cursor-pointer"
                              >
                                Apply to Editor
                              </button>
                              <button
                                onClick={handleCopyOptimal}
                                className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 border border-slate-700 transition cursor-pointer flex items-center gap-1"
                              >
                                {copiedOptimal ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                {copiedOptimal ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-48">
                            {aiResult.optimalSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
