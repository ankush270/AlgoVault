import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Users,
  HardDrive,
  Activity,
  Zap,
  Database,
  Cpu,
  RefreshCcw,
  Server,
  ArrowUpRight,
  ArrowDownLeft,
  Info
} from 'lucide-react';
import {
  SystemRequirements,
  defaultRequirements,
  calculateSystemEstimates
} from '../../utils/estimationMath';

export const EstimationEnginePanel: React.FC = () => {
  const [reqs, setReqs] = useState<SystemRequirements>(defaultRequirements);

  const results = useMemo(() => calculateSystemEstimates(reqs), [reqs]);

  const handleReset = () => setReqs(defaultRequirements);

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-7 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-50 border border-cyan-500/20 text-cyan-600">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              Back-of-the-Envelope Capacity Estimator
            </h3>
            <p className="text-xs text-slate-400">
              Compute real-time QPS, Storage, Bandwidth, and Cache RAM for System Design interviews.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200 transition cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-600" />
            System Traffic & Storage Parameters
          </h4>

          {/* DAU */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-500">Daily Active Users (DAU):</span>
              <span className="font-mono font-bold text-cyan-600">{formatNumber(reqs.dailyActiveUsers)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000000"
              step="10000"
              value={reqs.dailyActiveUsers}
              onChange={(e) => setReqs({ ...reqs, dailyActiveUsers: Number(e.target.value) })}
              className="w-full accent-cyan-500 bg-slate-100 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10K</span>
              <span>50M</span>
              <span>500M</span>
            </div>
          </div>

          {/* Reads per User */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-500">Reads per User / Day:</span>
              <span className="font-mono font-bold text-emerald-600">{reqs.readsPerUserPerDay} reads</span>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              value={reqs.readsPerUserPerDay}
              onChange={(e) => setReqs({ ...reqs, readsPerUserPerDay: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-100 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Writes per User */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-500">Writes per User / Day:</span>
              <span className="font-mono font-bold text-amber-600">{reqs.writesPerUserPerDay} writes</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={reqs.writesPerUserPerDay}
              onChange={(e) => setReqs({ ...reqs, writesPerUserPerDay: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-100 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Payload Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-500">Average Payload Size:</span>
              <span className="font-mono font-bold text-purple-600">{formatNumber(reqs.payloadSizeBytes)} Bytes</span>
            </div>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={reqs.payloadSizeBytes}
              onChange={(e) => setReqs({ ...reqs, payloadSizeBytes: Number(e.target.value) })}
              className="w-full accent-purple-500 bg-slate-100 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50B (URL)</span>
              <span>500B (Tweet)</span>
              <span>10KB (Post)</span>
            </div>
          </div>

          {/* Peak Multiplier & Retention */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Peak Spike Multiplier</label>
              <select
                value={reqs.peakMultiplier}
                onChange={(e) => setReqs({ ...reqs, peakMultiplier: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
              >
                <option value={2}>2x (Normal Peak)</option>
                <option value={3}>3x (Heavy Traffic)</option>
                <option value={5}>5x (Viral Event)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Data Retention</label>
              <select
                value={reqs.retentionYears}
                onChange={(e) => setReqs({ ...reqs, retentionYears: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
              >
                <option value={1}>1 Year</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Computed Estimates */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Read QPS */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-900/40 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>Read QPS</span>
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl font-extrabold text-emerald-600 font-mono">
                {formatNumber(results.readQPS)} <span className="text-xs font-normal">req/s</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Peak: <strong className="text-emerald-700">{formatNumber(results.peakReadQPS)}</strong>
              </div>
            </div>

            {/* Write QPS */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-amber-900/40 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>Write QPS</span>
                <Zap className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xl font-extrabold text-amber-600 font-mono">
                {formatNumber(results.writeQPS)} <span className="text-xs font-normal">req/s</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Peak: <strong className="text-amber-700">{formatNumber(results.peakWriteQPS)}</strong>
              </div>
            </div>

            {/* Cache Memory */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-purple-900/40 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>Cache RAM (20%)</span>
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-xl font-extrabold text-purple-600 font-mono">
                {results.recommendedCacheRAMGB} <span className="text-xs font-normal">GB</span>
              </div>
              <div className="text-[10px] text-slate-500">Pareto 80/20 Rule</div>
            </div>
          </div>

          {/* Storage & Bandwidth Detail Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Storage Requirements */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-extrabold text-slate-500 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-600" />
                <span>Storage Requirements</span>
              </div>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Daily Storage:</span>
                  <strong className="text-slate-900">{results.dailyStorageGB} GB</strong>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Storage:</span>
                  <strong className="text-slate-900">{results.monthlyStorageGB} GB</strong>
                </div>
                <div className="flex justify-between">
                  <span>1-Year Storage:</span>
                  <strong className="text-cyan-700">{results.yearlyStorageTB} TB</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span>{reqs.retentionYears}-Year Total:</span>
                  <strong className="text-indigo-600 text-sm">{results.fiveYearStorageTB} TB</strong>
                </div>
              </div>
            </div>

            {/* Network Bandwidth */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-extrabold text-slate-500 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>Network Bandwidth</span>
              </div>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <ArrowDownLeft className="w-3 h-3 text-amber-600" /> Ingress:
                  </span>
                  <strong className="text-slate-900">{results.ingressBandwidthMbps} Mbps</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" /> Egress:
                  </span>
                  <strong className="text-slate-900">{results.egressBandwidthMbps} Mbps</strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span>Total Bandwidth:</span>
                  <strong className="text-emerald-600 text-sm">{results.totalBandwidthGbps} Gbps</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Advice Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-200">Recommended System Architecture Provisioning:</span>
              <p className="text-indigo-700/90 mt-0.5 leading-relaxed">
                Requires at least <strong className="text-slate-900">{results.recommendedDbShards} Database Shard(s)</strong> for load distribution, and a Redis Cache Cluster with at least <strong className="text-slate-900">{results.recommendedCacheRAMGB} GB RAM</strong> to maintain low sub-10ms query latency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
