import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Briefcase, 
  Calendar, 
  ExternalLink, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  Filter, 
  X, 
  CheckCircle2, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Grid,
  Zap,
  ArrowUpDown,
  Clock,
  ArrowLeft,
  FolderOpen,
  FileText,
  ListCheck,
  PieChart,
  Maximize2,
  Minimize2,
  BrainCircuit,
  BarChart3,
  Trash2
} from 'lucide-react';
import { CustomDropdown } from './common/CustomDropdown';

interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  role: string;
  experience_level: string;
  url: string;
  published_date: string;
  rounds_identified: string[];
  extracted_questions: string[];
  full_content: string;
}

interface IndexFileItem {
  file: string;
  group: string;
  companies_count: number;
  experiences_count: number;
  size_mb: number;
}

interface MasterIndex {
  metadata: {
    total_experiences: number;
    total_companies: number;
    total_chunk_files: number;
  };
  dataset_files: IndexFileItem[];
  companies_summary: { company: string; total_experiences: number }[];
}

interface QuestionSubjectItem {
  question: string;
  subject: string;
  total_companies_asked: number;
  asked_in_companies: string[];
}

interface MatrixItem {
  company: string;
  total_questions_extracted: number;
  subject_breakdown: Record<string, number>;
}

const cleanQuestionText = (qText: string): string => {
  if (!qText) return '';
  return qText
    .replace(/^#+\s*/, '')            // Remove leading markdown headers like ###, ##, #
    .replace(/^\d+[\.\)]\s*/, '')     // Remove leading question numbers like "6. ", "9) "
    .replace(/\*\*/g, '')             // Remove bold Markdown
    .replace(/`/g, '')                // Remove backticks
    .replace(/^[-*•]\s*/, '')         // Remove leading list bullets
    .trim();
};

const cleanCompanyName = (name: string): string => {
  if (!name) return '';
  return name.replace(/\s*Asked$/i, '').trim();
};

const getSubjectTag = (qText: string) => {
  const t = qText.toLowerCase();
  if (t.includes('os') || t.includes('process') || t.includes('thread') || t.includes('paging') || t.includes('deadlock') || t.includes('semaphore') || t.includes('mutex') || t.includes('virtual memory')) {
    return { name: 'Operating System', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  }
  if (t.includes('sql') || t.includes('database') || t.includes('index') || t.includes('acid') || t.includes('query') || t.includes('join') || t.includes('normalization')) {
    return { name: 'DBMS & SQL', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
  }
  if (t.includes('tcp') || t.includes('udp') || t.includes('http') || t.includes('dns') || t.includes('ip') || t.includes('network') || t.includes('socket')) {
    return { name: 'Computer Networks', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
  }
  if (t.includes('system design') || t.includes('cache') || t.includes('oops') || t.includes('design pattern') || t.includes('rate limit') || t.includes('lru')) {
    return { name: 'System Design', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
  }
  if (t.includes('tell me') || t.includes('conflict') || t.includes('leadership') || t.includes('challenge') || t.includes('why company')) {
    return { name: 'HR & Behavioral', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  }
  return { name: 'DSA & Problem Solving', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
};

const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr === 'Unknown') return 'Verified Archive';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = match[1];
    const monthIdx = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${months[monthIdx]} ${year}`;
    }
  }
  return dateStr.split(' ')[0];
};

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  perPageOptions?: { value: string; label: string }[];
  itemLabel?: string;
  scrollToTop?: boolean;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  perPageOptions = [
    { value: '16', label: '16 per page' },
    { value: '24', label: '24 per page' },
    { value: '48', label: '48 per page' },
    { value: '96', label: '96 per page' },
    { value: '9999', label: `Show All (${totalItems})` },
  ],
  itemLabel = 'items',
  scrollToTop = true,
}) => {
  if (totalItems === 0) return null;

  const handlePageClick = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      onPageChange(p);
      if (scrollToTop) {
        window.scrollTo({ top: 320, behavior: 'smooth' });
      }
    }
  };

  const pageNumbers = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800 text-xs shadow-xl my-4">
      <div className="flex items-center gap-3 text-slate-400 flex-wrap">
        <span>
          Showing <strong className="text-white">{itemsPerPage >= 9999 ? 1 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
          <strong className="text-white">{itemsPerPage >= 9999 ? totalItems : Math.min(currentPage * itemsPerPage, totalItems)}</strong> of{' '}
          <strong className="text-white">{totalItems}</strong> {itemLabel}
        </span>

        <div className="flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
          <span className="text-[11px] font-medium text-slate-400">Show:</span>
          <CustomDropdown
            options={perPageOptions}
            value={String(itemsPerPage)}
            onChange={(val) => {
              onItemsPerPageChange(Number(val));
              onPageChange(1);
            }}
            dropdownWidth="w-40"
            alignRight={false}
          />
        </div>
      </div>

      {totalPages > 1 && itemsPerPage < 9999 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-all text-xs font-semibold"
          >
            First
          </button>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1 px-1">
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => handlePageClick(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === p
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-all text-xs font-semibold"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export const InterviewExperiencesExplorer: React.FC = () => {
  const [masterIndex, setMasterIndex] = useState<MasterIndex | null>(null);
  const [allExperiences, setAllExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Analytics State
  const [subjectQuestionsIndex, setSubjectQuestionsIndex] = useState<Record<string, QuestionSubjectItem[]> | null>(null);
  const [companySubjectMatrix, setCompanySubjectMatrix] = useState<MatrixItem[] | null>(null);

  // View Modes: 'companies_directory' | 'subject_questions' | 'subject_matrix' | 'company_vault' | 'all_experiences'
  const [viewMode, setViewMode] = useState<'companies_directory' | 'subject_questions' | 'subject_matrix' | 'company_vault' | 'all_experiences'>('companies_directory');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  // Subject Questions Tab
  const [activeSubjectTab, setActiveSubjectTab] = useState<string>('Operating System');
  const [globalQuestionSearch, setGlobalQuestionSearch] = useState<string>('');
  const [expandedCompaniesQuestion, setExpandedCompaniesQuestion] = useState<string | null>(null);

  // Subject Matrix Search
  const [matrixSearchQuery, setMatrixSearchQuery] = useState<string>('');

  // Tabs within Company Vault: 'experiences' | 'questions' | 'rounds'
  const [companyTab, setCompanyTab] = useState<'experiences' | 'questions' | 'rounds'>('experiences');

  // Inline Accordion expanded experience ID
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
  const [showAllPopularCompanies, setShowAllPopularCompanies] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [companySearchQuery, setCompanySearchQuery] = useState<string>('');
  const [questionSearchQuery, setQuestionSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Directory Pagination State
  const [dirCurrentPage, setDirCurrentPage] = useState<number>(1);
  const [dirItemsPerPage, setDirItemsPerPage] = useState<number>(24);

  // Subject Questions Pagination State
  const [subjectCurrentPage, setSubjectCurrentPage] = useState<number>(1);
  const [subjectItemsPerPage, setSubjectItemsPerPage] = useState<number>(18);

  // Subject Matrix Pagination State
  const [matrixCurrentPage, setMatrixCurrentPage] = useState<number>(1);
  const [matrixItemsPerPage, setMatrixItemsPerPage] = useState<number>(24);

  // Company Vault Questions Pagination State
  const [compQuestCurrentPage, setCompQuestCurrentPage] = useState<number>(1);
  const [compQuestItemsPerPage, setCompQuestItemsPerPage] = useState<number>(18);

  // Auto-reset page numbers when searches or tabs change
  useEffect(() => {
    setDirCurrentPage(1);
  }, [companySearchQuery]);

  useEffect(() => {
    setSubjectCurrentPage(1);
  }, [activeSubjectTab, globalQuestionSearch]);

  useEffect(() => {
    setMatrixCurrentPage(1);
  }, [matrixSearchQuery]);

  useEffect(() => {
    setCompQuestCurrentPage(1);
  }, [questionSearchQuery, selectedCompany, companyTab]);

  const [activeModalExperience, setActiveModalExperience] = useState<ExperienceItem | null>(null);
  const [savedExperienceIds, setSavedExperienceIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_interview_experiences') || '[]');
    } catch {
      return [];
    }
  });

  // Deleted items state with localStorage persistence
  const [deletedExperienceIds, setDeletedExperienceIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('deleted_interview_experience_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [deletedQuestionTexts, setDeletedQuestionTexts] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('deleted_interview_question_texts') || '[]');
    } catch {
      return [];
    }
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleDeleteExperience = async (expId: string, _title?: string) => {
    const updated = [...deletedExperienceIds, expId];
    setDeletedExperienceIds(updated);
    try {
      localStorage.setItem('deleted_interview_experience_ids', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (activeModalExperience?.id === expId) {
      setActiveModalExperience(null);
    }

    try {
      await fetch(`${API_BASE}/api/dataset/experience/${expId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete experience from backend JSON files:', err);
    }
  };

  const handleDeleteQuestion = async (qText: string) => {
    const updated = [...deletedQuestionTexts, qText];
    setDeletedQuestionTexts(updated);
    try {
      localStorage.setItem('deleted_interview_question_texts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch(`${API_BASE}/api/dataset/question`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText: qText }),
      });
    } catch (err) {
      console.error('Failed to delete question from backend JSON files:', err);
    }
  };

  // Load Master Index, 4 Dataset Chunks, and Analytics JSONs on Mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/data/interview-experiences/interview_dataset_master_index.json').then((res) => res.json()),
      fetch('/data/interview-experiences/interview_dataset_part1_A_to_D.json').then((res) => res.json()),
      fetch('/data/interview-experiences/interview_dataset_part2_E_to_L.json').then((res) => res.json()),
      fetch('/data/interview-experiences/interview_dataset_part3_M_to_R.json').then((res) => res.json()),
      fetch('/data/interview-experiences/interview_dataset_part4_S_to_Z.json').then((res) => res.json()),
      fetch('/data/interview-experiences/subject_wise_questions_index.json').then((res) => res.json()).catch(() => null),
      fetch('/data/interview-experiences/company_subject_matrix.json').then((res) => res.json()).catch(() => null),
    ])
      .then(([master, p1, p2, p3, p4, subIndex, matrixData]) => {
        setMasterIndex(master);
        if (subIndex) setSubjectQuestionsIndex(subIndex);
        if (matrixData) setCompanySubjectMatrix(matrixData);

        const combined: ExperienceItem[] = [
          ...(p1.experiences || []),
          ...(p2.experiences || []),
          ...(p3.experiences || []),
          ...(p4.experiences || []),
        ];
        setAllExperiences(combined);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load full interview datasets:', err);
        setLoading(false);
      });
  }, []);

  // Open Company Vault Mode (e.g. Amazon, Microsoft, Swiggy)
  const openCompanyVault = (compName: string) => {
    setSelectedCompany(compName);
    setViewMode('company_vault');
    setCompanyTab('experiences');
    setExpandedExperienceId(null);
    setSearchQuery('');
    setQuestionSearchQuery('');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDirectory = () => {
    setViewMode('companies_directory');
    setSelectedCompany(null);
    setSearchQuery('');
    setExpandedExperienceId(null);
  };

  const toggleSaveExperience = (id: string) => {
    setSavedExperienceIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('saved_interview_experiences', JSON.stringify(updated));
      return updated;
    });
  };

  // Top Popular Companies
  const topCompanies = useMemo(() => {
    if (!masterIndex) return [];
    return masterIndex.companies_summary.slice(0, 16);
  }, [masterIndex]);

  // All 448 Companies List (Filtered by Directory Search)
  const allCompaniesFiltered = useMemo(() => {
    if (!masterIndex) return [];
    if (!companySearchQuery.trim()) return masterIndex.companies_summary;
    const q = companySearchQuery.toLowerCase();
    return masterIndex.companies_summary.filter((item) =>
      item.company.toLowerCase().includes(q)
    );
  }, [masterIndex, companySearchQuery]);

  // Filtered & Sorted Experiences List
  const companyExperiences = useMemo(() => {
    let list = allExperiences;
    if (viewMode === 'company_vault' && selectedCompany) {
      list = allExperiences.filter(
        (item) => item.company.toLowerCase() === selectedCompany.toLowerCase()
      );
    }
    return list.filter((item) => !deletedExperienceIds.includes(item.id));
  }, [allExperiences, viewMode, selectedCompany, deletedExperienceIds]);

  const sortedExperiences = useMemo(() => {
    const filtered = companyExperiences.filter((item) => {
      if (selectedYear !== 'all') {
        const yr = item.published_date && item.published_date !== 'Unknown' ? item.published_date.slice(0, 4) : '';
        if (selectedYear === 'older') {
          if (!yr || parseInt(yr, 10) >= 2020) return false;
        } else {
          if (yr !== selectedYear) return false;
        }
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.company.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.extracted_questions.some((quest) => quest.toLowerCase().includes(q)) ||
        item.full_content.toLowerCase().includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.published_date && a.published_date !== 'Unknown' ? a.published_date : '1970-01-01';
        const dateB = b.published_date && b.published_date !== 'Unknown' ? b.published_date : '1970-01-01';
        return dateB.localeCompare(dateA);
      }
      if (sortBy === 'oldest') {
        const dateA = a.published_date && a.published_date !== 'Unknown' ? a.published_date : '2099-12-31';
        const dateB = b.published_date && b.published_date !== 'Unknown' ? b.published_date : '2099-12-31';
        return dateA.localeCompare(dateB);
      }
      if (sortBy === 'most_questions') {
        return b.extracted_questions.length - a.extracted_questions.length;
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [companyExperiences, searchQuery, sortBy, selectedYear]);

  // Extracted Question Bank for Company
  const companyQuestionBank = useMemo(() => {
    const list: { question: string; expTitle: string; expId: string; role: string; date: string }[] = [];
    const seen = new Set<string>();

    companyExperiences.forEach((exp) => {
      exp.extracted_questions.forEach((q) => {
        const trimmed = q.trim();
        const cleaned = cleanQuestionText(trimmed);
        if (
          trimmed &&
          !seen.has(trimmed.toLowerCase()) &&
          !deletedQuestionTexts.includes(trimmed) &&
          !deletedQuestionTexts.includes(cleaned)
        ) {
          seen.add(trimmed.toLowerCase());
          list.push({
            question: trimmed,
            expTitle: exp.title,
            expId: exp.id,
            role: exp.role,
            date: exp.published_date
          });
        }
      });
    });

    if (!questionSearchQuery.trim()) return list;
    const q = questionSearchQuery.toLowerCase();
    return list.filter((item) => item.question.toLowerCase().includes(q) || item.role.toLowerCase().includes(q));
  }, [companyExperiences, questionSearchQuery, deletedQuestionTexts]);

  // Rounds Stats for Company
  const companyRoundsStats = useMemo(() => {
    const counts: Record<string, number> = {};
    companyExperiences.forEach((exp) => {
      exp.rounds_identified.forEach((r) => {
        counts[r] = (counts[r] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [companyExperiences]);

  // Subject Questions list for Active Subject Tab
  const activeSubjectQuestions = useMemo(() => {
    if (!subjectQuestionsIndex) return [];
    const rawList = subjectQuestionsIndex[activeSubjectTab] || [];
    const list = rawList.filter((item) => {
      const trimmed = item.question.trim();
      const cleaned = cleanQuestionText(trimmed);
      return !deletedQuestionTexts.includes(trimmed) && !deletedQuestionTexts.includes(cleaned);
    });
    if (!globalQuestionSearch.trim()) return list;
    const q = globalQuestionSearch.toLowerCase();
    return list.filter((item) =>
      item.question.toLowerCase().includes(q) ||
      item.asked_in_companies.some((c) => c.toLowerCase().includes(q))
    );
  }, [subjectQuestionsIndex, activeSubjectTab, globalQuestionSearch, deletedQuestionTexts]);

  // Filtered Subject Matrix
  const filteredSubjectMatrix = useMemo(() => {
    if (!companySubjectMatrix) return [];
    if (!matrixSearchQuery.trim()) return companySubjectMatrix;
    const q = matrixSearchQuery.toLowerCase();
    return companySubjectMatrix.filter((item) =>
      item.company.toLowerCase().includes(q)
    );
  }, [companySubjectMatrix, matrixSearchQuery]);

  // 1. Directory Pagination Calculations
  const dirTotalItems = allCompaniesFiltered.length;
  const dirTotalPages = dirItemsPerPage >= 9999 ? 1 : Math.max(1, Math.ceil(dirTotalItems / dirItemsPerPage));
  const dirStartIndex = (dirCurrentPage - 1) * dirItemsPerPage;
  const dirEndIndex = dirItemsPerPage >= 9999 ? dirTotalItems : Math.min(dirStartIndex + dirItemsPerPage, dirTotalItems);

  const paginatedDirectoryCompanies = useMemo(() => {
    if (dirItemsPerPage >= 9999) return allCompaniesFiltered;
    return allCompaniesFiltered.slice(dirStartIndex, dirEndIndex);
  }, [allCompaniesFiltered, dirStartIndex, dirEndIndex, dirItemsPerPage]);

  // 2. Subject Questions Pagination Calculations
  const subjectTotalItems = activeSubjectQuestions.length;
  const subjectTotalPages = subjectItemsPerPage >= 9999 ? 1 : Math.max(1, Math.ceil(subjectTotalItems / subjectItemsPerPage));
  const subjectStartIndex = (subjectCurrentPage - 1) * subjectItemsPerPage;
  const subjectEndIndex = subjectItemsPerPage >= 9999 ? subjectTotalItems : Math.min(subjectStartIndex + subjectItemsPerPage, subjectTotalItems);

  const paginatedSubjectQuestions = useMemo(() => {
    if (subjectItemsPerPage >= 9999) return activeSubjectQuestions;
    return activeSubjectQuestions.slice(subjectStartIndex, subjectEndIndex);
  }, [activeSubjectQuestions, subjectStartIndex, subjectEndIndex, subjectItemsPerPage]);

  // 3. Matrix Pagination Calculations
  const matrixTotalItems = filteredSubjectMatrix.length;
  const matrixTotalPages = matrixItemsPerPage >= 9999 ? 1 : Math.max(1, Math.ceil(matrixTotalItems / matrixItemsPerPage));
  const matrixStartIndex = (matrixCurrentPage - 1) * matrixItemsPerPage;
  const matrixEndIndex = matrixItemsPerPage >= 9999 ? matrixTotalItems : Math.min(matrixStartIndex + matrixItemsPerPage, matrixTotalItems);

  const paginatedMatrixCompanies = useMemo(() => {
    if (matrixItemsPerPage >= 9999) return filteredSubjectMatrix;
    return filteredSubjectMatrix.slice(matrixStartIndex, matrixEndIndex);
  }, [filteredSubjectMatrix, matrixStartIndex, matrixEndIndex, matrixItemsPerPage]);

  // 4. Experiences Pagination Calculations
  const totalItems = sortedExperiences.length;
  const totalPages = itemsPerPage >= 9999 ? 1 : Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage >= 9999 ? totalItems : Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedExperiences = useMemo(() => {
    if (itemsPerPage >= 9999) return sortedExperiences;
    return sortedExperiences.slice(startIndex, endIndex);
  }, [sortedExperiences, startIndex, endIndex, itemsPerPage]);

  // 5. Company Question Bank Pagination Calculations
  const compQuestTotalItems = companyQuestionBank.length;
  const compQuestTotalPages = compQuestItemsPerPage >= 9999 ? 1 : Math.max(1, Math.ceil(compQuestTotalItems / compQuestItemsPerPage));
  const compQuestStartIndex = (compQuestCurrentPage - 1) * compQuestItemsPerPage;
  const compQuestEndIndex = compQuestItemsPerPage >= 9999 ? compQuestTotalItems : Math.min(compQuestStartIndex + compQuestItemsPerPage, compQuestTotalItems);

  const paginatedCompQuestions = useMemo(() => {
    if (compQuestItemsPerPage >= 9999) return companyQuestionBank;
    return companyQuestionBank.slice(compQuestStartIndex, compQuestEndIndex);
  }, [companyQuestionBank, compQuestStartIndex, compQuestEndIndex, compQuestItemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>GeeksforGeeks Verified Company Archives & Subject Analytics</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-400" />
                <span>
                  {viewMode === 'company_vault' && selectedCompany
                    ? `${selectedCompany} Interview Vault`
                    : viewMode === 'subject_questions'
                    ? 'Subject-Wise Question Index'
                    : viewMode === 'subject_matrix'
                    ? 'Company Subject Analytics Matrix'
                    : 'Company Interview Vaults'}
                </span>
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                {viewMode === 'subject_questions'
                  ? 'Browse 1,995 extracted questions tagged by core subjects (OS, DBMS, CN, System Design, DSA, HR) and see which companies asked each question.'
                  : viewMode === 'subject_matrix'
                  ? 'Subject-wise question breakdown matrix across 322 companies showing OS, DBMS, CN, System Design, and DSA distributions.'
                  : viewMode === 'company_vault' && selectedCompany
                  ? `Everything for ${selectedCompany} is right inside: view all verified interview experiences, extracted question banks, and round breakdowns.`
                  : 'Select any company to open its dedicated interview vault, or explore subject-wise tagged question banks across all 448 companies.'}
              </p>
            </div>

            {/* Metrics Badges */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xl font-bold text-blue-400">{masterIndex?.metadata.total_companies || '448'}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Companies</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xl font-bold text-emerald-400">{masterIndex?.metadata.total_experiences || '920'}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Experiences</div>
              </div>
            </div>
          </div>

          {/* Primary Navigation Modes Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {viewMode === 'company_vault' ? (
              <button
                onClick={handleBackToDirectory}
                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400" />
                <span>← Back to All Companies Directory</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setViewMode('companies_directory')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    viewMode === 'companies_directory'
                      ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5 text-blue-400" />
                  <span>Company Directory (448)</span>
                </button>

                <button
                  onClick={() => setViewMode('subject_questions')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    viewMode === 'subject_questions'
                      ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🧠 Subject Questions Index</span>
                </button>

                <button
                  onClick={() => setViewMode('subject_matrix')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    viewMode === 'subject_matrix'
                      ? 'bg-amber-600 text-white border border-amber-500 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>📊 Company Subject Matrix</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('all_experiences');
                    setSelectedCompany(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    viewMode === 'all_experiences'
                      ? 'bg-purple-600 text-white border border-purple-500 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Browse All 920 Cards</span>
                </button>
              </div>
            )}

            {/* Popular Companies Fast Selector (Wrapped Grid with Expand/Collapse) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Popular:</span>
              {(showAllPopularCompanies ? topCompanies : topCompanies.slice(0, 5)).map((c) => (
                <button
                  key={c.company}
                  onClick={() => openCompanyVault(c.company)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedCompany?.toLowerCase() === c.company.toLowerCase()
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.company} ({c.total_experiences})
                </button>
              ))}

              <button
                onClick={() => setShowAllPopularCompanies(!showAllPopularCompanies)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/30 transition-all flex items-center gap-1"
              >
                <span>{showAllPopularCompanies ? 'Show Less' : `+${topCompanies.length - 5} More`}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllPopularCompanies ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: COMPANY DIRECTORY (448 Companies Folders) */}
      {viewMode === 'companies_directory' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Company Search Bar */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>Browse Companies Vault Directory ({masterIndex?.metadata.total_companies || 448} Total)</span>
              </div>
              <span className="text-xs text-slate-400">Click any company to open its complete interview experiences & questions</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={companySearchQuery}
                onChange={(e) => setCompanySearchQuery(e.target.value)}
                placeholder="Search 448 companies (e.g. Amazon, Microsoft, Swiggy, Atlassian, Uber, DE Shaw, Paytm)..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {companySearchQuery && (
                <button
                  onClick={() => setCompanySearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Companies Directory Folders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedDirectoryCompanies.map((c) => (
              <div
                key={c.company}
                onClick={() => openCompanyVault(c.company)}
                className="group relative cursor-pointer p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800 hover:border-blue-500/50 hover:bg-[#131C35] transition-all duration-300 shadow-md flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-blue-400 font-bold text-base transition-colors">
                    {c.company[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {c.company}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-400" />
                      <span><strong>{c.total_experiences}</strong> Experiences</span>
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/60 group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Directory Bottom Pagination Bar */}
          <PaginationControl
            currentPage={dirCurrentPage}
            totalPages={dirTotalPages}
            totalItems={dirTotalItems}
            itemsPerPage={dirItemsPerPage}
            onPageChange={(p) => setDirCurrentPage(p)}
            onItemsPerPageChange={(val) => setDirItemsPerPage(val)}
            perPageOptions={[
              { value: '24', label: '24 companies' },
              { value: '48', label: '48 companies' },
              { value: '96', label: '96 companies' },
              { value: '9999', label: `Show All (${dirTotalItems})` },
            ]}
            itemLabel="companies"
          />
        </div>
      )}

      {/* VIEW 2: SUBJECT-WISE QUESTION INDEX (OS, DBMS, CN, System Design, DSA, HR) */}
      {viewMode === 'subject_questions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  <span>Subject-Wise Interview Question Bank</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    1,995 Questions Tagged
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Browse questions categorized by core subjects and see all companies where each question was asked.
                </p>
              </div>

              {/* Global Question Search Input */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={globalQuestionSearch}
                  onChange={(e) => setGlobalQuestionSearch(e.target.value)}
                  placeholder="Search questions or companies (e.g. Page Fault, LRU, Amazon)..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {globalQuestionSearch && (
                  <button onClick={() => setGlobalQuestionSearch('')} className="absolute right-3 top-2 text-slate-400 text-xs">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Subject Selector Tabs (Wrapped Flex Grid - No Scrollbars) */}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3">
              {[
                { name: 'Data Structures & Algorithms', icon: '⚡', color: 'emerald' },
                { name: 'System Design & Architecture', icon: '🏗️', color: 'purple' },
                { name: 'Frontend & Web Dev', icon: '🎨', color: 'cyan' },
                { name: 'Backend & Web Services', icon: '⚙️', color: 'blue' },
                { name: 'AI, ML & GenAI', icon: '🤖', color: 'violet' },
                { name: 'DevOps, Cloud & Security', icon: '☁️', color: 'sky' },
                { name: 'Operating System', icon: '🖥️', color: 'amber' },
                { name: 'DBMS & SQL', icon: '🗄️', color: 'indigo' },
                { name: 'Computer Networks', icon: '🌐', color: 'teal' },
                { name: 'OOPs & Object Oriented', icon: '📦', color: 'pink' },
                { name: 'HR & Behavioral', icon: '💬', color: 'rose' },
                { name: 'General & Other Technical', icon: '📌', color: 'slate' },
              ].map((sub) => {
                const count = subjectQuestionsIndex ? (subjectQuestionsIndex[sub.name] || []).length : 0;
                const isActive = activeSubjectTab === sub.name;
                return (
                  <button
                    key={sub.name}
                    onClick={() => setActiveSubjectTab(sub.name)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-900 border-slate-800'
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-slate-800 text-slate-300 font-extrabold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Questions Grid (3 Cards Per Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSubjectQuestions.map((qItem, idx) => {
              const isExpandedCompanies = expandedCompaniesQuestion === qItem.question;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {activeSubjectTab}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-300">
                          Asked in {qItem.total_companies_asked} {qItem.total_companies_asked === 1 ? 'Company' : 'Companies'}
                        </span>
                        <button
                          onClick={() => handleDeleteQuestion(qItem.question)}
                          className="p-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-white leading-relaxed">
                      {cleanQuestionText(qItem.question)}
                    </h3>
                  </div>

                  {/* Asked in Companies List Pills */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-blue-400" />
                        <span>Companies Asking this Question:</span>
                      </span>
                      {qItem.asked_in_companies.length > 5 && (
                        <button
                          onClick={() => setExpandedCompaniesQuestion(isExpandedCompanies ? null : qItem.question)}
                          className="text-[10px] font-bold text-blue-400 hover:underline"
                        >
                          {isExpandedCompanies ? 'Show Less' : `+${qItem.asked_in_companies.length - 5} More`}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(isExpandedCompanies ? qItem.asked_in_companies : qItem.asked_in_companies.slice(0, 5)).map((comp, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => openCompanyVault(cleanCompanyName(comp))}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 border border-slate-700/80 text-slate-200 hover:border-blue-500 hover:text-white transition-all"
                        >
                          {cleanCompanyName(comp)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subject Questions Pagination Bar */}
          <PaginationControl
            currentPage={subjectCurrentPage}
            totalPages={subjectTotalPages}
            totalItems={subjectTotalItems}
            itemsPerPage={subjectItemsPerPage}
            onPageChange={(p) => setSubjectCurrentPage(p)}
            onItemsPerPageChange={(val) => setSubjectItemsPerPage(val)}
            perPageOptions={[
              { value: '18', label: '18 questions' },
              { value: '36', label: '36 questions' },
              { value: '72', label: '72 questions' },
              { value: '9999', label: `Show All (${subjectTotalItems})` },
            ]}
            itemLabel="questions"
          />
        </div>
      )}

      {/* VIEW 3: COMPANY SUBJECT BREAKDOWN MATRIX */}
      {viewMode === 'subject_matrix' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Matrix Header & Search */}
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>Company Subject Question Breakdown Matrix</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {companySubjectMatrix?.length || 322} Companies Analyzed
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  View how many Operating System, DBMS, Networks, System Design, and DSA questions are asked by each company.
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={matrixSearchQuery}
                  onChange={(e) => setMatrixSearchQuery(e.target.value)}
                  placeholder="Search company in matrix (e.g. Amazon, Swiggy, DE Shaw)..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {matrixSearchQuery && (
                  <button onClick={() => setMatrixSearchQuery('')} className="absolute right-3 top-2 text-slate-400 text-xs">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Matrix Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedMatrixCompanies.map((item) => (
              <div
                key={item.company}
                className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                        {item.company[0]}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.company}</h3>
                        <span className="text-[11px] text-slate-400">{item.total_questions_extracted} Questions Extracted</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Breakdown Counts Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    {Object.entries(item.subject_breakdown || {}).map(([sName, sCount]) => {
                      if (!sCount || sCount === 0) return null;
                      return (
                        <div key={sName} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center justify-between">
                          <span className="text-[11px] font-medium truncate max-w-[110px]">{sName}:</span>
                          <strong className="font-bold text-xs text-amber-400">{sCount}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => openCompanyVault(item.company)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
                >
                  <span>Open Company Vault</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Matrix Bottom Pagination Bar */}
          <PaginationControl
            currentPage={matrixCurrentPage}
            totalPages={matrixTotalPages}
            totalItems={matrixTotalItems}
            itemsPerPage={matrixItemsPerPage}
            onPageChange={(p) => setMatrixCurrentPage(p)}
            onItemsPerPageChange={(val) => setMatrixItemsPerPage(val)}
            perPageOptions={[
              { value: '24', label: '24 companies' },
              { value: '48', label: '48 companies' },
              { value: '96', label: '96 companies' },
              { value: '9999', label: `Show All (${matrixTotalItems})` },
            ]}
            itemLabel="companies"
          />
        </div>
      )}

      {/* VIEW 4: INSIDE A DEDICATED COMPANY VAULT (e.g. Amazon, Microsoft) */}
      {(viewMode === 'company_vault' || viewMode === 'all_experiences') && (
        <div className="space-y-6 animate-fadeIn">
          {/* Company Vault Header & Tab Bar */}
          <div className="p-5 rounded-2xl bg-[#0F172A]/80 border border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedCompany && (
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-blue-500/20">
                    {selectedCompany[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <span>{selectedCompany ? `${selectedCompany} Interview Vault` : 'All Interview Experiences'}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {companyExperiences.length} Experiences
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedCompany 
                      ? `All verified experiences, coding questions, and rounds for ${selectedCompany} loaded right inside.`
                      : 'Showing flat view of experiences.'}
                  </p>
                </div>
              </div>

              {/* Sub-View Tabs inside Company Vault */}
              {selectedCompany && (
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setCompanyTab('experiences')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      companyTab === 'experiences'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Experiences ({companyExperiences.length})</span>
                  </button>
                  <button
                    onClick={() => setCompanyTab('questions')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      companyTab === 'questions'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ListCheck className="w-3.5 h-3.5" />
                    <span>Question Bank ({companyQuestionBank.length})</span>
                  </button>
                  <button
                    onClick={() => setCompanyTab('rounds')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      companyTab === 'rounds'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <PieChart className="w-3.5 h-3.5" />
                    <span>Rounds Stats</span>
                  </button>
                </div>
              )}
            </div>

            {/* Search & Sorting bar when viewing Experiences */}
            {companyTab === 'experiences' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={selectedCompany ? `Search in ${selectedCompany}...` : "Search questions or roles..."}
                    className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-slate-400 text-xs">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Year Filter */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-slate-400 font-medium">Year:</span>
                    <CustomDropdown
                      options={[
                        { value: 'all', label: 'All Years (2013-2024)' },
                        { value: '2024', label: '2024 Archives' },
                        { value: '2023', label: '2023 Archives' },
                        { value: '2022', label: '2022 Archives' },
                        { value: '2021', label: '2021 Archives' },
                        { value: '2020', label: '2020 Archives' },
                        { value: 'older', label: '2019 & Older' },
                      ]}
                      value={selectedYear}
                      onChange={(val) => {
                        setSelectedYear(val);
                        setCurrentPage(1);
                      }}
                      dropdownWidth="w-48"
                      alignRight={true}
                    />
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs text-slate-400 font-medium">Sort:</span>
                    <CustomDropdown
                      options={[
                        { value: 'newest', label: 'Newest First', icon: '📅' },
                        { value: 'oldest', label: 'Oldest First', icon: '⌛' },
                        { value: 'most_questions', label: 'Most Questions', icon: '🔥' },
                        { value: 'title_asc', label: 'Title A-Z', icon: '🔤' },
                      ]}
                      value={sortBy}
                      onChange={(val) => setSortBy(val)}
                      dropdownWidth="w-48"
                      alignRight={true}
                    />
                  </div>

                  {/* Per Page Items Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Show:</span>
                    <CustomDropdown
                      options={[
                        { value: '12', label: '12 per page' },
                        { value: '24', label: '24 per page' },
                        { value: '48', label: '48 per page' },
                        { value: '9999', label: `Show All (${totalItems})` },
                      ]}
                      value={String(itemsPerPage)}
                      onChange={(val) => {
                        setItemsPerPage(Number(val));
                        setCurrentPage(1);
                      }}
                      dropdownWidth="w-44"
                      alignRight={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: EXPERIENCES CARDS GRID */}
          {companyTab === 'experiences' && (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                  <p className="text-slate-400 text-sm font-medium">Loading interview experiences...</p>
                </div>
              ) : paginatedExperiences.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                  <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No experiences match your query</h3>
                  <p className="text-slate-400 text-xs max-w-md mx-auto">
                    Try clearing your search query or choosing another company.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedExperiences.map((exp) => {
                    const isSaved = savedExperienceIds.includes(exp.id);
                    const isExpanded = expandedExperienceId === exp.id;

                    return (
                      <div
                        key={exp.id}
                        className={`group relative flex flex-col justify-between rounded-2xl bg-[#0F172A]/90 border transition-all duration-300 shadow-lg ${
                          isExpanded
                            ? 'border-blue-500 bg-[#111A33] md:col-span-2 lg:col-span-3'
                            : 'border-slate-800 hover:border-blue-500/40 hover:bg-[#131C35]'
                        } p-5`}
                      >
                        <div className="space-y-3.5">
                          {/* Company & Role Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                                {exp.company[0]}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                                  {exp.company}
                                </span>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                  <Briefcase className="w-3 h-3 text-slate-500" />
                                  <span className="truncate max-w-[150px]">{exp.role}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => toggleSaveExperience(exp.id)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isSaved
                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                                }`}
                                title={isSaved ? 'Remove from Saved' : 'Save Experience'}
                              >
                                <Bookmark className="w-4 h-4 fill-current" />
                              </button>
                              <button
                                onClick={() => handleDeleteExperience(exp.id, exp.title)}
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                                title="Delete Experience"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                            {exp.title}
                          </h3>

                          {/* Published Date Badge */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80 w-fit">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <span>Published: <strong>{formatDate(exp.published_date)}</strong></span>
                          </div>

                          {/* Rounds Badges */}
                          {exp.rounds_identified.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {exp.rounds_identified.slice(0, 4).map((r, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1"
                                >
                                  <Layers className="w-2.5 h-2.5 text-purple-400" />
                                  <span>{r}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Extracted Questions Preview */}
                          {exp.extracted_questions.length > 0 && !isExpanded && (
                            <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-emerald-400" />
                                <span>Key Questions Asked:</span>
                              </div>
                              <ul className="space-y-1 text-xs text-slate-300">
                                {exp.extracted_questions.slice(0, 2).map((q, idx) => (
                                  <li key={idx} className="line-clamp-1 flex items-start gap-1.5">
                                    <span className="text-blue-400">•</span>
                                    <span>{cleanQuestionText(q)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* INLINE EXPANDED CONTENT */}
                          {isExpanded && (
                            <div className="pt-4 border-t border-slate-700/80 space-y-5 animate-fadeIn">
                              {/* Extracted Questions */}
                              {exp.extracted_questions.length > 0 && (
                                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Extracted Key Questions & Problems ({exp.extracted_questions.length})</span>
                                  </h4>
                                  <ul className="space-y-1.5 text-xs text-slate-200">
                                    {exp.extracted_questions.map((q, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>{cleanQuestionText(q)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Full Experience Content Text */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                  Full Experience Transcript:
                                </h4>
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                                  {exp.full_content}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer Card Actions */}
                        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                          <button
                            onClick={() => setExpandedExperienceId(isExpanded ? null : exp.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                              isExpanded
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                            }`}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                <span>Collapse View</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                <span>📖 Read Directly Inline</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setActiveModalExperience(exp)}
                            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                            title="Open Fullscreen Modal"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Pagination Bar */}
              {!loading && (
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(p) => handlePageChange(p)}
                  onItemsPerPageChange={(val) => {
                    setItemsPerPage(val);
                    setCurrentPage(1);
                  }}
                  perPageOptions={[
                    { value: '12', label: '12 experiences' },
                    { value: '24', label: '24 experiences' },
                    { value: '48', label: '48 experiences' },
                    { value: '9999', label: `Show All (${totalItems})` },
                  ]}
                  itemLabel="experiences"
                />
              )}
            </>
          )}

          {/* TAB 2: EXTRACTED QUESTION BANK FOR COMPANY */}
          {companyTab === 'questions' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ListCheck className="w-4 h-4 text-emerald-400" />
                    <span>All Extracted Questions Asked at {selectedCompany || 'Company'} ({companyQuestionBank.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">Unique coding & interview questions</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={questionSearchQuery}
                    onChange={(e) => setQuestionSearchQuery(e.target.value)}
                    placeholder={`Search within ${selectedCompany || 'company'} question bank (e.g. tree, DP, LRU, graph, behavioral)...`}
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {questionSearchQuery && (
                    <button onClick={() => setQuestionSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 text-xs">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Questions List Grid (3 Cards Per Row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {paginatedCompQuestions.map((item, idx) => {
                  const globalIdx = compQuestStartIndex + idx + 1;
                  const tag = getSubjectTag(item.question);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0F172A]/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {globalIdx}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tag.color}`}>
                              {tag.name}
                            </span>
                            <button
                              onClick={() => handleDeleteQuestion(item.question)}
                              className="p-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                          {cleanQuestionText(item.question)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                        <span className="truncate max-w-[200px] text-slate-400">{item.role}</span>
                        <span className="text-slate-500">{formatDate(item.date)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Company Questions Pagination Bar */}
              <PaginationControl
                currentPage={compQuestCurrentPage}
                totalPages={compQuestTotalPages}
                totalItems={compQuestTotalItems}
                itemsPerPage={compQuestItemsPerPage}
                onPageChange={(p) => setCompQuestCurrentPage(p)}
                onItemsPerPageChange={(val) => setCompQuestItemsPerPage(val)}
                perPageOptions={[
                  { value: '18', label: '18 questions' },
                  { value: '36', label: '36 questions' },
                  { value: '72', label: '72 questions' },
                  { value: '9999', label: `Show All (${compQuestTotalItems})` },
                ]}
                itemLabel="questions"
              />
            </div>
          )}

          {/* TAB 3: ROUNDS STATS FOR COMPANY */}
          {companyTab === 'rounds' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#0F172A]/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-400" />
                    <span>Interview Round Types Frequency for {selectedCompany}</span>
                  </h3>
                  <span className="text-xs text-slate-400">Based on {companyExperiences.length} experiences</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {companyRoundsStats.map(([roundName, count], idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{roundName}</h4>
                          <span className="text-[11px] text-slate-400">Interview Round</span>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs">
                        {count} times
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Experience Detail Modal */}
      {activeModalExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 uppercase">
                    {activeModalExperience.company}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(activeModalExperience.published_date)}</span>
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">{activeModalExperience.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Role: <strong>{activeModalExperience.role}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Exp: <strong>{activeModalExperience.experience_level}</strong></span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDeleteExperience(activeModalExperience.id, activeModalExperience.title)}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors flex items-center gap-1 text-xs font-medium"
                  title="Delete Experience"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
                <a
                  href={activeModalExperience.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">GFG Article</span>
                </a>
                <button
                  onClick={() => setActiveModalExperience(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-200">
              {/* Rounds Identified Section */}
              {activeModalExperience.rounds_identified.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Rounds Conducted</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalExperience.rounds_identified.map((r, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Questions Section */}
              {activeModalExperience.extracted_questions.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Extracted Key Questions & Problems</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {activeModalExperience.extracted_questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{cleanQuestionText(q)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Content Markdown Text */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                  Complete Experience & Transcript
                </h4>
                <div className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed font-normal">
                  {activeModalExperience.full_content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
