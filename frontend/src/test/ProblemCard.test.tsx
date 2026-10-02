import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProblemCard } from '../components/sheet/ProblemCard';
import { StriverProblem } from '../components/sheet/types';

const mockToggleStar = vi.fn();
const mockSaveNote = vi.fn();
let mockProgress = {
  statuses: {},
  starred: {} as Record<string, boolean>,
  notes: {} as Record<string, string>,
  revisions: {},
  activeAlgorithm: 'smart-adaptive' as const,
  streak: 1,
  lastActiveDate: '2026-10-02',
  dailyGoal: 3,
  todayCompletedCount: 0,
  completedDates: ['2026-10-02'],
};

vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({
    progress: mockProgress,
    toggleStar: mockToggleStar,
    saveNote: mockSaveNote,
  }),
}));

describe('ProblemCard Star Mark and Revision Notes Tests', () => {
  const sampleProblem: StriverProblem = {
    id: 'two-sum-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    striver_level: 'Basic',
    url: 'https://leetcode.com/problems/two-sum/',
    tags: ['Array', 'Hash Table'],
    source: 'Striver',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockProgress = {
      statuses: {},
      starred: {},
      notes: {},
      revisions: {},
      activeAlgorithm: 'smart-adaptive',
      streak: 1,
      lastActiveDate: '2026-10-02',
      dailyGoal: 3,
      todayCompletedCount: 0,
      completedDates: ['2026-10-02'],
    };
  });

  it('renders problem title, difficulty, badges, and action buttons', () => {
    const toggleSolved = vi.fn();
    render(<ProblemCard prob={sampleProblem} isDone={false} toggleSolved={toggleSolved} />);

    expect(screen.getByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('⚡ Striver')).toBeInTheDocument();
    expect(screen.getByTitle(/star mark for revision/i)).toBeInTheDocument();
    expect(screen.getByTitle(/write revision note/i)).toBeInTheDocument();
  });

  it('toggles star mark when clicking the star icon button', () => {
    const toggleSolved = vi.fn();
    render(<ProblemCard prob={sampleProblem} isDone={false} toggleSolved={toggleSolved} />);

    const starBtn = screen.getByTitle(/star mark for revision/i);
    fireEvent.click(starBtn);

    expect(mockToggleStar).toHaveBeenCalledWith('two-sum-1');
  });

  it('opens QuestionNotesModal, inserts template, and saves personal note', () => {
    const toggleSolved = vi.fn();
    render(<ProblemCard prob={sampleProblem} isDone={false} toggleSolved={toggleSolved} />);

    const notesBtn = screen.getByTitle(/write revision note/i);
    fireEvent.click(notesBtn);

    // Modal should be visible with problem title
    expect(screen.getByText(/quick revision templates/i)).toBeInTheDocument();

    const intuitionBtn = screen.getByRole('button', { name: /intuition/i });
    fireEvent.click(intuitionBtn);

    const textarea = screen.getByPlaceholderText(/write personal revision notes/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Key Intuition & Approach');

    const saveBtn = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveBtn);

    expect(mockSaveNote).toHaveBeenCalledWith('two-sum-1', expect.stringContaining('Key Intuition & Approach'));
  });

  it('renders inline note preview when personal note exists', () => {
    mockProgress.notes['two-sum-1'] = 'Use hash map for complement lookup in O(N) time';
    const toggleSolved = vi.fn();
    render(<ProblemCard prob={sampleProblem} isDone={false} toggleSolved={toggleSolved} />);

    expect(screen.getByText(/personal revision note/i)).toBeInTheDocument();
    expect(screen.getByText(/use hash map for complement lookup in o\(n\) time/i)).toBeInTheDocument();
  });
});
