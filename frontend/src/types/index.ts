export type DomainType = 
  | 'dsa' 
  | 'system-design' 
  | 'os' 
  | 'dbms-sql' 
  | 'computer-networks' 
  | 'genai-ml'
  | 'oops'
  | 'object-oriented-programming'
  | 'javascript';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ItemStatus = 'todo' | 'in-progress' | 'mastered' | 'needs-revision';

export interface CodeTemplate {
  language: 'cpp' | 'java' | 'python' | 'javascript' | 'sql';
  code: string;
}

export interface TopicItem {
  id: string;
  title: string;
  domain: DomainType;
  category: string;
  difficulty: Difficulty;
  companyTags: string[];
  summary: string;
  keyConcepts: string[];
  detailedContent: string;
  codeTemplates?: CodeTemplate[];
  interviewQuestions?: {
    question: string;
    answer: string;
    explanation?: string;
  }[];
  diagramSvg?: string;
  importanceRating: number; // 1-5 stars
}

export type RatingDifficulty = 'easy' | 'medium' | 'hard' | 'failed';

export type AlgorithmType = 'smart-adaptive' | 'sm2' | 'leitner';

export interface RevisionHistoryEntry {
  date: string; // ISO YYYY-MM-DD
  dateFormatted: string; // e.g. "12 Sep"
  rating: RatingDifficulty;
  nextDate: string;
  nextDateFormatted: string;
}

export interface RevisionRecord {
  topicId: string;
  algorithmUsed: AlgorithmType;
  lastAttempted: string; // ISO YYYY-MM-DD
  lastAttemptedFormatted: string; // e.g. "12 Sep"
  nextRevisionDate: string; // ISO YYYY-MM-DD
  nextRevisionDateFormatted: string; // e.g. "13 Sep"
  interval: number; // in days
  easeFactor: number; // SM-2 multiplier (default 2.5)
  leitnerBox: number; // Leitner box (1 to 5)
  retentionScore: number; // 0 to 100%
  repetitions: number; // number of successful recalls
  lastRating?: RatingDifficulty;
  scheduledDates: string[]; // sequence of upcoming milestone dates e.g. ["13 Sep", "16 Sep", "23 Sep", "07 Oct", "07 Nov"]
  history: RevisionHistoryEntry[];
}

export interface UserProgressState {
  statuses: Record<string, ItemStatus>;
  starred: Record<string, boolean>;
  notes: Record<string, string>;
  revisions: Record<string, RevisionRecord>;
  activeAlgorithm: AlgorithmType;
  streak: number;
  lastActiveDate: string;
  dailyGoal: number; // e.g. 3 topics/day
  todayCompletedCount: number;
  completedDates: string[]; // ISO YYYY-MM-DD
}

export interface Flashcard {
  id: string;
  topicId: string;
  domain: DomainType;
  question: string;
  answer: string;
  codeSnippet?: string;
  difficulty: Difficulty;
}

// LeetCode Explorer Types
export interface LeetCodeCompany {
  name: string;
  frequency: number | null;
}

export interface LeetCodeQuestion {
  id: number | string;
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  acceptance: number | null;
  companies: LeetCodeCompany[];
  tags?: string[];
  category?: string;
  pattern?: string;
  time_complexity?: string;
  space_complexity?: string;
  hint?: string;
  ai_enriched?: boolean;
}

// Algorithm Hub Types
export interface WAnswers {
  whatItSolves: string;
  whenToUse: string;
  whereUsed: string;
  whyOptimal: string;
}

export interface PracticeProblem {
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ExampleTrace {
  input: string;
  output: string;
  traceSteps: string[];
}

export interface Algorithm {
  id: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  summary: string;
  explanation: string[];
  exampleTrace?: ExampleTrace;
  wAnswers: WAnswers;
  codeTemplates: CodeTemplate[];
  practiceProblems: PracticeProblem[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface AlgorithmsMasterData {
  categories: Category[];
  algorithms: Algorithm[];
}

// SQL Playground Types
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
