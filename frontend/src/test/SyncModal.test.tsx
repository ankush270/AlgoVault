import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SyncModal } from '../features/sync/components/SyncModal';

describe('SyncModal Authentication & UX Behavior', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    isSyncing: false,
    onMongoPush: vi.fn(),
    onMongoPull: vi.fn(),
    onExportJSON: vi.fn(),
    onImportJSON: vi.fn(() => true),
    syncSuccessMsg: '',
  };

  it('renders authentication banner when user is not authenticated', () => {
    render(<SyncModal {...defaultProps} isAuthenticated={false} />);

    expect(screen.getByText(/Authentication Required/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In to Enable Cloud Sync/i)).toBeInTheDocument();
    expect(screen.getByText(/Create a Free Account/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/e\.g\. ankush-sync-2026/i)).not.toBeInTheDocument();
  });

  it('triggers onOpenAuth when unauthenticated user clicks Sign In', () => {
    const onOpenAuth = vi.fn();
    const onClose = vi.fn();
    render(<SyncModal {...defaultProps} isAuthenticated={false} onOpenAuth={onOpenAuth} onClose={onClose} />);

    fireEvent.click(screen.getByText(/Sign In to Enable Cloud Sync/i));
    expect(onOpenAuth).toHaveBeenCalledWith('login');
    expect(onClose).toHaveBeenCalled();
  });

  it('renders account information and push/pull buttons when authenticated', () => {
    render(
      <SyncModal
        {...defaultProps}
        isAuthenticated={true}
        userEmail="engineer@example.com"
      />
    );

    expect(screen.getByText(/Signed-In Account/i)).toBeInTheDocument();
    expect(screen.getByText('engineer@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Sync Active/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Push to Cloud/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pull from Cloud/i })).toBeInTheDocument();
  });

  it('triggers onMongoPush and onMongoPull when authenticated user clicks buttons', () => {
    const onMongoPush = vi.fn();
    const onMongoPull = vi.fn();
    render(
      <SyncModal
        {...defaultProps}
        isAuthenticated={true}
        userEmail="engineer@example.com"
        onMongoPush={onMongoPush}
        onMongoPull={onMongoPull}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Push to Cloud/i }));
    expect(onMongoPush).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Pull from Cloud/i }));
    expect(onMongoPull).toHaveBeenCalled();
  });

  it('allows switching to JSON File Backup tab', () => {
    render(<SyncModal {...defaultProps} isAuthenticated={false} />);

    fireEvent.click(screen.getByRole('button', { name: /💾 JSON File Backup/i }));
    expect(screen.getByText(/Export Progress JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/Import Backup File/i)).toBeInTheDocument();
  });
});
