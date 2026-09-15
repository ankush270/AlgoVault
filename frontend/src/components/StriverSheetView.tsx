import React, { useState, useEffect, useMemo } from 'react';
import { StriverProblem, StriverSheetData, TOPIC_CATEGORIES } from './sheet/types';
import { getProblemCategory, problemMatchesSheet } from './sheet/utils';
import { SheetHeader } from './sheet/SheetHeader';
import { SheetTabs } from './sheet/SheetTabs';
import { SheetFilters } from './sheet/SheetFilters';
import { TopicAccordion } from './sheet/TopicAccordion';

// Re-export types for backward compatibility
export type { StriverProblem, StriverTopic, StriverStep, StriverSheetData } from './sheet/types';

const STORAGE_KEY = 'striver_a2z_solved_status_v1';

export const StriverSheetView: React.FC = () => {
  const [sheetData, setSheetData] = useState<StriverSheetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solvedStatus, setSolvedStatus] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({ arrays: true, dp: true, trees: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

  // Active Sheet Filter: 'all' | 'striver' | 'love_babbar' | 'fraz' | 'neetcode' | 'multi'
  const [activeSheetTab, setActiveSheetTab] = useState<string>('all');

  useEffect(() => {
    fetch('/data/striver_a2z_dsa.json')
      .then((res) => {
        if (!res.ok) return fetch('/data/dsa_master_sheet.json').then((r) => r.json());
        return res.json();
      })
      .then((data) => {
        setSheetData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Master DSA sheet JSON:', err);
        setIsLoading(false);
      });
  }, []);

  // Save solved state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solvedStatus));
  }, [solvedStatus]);

  const toggleSolved = (id: string) => {
    setSolvedStatus((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const expandAllTopics = () => {
    const allState: Record<string, boolean> = {};
    TOPIC_CATEGORIES.forEach((cat) => {
      allState[cat.id] = true;
    });
    setExpandedTopics(allState);
  };

  const collapseAllTopics = () => {
    setExpandedTopics({});
  };

  // Collect all active problems for selected sheet
  const activeProblemsWithMeta = useMemo(() => {
    if (!sheetData) return [];
    const list: { prob: StriverProblem; category: string }[] = [];
    
    sheetData.steps.forEach((step) => {
      step.topics.forEach((topic) => {
        topic.problems.forEach((p) => {
          if (problemMatchesSheet(p, activeSheetTab)) {
            const cat = getProblemCategory(p, step.step_title, topic.topic_name);
            list.push({ prob: p, category: cat });
          }
        });
      });
    });
    return list;
  }, [sheetData, activeSheetTab]);

  // Group active problems by clean Topic Category
  const topicGroupedData = useMemo(() => {
    const map: Record<string, { catInfo: typeof TOPIC_CATEGORIES[0]; problems: StriverProblem[] }> = {};
    
    TOPIC_CATEGORIES.forEach((cat) => {
      map[cat.id] = { catInfo: cat, problems: [] };
    });

    activeProblemsWithMeta.forEach(({ prob, category }) => {
      if (map[category]) {
        map[category].problems.push(prob);
      } else {
        map['basics_math'].problems.push(prob);
      }
    });

    return Object.values(map).filter((group) => group.problems.length > 0);
  }, [activeProblemsWithMeta]);

  const totalProblemsCount = activeProblemsWithMeta.length;

  const solvedCount = useMemo(() => {
    return activeProblemsWithMeta.filter(({ prob }) => solvedStatus[prob.id]).length;
  }, [activeProblemsWithMeta, solvedStatus]);

  const difficultyStats = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;

    activeProblemsWithMeta.forEach(({ prob }) => {
      const isDone = !!solvedStatus[prob.id];
      if (prob.difficulty === 'Easy') {
        easy++;
        if (isDone) easySolved++;
      } else if (prob.difficulty === 'Medium') {
        medium++;
        if (isDone) mediumSolved++;
      } else if (prob.difficulty === 'Hard') {
        hard++;
        if (isDone) hardSolved++;
      }
    });

    return { easy, medium, hard, easySolved, mediumSolved, hardSolved };
  }, [activeProblemsWithMeta, solvedStatus]);

  const progressPercentage = totalProblemsCount > 0 ? Math.round((solvedCount / totalProblemsCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Loading Master Topic-Wise DSA Sheet...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div className="p-8 text-center text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
        Failed to load Master DSA Sheet JSON dataset.
      </div>
    );
  }

  const sheetTabStats = sheetData.stats || {
    striver_problems: 661,
    love_babbar_problems: 424,
    neetcode_150_problems: 132,
    fraz_problems: 286,
    multi_sheet_problems: 583
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Top Header Banner */}
      <SheetHeader
        activeSheetTab={activeSheetTab}
        solvedCount={solvedCount}
        totalProblemsCount={totalProblemsCount}
        progressPercentage={progressPercentage}
        difficultyStats={difficultyStats}
      />

      {/* 2. Top Sheet Filter Tabs */}
      <SheetTabs
        activeSheetTab={activeSheetTab}
        setActiveSheetTab={setActiveSheetTab}
        stats={sheetTabStats}
      />

      {/* 3. Search & Filter Controls */}
      <SheetFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTopicFilter={selectedTopicFilter}
        setSelectedTopicFilter={setSelectedTopicFilter}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        filterStatus={filterStatus}
        setFilterStatus={(val) => setFilterStatus(val as 'all' | 'solved' | 'unsolved')}
        totalProblemsCount={totalProblemsCount}
        totalTopicsCount={topicGroupedData.length}
        expandAllTopics={expandAllTopics}
        collapseAllTopics={collapseAllTopics}
      />

      {/* 4. Topic-Wise Accordions List */}
      <div className="space-y-4">
        {topicGroupedData.map((group) => {
          const cat = group.catInfo;
          if (selectedTopicFilter !== 'all' && selectedTopicFilter !== cat.id) {
            return null;
          }

          // Filter problems inside topic group
          const filteredProblems = group.problems.filter((p) => {
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              const matchesTitle = p.title.toLowerCase().includes(q);
              const matchesTag = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
              if (!matchesTitle && !matchesTag) return false;
            }
            if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
            if (filterStatus === 'solved' && !solvedStatus[p.id]) return false;
            if (filterStatus === 'unsolved' && solvedStatus[p.id]) return false;

            return true;
          });

          if (filteredProblems.length === 0) return null;

          const isExpanded = !!expandedTopics[cat.id] || !!searchQuery.trim() || selectedTopicFilter !== 'all';

          return (
            <TopicAccordion
              key={cat.id}
              cat={cat}
              problems={filteredProblems}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleTopicExpand(cat.id)}
              solvedStatus={solvedStatus}
              toggleSolved={toggleSolved}
              activeSheetTab={activeSheetTab}
            />
          );
        })}
      </div>
    </div>
  );
};
