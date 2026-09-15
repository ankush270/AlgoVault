export interface StriverProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  url: string;
  tags: string[];
  source?: string;
}

export interface StriverTopic {
  topic_name: string;
  problems: StriverProblem[];
}

export interface StriverStep {
  step_id: number;
  step_title: string;
  topics: StriverTopic[];
}

export interface StriverSheetData {
  sheet?: string;
  total_problems?: number;
  stats?: {
    striver_problems: number;
    love_babbar_problems: number;
    neetcode_150_problems: number;
    fraz_problems: number;
    multi_sheet_problems: number;
  };
  steps: StriverStep[];
}

export interface TopicCategory {
  id: string;
  title: string;
  icon: string;
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  { id: 'arrays', title: 'Arrays & Matrix', icon: '🔢' },
  { id: 'strings', title: 'Strings', icon: '🔤' },
  { id: 'binary_search', title: 'Binary Search', icon: '🎯' },
  { id: 'linked_list', title: 'Linked List', icon: '🔗' },
  { id: 'stacks_queues', title: 'Stacks & Queues', icon: '📥' },
  { id: 'trees', title: 'Binary Trees & BST', icon: '🌲' },
  { id: 'heaps', title: 'Heaps & Priority Queue', icon: '⛰️' },
  { id: 'greedy', title: 'Greedy Algorithms', icon: '💡' },
  { id: 'recursion_backtracking', title: 'Recursion & Backtracking', icon: '🔄' },
  { id: 'dp', title: 'Dynamic Programming (DP)', icon: '⚡' },
  { id: 'graphs', title: 'Graphs & Shortest Path', icon: '🕸️' },
  { id: 'bit_manipulation', title: 'Bit Manipulation', icon: '0️⃣' },
  { id: 'tries', title: 'Trie Data Structure', icon: '🌳' },
  { id: 'basics_math', title: 'Basics & Math', icon: '🧩' }
];
