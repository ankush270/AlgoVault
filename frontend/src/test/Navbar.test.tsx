import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../components/Navbar';

// Mock contexts and hooks
vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({
    progress: { completed: [], bookmarks: [], notes: {} },
    exportProgressJSON: vi.fn(),
    importProgressJSON: vi.fn(),
  }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

vi.mock('../hooks/useMongoSync', () => ({
  useMongoSync: () => ({
    mongoUserKey: '',
    setMongoUserKey: vi.fn(),
    isSyncing: false,
    showSyncModal: false,
    setShowSyncModal: vi.fn(),
    syncSuccessMsg: '',
    handleMongoPush: vi.fn(),
    handleMongoPull: vi.fn(),
  }),
}));

describe('Navbar Component UI Unit Tests', () => {
  const defaultProps = {
    searchQuery: '',
    setSearchQuery: vi.fn(),
    mobileMenuOpen: false,
    setMobileMenuOpen: vi.fn(),
    activeTab: 'dashboard',
    setActiveTab: vi.fn(),
    onOpenAuth: vi.fn(),
  };

  it('renders logo and search input', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByAltText(/DevForge Logo|AlgoVault Logo|TechSwitch Logo/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search topics, questions, tags/i)
    ).toBeInTheDocument();
  });

  it('handles typing in search bar and clearing text button click', () => {
    const setSearchQuery = vi.fn();
    render(
      <Navbar {...defaultProps} searchQuery="binary tree" setSearchQuery={setSearchQuery} />
    );

    const searchInput = screen.getByPlaceholderText(/search topics, questions, tags/i);
    expect(searchInput).toHaveValue('binary tree');

    fireEvent.change(searchInput, { target: { value: 'graphs' } });
    expect(setSearchQuery).toHaveBeenCalledWith('graphs');

    // Click clear button
    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);
    expect(setSearchQuery).toHaveBeenCalledWith('');
  });

  it('handles mobile menu toggle button click', () => {
    const setMobileMenuOpen = vi.fn();
    render(<Navbar {...defaultProps} mobileMenuOpen={false} setMobileMenuOpen={setMobileMenuOpen} />);

    // Mobile menu button is the first button in header left
    const buttons = screen.getAllByRole('button');
    const mobileMenuBtn = buttons[0];
    fireEvent.click(mobileMenuBtn);

    expect(setMobileMenuOpen).toHaveBeenCalledWith(true);
  });

  it('handles sign in button click to trigger authentication modal', () => {
    const onOpenAuth = vi.fn();
    render(<Navbar {...defaultProps} onOpenAuth={onOpenAuth} />);

    const signInBtn = screen.getByRole('button', { name: /sign in \/ register/i });
    fireEvent.click(signInBtn);

    expect(onOpenAuth).toHaveBeenCalledWith('login');
  });

  it('handles brand logo click to navigate to dashboard', () => {
    const setActiveTab = vi.fn();
    render(<Navbar {...defaultProps} setActiveTab={setActiveTab} />);

    const logoContainer = screen.getByAltText(/DevForge Logo|AlgoVault Logo|TechSwitch Logo/i).closest('div');
    if (logoContainer) {
      fireEvent.click(logoContainer);
      expect(setActiveTab).toHaveBeenCalledWith('dashboard');
    }
  });

  it('switches to knowledge tab when typing search on non-searchable tabs', () => {
    const setActiveTab = vi.fn();
    const setSearchQuery = vi.fn();
    render(
      <Navbar
        {...defaultProps}
        activeTab="dashboard"
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
      />
    );

    const input = screen.getByPlaceholderText(/search topics, questions, tags/i);
    fireEvent.change(input, { target: { value: 'react hooks' } });

    expect(setSearchQuery).toHaveBeenCalledWith('react hooks');
    expect(setActiveTab).toHaveBeenCalledWith('knowledge');
  });

  it('does NOT switch tab away when typing search on searchable tabs like jobs or striver', () => {
    const setActiveTab = vi.fn();
    const setSearchQuery = vi.fn();
    render(
      <Navbar
        {...defaultProps}
        activeTab="jobs"
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
      />
    );

    const input = screen.getByPlaceholderText(/search jobs by role, company, skills/i);
    fireEvent.change(input, { target: { value: 'frontend' } });

    expect(setSearchQuery).toHaveBeenCalledWith('frontend');
    expect(setActiveTab).not.toHaveBeenCalled();
  });

  it('toggles mobile search bar when mobile search button is clicked', () => {
    render(<Navbar {...defaultProps} activeTab="striver-a2z" />);

    const toggleBtn = screen.getByRole('button', { name: /toggle mobile search/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click toggle to open mobile search
    fireEvent.click(toggleBtn);

    // Mobile search input should now be visible with striver placeholder
    const mobileInputs = screen.getAllByPlaceholderText(/search striver dsa sheet/i);
    expect(mobileInputs.length).toBeGreaterThanOrEqual(1);

    // Close button should be present
    const closeBtn = screen.getByRole('button', { name: /close mobile search/i });
    fireEvent.click(closeBtn);
  });
});
