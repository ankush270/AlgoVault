import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopicDetailModal } from '../components/TopicDetailModal';
import { TopicItem } from '../types';

const mockToggleStar = vi.fn();
const mockUpdateStatus = vi.fn();
const mockSaveNote = vi.fn();

vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({
    progress: { completed: [], bookmarks: [], notes: {}, starred: {}, statuses: {} },
    toggleStar: mockToggleStar,
    updateStatus: mockUpdateStatus,
    saveNote: mockSaveNote,
    getRevisionRecord: () => null,
  }),
}));

const mockTopic: TopicItem = {
  id: 'os-cpu-scheduling',
  title: 'CPU Scheduling Algorithms',
  domain: 'os',
  category: 'Process Management',
  difficulty: 'Medium',
  summary: 'Deep-dive into FCFS, SJF, Round Robin, and Multi-level Queue scheduling.',
  detailedContent: '# CPU Scheduling\nProcess scheduling algorithms.',
  companyTags: ['Google', 'Meta'],
  keyConcepts: ['Preemptive', 'Non-preemptive'],
  importanceRating: 5,
  codeTemplates: [
    { language: 'cpp', code: '// C++ Implementation of Round Robin' },
    { language: 'python', code: '# Python Implementation of Round Robin' },
  ],
  interviewQuestions: [
    {
      question: 'What is Convoy Effect?',
      answer: 'Convoy effect occurs when long process holds CPU and short processes wait.',
    },
  ],
};

describe('TopicDetailModal Component UI Unit Tests', () => {
  const defaultProps = {
    topic: mockTopic,
    onClose: vi.fn(),
    onOpenNote: vi.fn(),
  };

  it('does not render when topic is null', () => {
    const { container } = render(<TopicDetailModal topic={null} onClose={vi.fn()} onOpenNote={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders topic title and summary when topic is provided', () => {
    render(<TopicDetailModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'CPU Scheduling Algorithms' })).toBeInTheDocument();
  });

  it('triggers star topic button click', () => {
    render(<TopicDetailModal {...defaultProps} />);

    const starBtn = screen.getByTitle('Star Topic');
    fireEvent.click(starBtn);

    expect(mockToggleStar).toHaveBeenCalledWith('os-cpu-scheduling');
  });

  it('triggers status change buttons click', () => {
    render(<TopicDetailModal {...defaultProps} />);

    const masteredBtn = screen.getByRole('button', { name: 'mastered' });
    fireEvent.click(masteredBtn);

    expect(mockUpdateStatus).toHaveBeenCalledWith('os-cpu-scheduling', 'mastered');
  });

  it('switches navigation tabs inside the modal (Code Templates, Q&A, Study Guide)', () => {
    render(<TopicDetailModal {...defaultProps} />);

    const codeTab = screen.getByRole('button', { name: /code templates \(2\)/i });
    fireEvent.click(codeTab);
    expect(screen.getByText('// C++ Implementation of Round Robin')).toBeInTheDocument();

    const quizTab = screen.getByRole('button', { name: /interview q&a \(1\)/i });
    fireEvent.click(quizTab);
    expect(screen.getByText('What is Convoy Effect?')).toBeInTheDocument();
  });

  it('triggers personal note button click', () => {
    const onOpenNote = vi.fn();
    render(<TopicDetailModal {...defaultProps} onOpenNote={onOpenNote} />);

    const noteBtn = screen.getByRole('button', { name: /add note/i });
    fireEvent.click(noteBtn);

    expect(onOpenNote).toHaveBeenCalledWith('os-cpu-scheduling', 'CPU Scheduling Algorithms');
  });

  it('opens in-modal note editor, enters text, and saves note', () => {
    render(<TopicDetailModal {...defaultProps} />);

    // Click on Notes & Edit tab
    const editTab = screen.getByRole('button', { name: /notes & edit/i });
    fireEvent.click(editTab);

    // Textarea should be visible
    const textarea = screen.getByPlaceholderText(/type your notes, code snippets/i);
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'My custom scheduling note #important' } });

    // Click Save button
    const saveBtns = screen.getAllByRole('button', { name: /save notes/i });
    fireEvent.click(saveBtns[0]);

    expect(mockSaveNote).toHaveBeenCalledWith('os-cpu-scheduling', 'My custom scheduling note #important');
  });
});
