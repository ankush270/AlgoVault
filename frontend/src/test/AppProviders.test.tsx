import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppProviders } from '../context/AppProviders';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const TestConsumer: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { progress } = useProgress();

  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Guest'}</span>
      <span data-testid="user-email">{user?.email || 'none'}</span>
      <span data-testid="progress-algorithm">{progress.activeAlgorithm}</span>
    </div>
  );
};

describe('AppProviders Architecture & Unified Hierarchy', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly provides both useAuth and useProgress to child components in unified tree', () => {
    render(
      <AppProviders>
        <TestConsumer />
      </AppProviders>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('Guest');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
    expect(screen.getByTestId('progress-algorithm').textContent).toBe('smart-adaptive');
  });

  it('gracefully handles corrupted localStorage JSON without crashing AuthProvider', () => {
    localStorage.setItem('techswitch_user', 'invalid-json-syntax{{{');
    
    render(
      <AppProviders>
        <TestConsumer />
      </AppProviders>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('Guest');
    expect(screen.getByTestId('user-email').textContent).toBe('none');
  });
});
