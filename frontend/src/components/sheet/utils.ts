import { StriverProblem } from './types';

// Helper to assign problem to Topic Category
export function getProblemCategory(prob: StriverProblem, stepTitle: string, topicName: string): string {
  const combined = (stepTitle + " " + topicName + " " + (prob.tags ? prob.tags.join(" ") : "") + " " + prob.title).toLowerCase();

  if (combined.includes("trie")) return "tries";
  if (combined.includes("graph") || combined.includes("bfs") || combined.includes("dfs") || combined.includes("topo")) return "graphs";
  if (combined.includes("dynamic programming") || combined.includes("dp") || combined.includes("stocks") || combined.includes("lis") || combined.includes("mcm")) return "dp";
  if (combined.includes("tree") || combined.includes("bst")) return "trees";
  if (combined.includes("heap") || combined.includes("priority queue")) return "heaps";
  if (combined.includes("greedy")) return "greedy";
  if (combined.includes("recursion") || combined.includes("backtracking")) return "recursion_backtracking";
  if (combined.includes("stack") || combined.includes("queue") || combined.includes("monotonic")) return "stacks_queues";
  if (combined.includes("linked list") || combined.includes("linkedlist")) return "linked_list";
  if (combined.includes("binary search") || combined.includes("search space")) return "binary_search";
  if (combined.includes("string") || combined.includes("strings") || combined.includes("palindrome") || combined.includes("anagram")) return "strings";
  if (combined.includes("bit") || combined.includes("bit manipulation")) return "bit_manipulation";
  if (combined.includes("array") || combined.includes("arrays") || combined.includes("matrix") || combined.includes("sorting") || combined.includes("sliding window") || combined.includes("two pointer")) return "arrays";
  return "basics_math";
}

// Check if problem matches active sheet filter
export function problemMatchesSheet(prob: StriverProblem, sheetTag: string): boolean {
  if (sheetTag === 'all') return true;
  if (!prob.source) return false;
  if (sheetTag === 'multi') return prob.source.includes('&');
  if (sheetTag === 'striver') return prob.source.includes('Striver');
  if (sheetTag === 'love_babbar') return prob.source.includes('Love Babbar');
  if (sheetTag === 'neetcode') return prob.source.includes('NeetCode');
  if (sheetTag === 'fraz') return prob.source.includes('Fraz');
  return true;
}
