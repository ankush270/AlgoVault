export type DomainType = 
  | 'dsa' 
  | 'system-design' 
  | 'os' 
  | 'dbms-sql' 
  | 'computer-networks' 
  | 'genai-ml';

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

export interface UserProgressState {
  statuses: Record<string, ItemStatus>;
  starred: Record<string, boolean>;
  notes: Record<string, string>;
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
