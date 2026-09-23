import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../components/Sidebar';

describe('Sidebar Component UI Unit Tests', () => {
  const defaultProps = {
    activeTab: 'dashboard',
    setActiveTab: vi.fn(),
    selectedDomain: 'all' as const,
    setSelectedDomain: vi.fn(),
    mobileMenuOpen: false,
    setMobileMenuOpen: vi.fn(),
  };

  it('renders core section navigation items correctly', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Operating Systems')).toBeInTheDocument();
    expect(screen.getByText('OOPs & LLD')).toBeInTheDocument();
    expect(screen.getByText('DBMS & SQL')).toBeInTheDocument();
    expect(screen.getByText('Computer Networks')).toBeInTheDocument();
  });

  it('handles clicking on a domain button to change tab and domain', () => {
    const setActiveTab = vi.fn();
    const setSelectedDomain = vi.fn();
    const setMobileMenuOpen = vi.fn();

    render(
      <Sidebar
        {...defaultProps}
        setActiveTab={setActiveTab}
        setSelectedDomain={setSelectedDomain}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    );

    const dbmsButton = screen.getByText('DBMS & SQL');
    fireEvent.click(dbmsButton);

    expect(setSelectedDomain).toHaveBeenCalledWith('dbms-sql');
    expect(setActiveTab).toHaveBeenCalledWith('knowledge');
    expect(setMobileMenuOpen).toHaveBeenCalledWith(false);
  });

  it('toggles collapsible category sections when header button is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    const coreCSHeader = screen.getByText('Core CS Subjects');
    expect(screen.getByText('Operating Systems')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(coreCSHeader);
    expect(screen.queryByText('Operating Systems')).not.toBeInTheDocument();

    // Click to expand back
    fireEvent.click(coreCSHeader);
    expect(screen.getByText('Operating Systems')).toBeInTheDocument();
  });

  it('handles clicking navigation tools like Revision List and DSA Sheet', () => {
    const setActiveTab = vi.fn();
    render(<Sidebar {...defaultProps} setActiveTab={setActiveTab} />);

    const dsaSheetBtn = screen.getByText('DSA Sheet');
    fireEvent.click(dsaSheetBtn);
    expect(setActiveTab).toHaveBeenCalledWith('striver-a2z');

    const revisionListBtn = screen.getByText('Spaced Revision List');
    fireEvent.click(revisionListBtn);
    expect(setActiveTab).toHaveBeenCalledWith('revision');
  });
});
