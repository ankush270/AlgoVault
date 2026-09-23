import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SheetFilters } from '../components/sheet/SheetFilters';

describe('SheetFilters Component UI Unit Tests', () => {
  const defaultProps = {
    searchQuery: '',
    setSearchQuery: vi.fn(),
    selectedTopicFilter: 'all',
    setSelectedTopicFilter: vi.fn(),
    selectedDifficulty: 'all',
    setSelectedDifficulty: vi.fn(),
    filterStatus: 'all',
    setFilterStatus: vi.fn(),
    totalProblemsCount: 450,
    totalTopicsCount: 28,
    expandAllTopics: vi.fn(),
    collapseAllTopics: vi.fn(),
  };

  it('renders search input and dropdown filter triggers correctly', () => {
    render(<SheetFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search 450 problems/i)).toBeInTheDocument();
    expect(screen.getByText(/all topics \(28\)/i)).toBeInTheDocument();
    expect(screen.getByText(/all difficulties/i)).toBeInTheDocument();
    expect(screen.getByText(/all status/i)).toBeInTheDocument();
  });

  it('handles typing search query in input field', () => {
    const setSearchQuery = vi.fn();
    render(<SheetFilters {...defaultProps} setSearchQuery={setSearchQuery} />);

    const searchInput = screen.getByPlaceholderText(/search 450 problems/i);
    fireEvent.change(searchInput, { target: { value: 'Two Sum' } });

    expect(setSearchQuery).toHaveBeenCalledWith('Two Sum');
  });

  it('opens Topic dropdown filter when clicked', () => {
    render(<SheetFilters {...defaultProps} />);

    const topicTrigger = screen.getByText(/all topics \(28\)/i);
    fireEvent.click(topicTrigger);

    // Dropdown list should show topic categories
    const topicElements = screen.getAllByText(/arrays & matrix/i);
    expect(topicElements.length).toBeGreaterThan(0);
    expect(topicElements[0]).toBeInTheDocument();
  });

  it('opens Difficulty dropdown filter when clicked', () => {
    render(<SheetFilters {...defaultProps} />);

    const diffTrigger = screen.getByText(/all difficulties/i);
    fireEvent.click(diffTrigger);

    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('triggers expandAllTopics and collapseAllTopics buttons', () => {
    const expandAllTopics = vi.fn();
    const collapseAllTopics = vi.fn();

    render(
      <SheetFilters
        {...defaultProps}
        expandAllTopics={expandAllTopics}
        collapseAllTopics={collapseAllTopics}
      />
    );

    const expandBtn = screen.getByTitle('Expand All Topic Categories');
    const collapseBtn = screen.getByTitle('Collapse All Topic Categories');

    fireEvent.click(expandBtn);
    expect(expandAllTopics).toHaveBeenCalledTimes(1);

    fireEvent.click(collapseBtn);
    expect(collapseAllTopics).toHaveBeenCalledTimes(1);
  });
});
