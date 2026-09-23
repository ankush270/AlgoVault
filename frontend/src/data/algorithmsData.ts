import algoVisualizerData from '../../public/data/algorithms/algorithms_visualizer.json';

export interface AlgorithmItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  summary: string;
  explanation: string[];
  wAnswers: {
    whatItSolves: string;
    whenToUse: string;
    whereUsed: string;
    whyOptimal: string;
  };
  codeTemplates: {
    language: 'python' | 'cpp' | 'java' | 'javascript';
    code: string;
  }[];
  practiceProblems: {
    title: string;
    url: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }[];
}

export const ALGORITHM_CATEGORIES = algoVisualizerData.categories;
export const ALGORITHMS_DATA: AlgorithmItem[] = algoVisualizerData.algorithms as AlgorithmItem[];
