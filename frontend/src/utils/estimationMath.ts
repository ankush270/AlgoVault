export interface SystemRequirements {
  dailyActiveUsers: number; // e.g. 10,000,000
  readsPerUserPerDay: number; // e.g. 50
  writesPerUserPerDay: number; // e.g. 5
  payloadSizeBytes: number; // e.g. 500 bytes
  retentionYears: number; // e.g. 5
  peakMultiplier: number; // e.g. 2x
  cacheRatioPercentage: number; // e.g. 20 (80/20 Pareto rule)
}

export interface EstimationResults {
  totalReadsPerDay: number;
  totalWritesPerDay: number;
  readQPS: number;
  writeQPS: number;
  totalQPS: number;
  peakReadQPS: number;
  peakWriteQPS: number;
  dailyStorageGB: string;
  monthlyStorageGB: string;
  yearlyStorageTB: string;
  fiveYearStorageTB: string;
  ingressBandwidthMbps: string;
  egressBandwidthMbps: string;
  totalBandwidthGbps: string;
  recommendedCacheRAMGB: string;
  recommendedDbShards: number;
}

export const defaultRequirements: SystemRequirements = {
  dailyActiveUsers: 10_000_000,
  readsPerUserPerDay: 50,
  writesPerUserPerDay: 5,
  payloadSizeBytes: 500,
  retentionYears: 5,
  peakMultiplier: 2,
  cacheRatioPercentage: 20,
};

export function calculateSystemEstimates(reqs: SystemRequirements): EstimationResults {
  const dau = Math.max(1, reqs.dailyActiveUsers);
  const readsPerUser = Math.max(0, reqs.readsPerUserPerDay);
  const writesPerUser = Math.max(0, reqs.writesPerUserPerDay);
  const payloadBytes = Math.max(1, reqs.payloadSizeBytes);
  const retentionYears = Math.max(1, reqs.retentionYears);
  const peakMultiplier = Math.max(1, reqs.peakMultiplier);
  const cacheRatio = Math.max(0, Math.min(100, reqs.cacheRatioPercentage)) / 100;

  const totalReadsPerDay = dau * readsPerUser;
  const totalWritesPerDay = dau * writesPerUser;

  const readQPS = Math.ceil(totalReadsPerDay / 86400);
  const writeQPS = Math.ceil(totalWritesPerDay / 86400);
  const totalQPS = readQPS + writeQPS;

  const peakReadQPS = readQPS * peakMultiplier;
  const peakWriteQPS = writeQPS * peakMultiplier;

  // Storage Math
  const dailyStorageBytes = totalWritesPerDay * payloadBytes;
  const dailyStorageGB = (dailyStorageBytes / (1024 ** 3)).toFixed(2);
  const monthlyStorageGB = ((dailyStorageBytes * 30.4) / (1024 ** 3)).toFixed(2);
  const yearlyStorageTB = ((dailyStorageBytes * 365.25) / (1024 ** 4)).toFixed(2);
  const fiveYearStorageTB = ((dailyStorageBytes * 365.25 * retentionYears) / (1024 ** 4)).toFixed(2);

  // Bandwidth Math (bits per second => convert to Mbps / Gbps)
  const ingressBitsPerSec = writeQPS * payloadBytes * 8;
  const egressBitsPerSec = readQPS * payloadBytes * 8;
  const totalBitsPerSec = (writeQPS + readQPS) * payloadBytes * 8;

  const ingressBandwidthMbps = (ingressBitsPerSec / (1024 ** 2)).toFixed(2);
  const egressBandwidthMbps = (egressBitsPerSec / (1024 ** 2)).toFixed(2);
  const totalBandwidthGbps = (totalBitsPerSec / (1024 ** 3)).toFixed(2);

  // Cache & Database Sharding Math
  const cachedReadsPerDay = totalReadsPerDay * cacheRatio;
  const recommendedCacheRAMBytes = cachedReadsPerDay * payloadBytes;
  const recommendedCacheRAMGB = (recommendedCacheRAMBytes / (1024 ** 3)).toFixed(2);

  // Assuming 10k QPS capacity per DB shard node
  const recommendedDbShards = Math.max(1, Math.ceil((peakReadQPS + peakWriteQPS) / 10000));

  return {
    totalReadsPerDay,
    totalWritesPerDay,
    readQPS,
    writeQPS,
    totalQPS,
    peakReadQPS,
    peakWriteQPS,
    dailyStorageGB,
    monthlyStorageGB,
    yearlyStorageTB,
    fiveYearStorageTB,
    ingressBandwidthMbps,
    egressBandwidthMbps,
    totalBandwidthGbps,
    recommendedCacheRAMGB,
    recommendedDbShards,
  };
}
