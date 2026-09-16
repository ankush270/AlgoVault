import { useState, useMemo } from 'react';
import { LeetCodeQuestion } from '../types';

export type SortField = 'id' | 'title' | 'difficulty' | 'frequency' | 'acceptance';
export type SortOrder = 'asc' | 'desc';

export function useLeetCodeFilter(questions: LeetCodeQuestion[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [solvedFilter, setSolvedFilter] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});

  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesCategory = q.category?.toLowerCase().includes(query);
        const matchesPattern = q.pattern?.toLowerCase().includes(query);
        const matchesTag = q.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesId = String(q.id).includes(query);

        if (!matchesTitle && !matchesCategory && !matchesPattern && !matchesTag && !matchesId) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && q.category !== selectedCategory) {
        return false;
      }

      // 3. Difficulty filter
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // 4. Company filter
      if (selectedCompany !== 'all') {
        const hasCompany = q.companies?.some(
          (c) => c.name.toLowerCase() === selectedCompany.toLowerCase()
        );
        if (!hasCompany) return false;
      }

      // 5. Solved status filter
      if (solvedFilter !== 'all') {
        const isSolved = Boolean(solvedMap[String(q.id)]);
        if (solvedFilter === 'solved' && !isSolved) return false;
        if (solvedFilter === 'unsolved' && isSolved) return false;
      }

      return true;
    });
  }, [questions, searchQuery, selectedCategory, selectedDifficulty, selectedCompany, solvedFilter, solvedMap]);

  const sortedQuestions = useMemo(() => {
    return [...filteredQuestions].sort((a, b) => {
      let valA: any = a[sortField as keyof LeetCodeQuestion];
      let valB: any = b[sortField as keyof LeetCodeQuestion];

      if (sortField === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        valA = order[a.difficulty as keyof typeof order] || 4;
        valB = order[b.difficulty as keyof typeof order] || 4;
      }

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      const result = valA < valB ? -1 : 1;
      return sortOrder === 'asc' ? result : -result;
    });
  }, [filteredQuestions, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedQuestions.length / itemsPerPage) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedQuestions.slice(start, start + itemsPerPage);
  }, [sortedQuestions, currentPage, itemsPerPage]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedCompany,
    setSelectedCompany,
    solvedFilter,
    setSolvedFilter,
    solvedMap,
    setSolvedMap,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredQuestions,
    paginatedQuestions,
    totalCount: filteredQuestions.length,
  };
}
