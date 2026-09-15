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
