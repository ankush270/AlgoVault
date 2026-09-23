import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotesModal } from '../components/NotesModal';

const mockSaveNote = vi.fn();
const mockProgressObj = { completed: [], bookmarks: [], notes: { 'os-1': 'Key memory management notes' } };

vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({
    progress: mockProgressObj,
    saveNote: mockSaveNote,
  }),
}));

describe('NotesModal Component UI Unit Tests', () => {
  const defaultProps = {
    topicId: 'os-1',
    topicTitle: 'Operating Systems Basics',
    onClose: vi.fn(),
  };

  it('renders existing note text when topicId is provided', () => {
    render(<NotesModal {...defaultProps} />);
    expect(screen.getByText('Operating Systems Basics')).toBeInTheDocument();
    
    const textarea = screen.getByPlaceholderText(/write down personal notes/i);
    expect(textarea).toHaveValue('Key memory management notes');
  });

  it('handles typing inside textarea and clicking Save Note button', () => {
    render(<NotesModal {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/write down personal notes/i);
    fireEvent.change(textarea, { target: { value: 'Updated OS deadlock prevention notes' } });

    const saveBtn = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveBtn);

    expect(mockSaveNote).toHaveBeenCalledWith('os-1', 'Updated OS deadlock prevention notes');
    expect(screen.getByText(/saved to local storage/i)).toBeInTheDocument();
  });

  it('handles close button click', () => {
    const onClose = vi.fn();
    render(<NotesModal {...defaultProps} onClose={onClose} />);

    const closeBtn = screen.getAllByRole('button')[0];
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders all notes list view when topicId is null', () => {
    render(<NotesModal topicId={null} onClose={vi.fn()} />);

    expect(screen.getByText(/my study notes & code snippets/i)).toBeInTheDocument();
    expect(screen.getByText('SAVED NOTES')).toBeInTheDocument();
  });
});
