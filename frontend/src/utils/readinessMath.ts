export interface CompanyBenchmark {
  id: string;
  name: string;
  totalQuestions: number;
  passingThreshold: number;
  badgeColor: string;
  accentColor: string;
  popularTopics: string[];
  description: string;
}

export const COMPANY_BENCHMARKS: CompanyBenchmark[] = [
  {
    id: 'google',
    name: 'Google',
    totalQuestions: 120,
    passingThreshold: 82,
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    accentColor: '#EF4444',
    popularTopics: ['Graph Theory & BFS/DFS', 'Dynamic Programming', 'Trie & Segment Tree', 'System Design (HLD)'],
    description: 'Focuses heavily on algorithmic optimization, complex graph algorithms, and scale system design.'
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    totalQuestions: 100,
    passingThreshold: 85,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    accentColor: '#3B82F6',
    popularTopics: ['Arrays & Two Pointers', 'Binary Search & Trees', 'Intervals', 'Architecture Design'],
    description: 'Requires rapid speed execution, clean code, and zero bug rate in 45-minute coding rounds.'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    totalQuestions: 110,
    passingThreshold: 78,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    accentColor: '#F59E0B',
    popularTopics: ['Sliding Window', 'Heaps & Top-K', 'OOPs Leadership Principles', 'Distributed Caching'],
    description: 'Combines LC Medium/Hard DSA problems with Amazon 16 Leadership Principles (STAR method).'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    totalQuestions: 90,
    passingThreshold: 75,
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    accentColor: '#06B6D4',
    popularTopics: ['Linked Lists & Trees', 'DBMS & SQL Indexes', 'OS Memory Management', 'Low Level Design (LLD)'],
    description: 'Emphasizes OOP design patterns, clean code, OS internals, and solid CS fundamentals.'
  },
  {
    id: 'apple',
    name: 'Apple',
    totalQuestions: 85,
    passingThreshold: 80,
    badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    accentColor: '#94A3B8',
    popularTopics: ['C++ / Memory Management', 'Bit Manipulation', 'Concurrency & Locks', 'Embedded Algorithms'],
    description: 'Focuses on low-level optimization, memory efficiency, and hardware-software interaction.'
  },
  {
    id: 'uber',
    name: 'Uber',
    totalQuestions: 95,
    passingThreshold: 84,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    accentColor: '#10B981',
    popularTopics: ['QuadTrees & Spatial Indexing', 'Kafka Queues', 'Shortest Path (Dijkstra)', 'Microservices'],
    description: 'Tests geospatial indexing, high concurrency microservices, and graph routing algorithms.'
  }
];

export interface ReadinessResult {
  score: number;
  coveragePercentage: number;
  status: 'EXCELLENT' | 'READY' | 'MODERATE' | 'NEEDS_WORK';
  statusLabel: string;
  statusColor: string;
  actionableTips: string[];
}

export function calculateCompanyReadiness(
  totalCompanyQuestions: number,
  solvedCompanyQuestions: number,
  accuracyRate: number
): ReadinessResult {
  if (totalCompanyQuestions <= 0) {
    return {
      score: 0,
      coveragePercentage: 0,
      status: 'NEEDS_WORK',
      statusLabel: 'No Data',
      statusColor: 'text-slate-400',
      actionableTips: ['Start solving tagged company questions to build readiness.']
    };
  }

  const coverageWeight = 0.6;
  const accuracyWeight = 0.4;

  const coveragePercentage = Math.min(100, Math.round((solvedCompanyQuestions / totalCompanyQuestions) * 100));
  const rawScore = (coveragePercentage * coverageWeight) + (accuracyRate * accuracyWeight);
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let status: 'EXCELLENT' | 'READY' | 'MODERATE' | 'NEEDS_WORK' = 'NEEDS_WORK';
  let statusLabel = 'Critical Skill Gap';
  let statusColor = 'text-rose-400';
  const tips: string[] = [];

  if (score >= 85) {
    status = 'EXCELLENT';
    statusLabel = 'Interview Ready (Tier 1)';
    statusColor = 'text-emerald-400';
    tips.push('Excellent coverage & accuracy! Focus on mock interviews and speed execution under 25 mins.');
    tips.push('Review high-frequency system design trade-offs.');
  } else if (score >= 70) {
    status = 'READY';
    statusLabel = 'Interview Ready';
    statusColor = 'text-purple-400';
    tips.push('Strong foundation! Solve 10-15 more Medium/Hard company tagged problems.');
    tips.push('Practice time-boxed mock interviews to boost problem speed.');
  } else if (score >= 50) {
    status = 'MODERATE';
    statusLabel = 'Moderate Preparation';
    statusColor = 'text-amber-400';
    tips.push('Solid start, but question coverage is below 60%. Target key weak domains first.');
    tips.push('Review starred concepts and formula cheat sheet regularly.');
  } else {
    status = 'NEEDS_WORK';
    statusLabel = 'Needs Intensive Practice';
    statusColor = 'text-rose-400';
    tips.push('Increase daily question output on Striver A2Z & LeetCode Explorer.');
    tips.push('Complete foundational topic modules before scheduling technical rounds.');
  }

  return {
    score,
    coveragePercentage,
    status,
    statusLabel,
    statusColor,
    actionableTips: tips
  };
}
