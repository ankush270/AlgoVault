import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { getPathForState, parseCurrentRoute } from '../utils/routing';
import { NotFoundPage } from '../components/common/NotFoundPage';

describe('Routing and State Synchronization Tests', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  describe('getPathForState mapping', () => {
    it('correctly maps live-arena, system-design-canvas, system-design-hub, and pdf-readiness to persistent routes', () => {
      expect(getPathForState('live-arena')).toBe('/live-arena');
      expect(getPathForState('system-design-canvas')).toBe('/system-design-canvas');
      expect(getPathForState('system-design-hub')).toBe('/system-design-hub');
      expect(getPathForState('pdf-readiness')).toBe('/pdf-readiness');
    });

    it('correctly appends topicId query parameter for sharable links', () => {
      expect(getPathForState('knowledge', 'os', 'proc-scheduling')).toBe('/os?topic=proc-scheduling');
      expect(getPathForState('striver-a2z', 'all', 'two-sum-1')).toBe('/striver-a2z?topic=two-sum-1');
      expect(getPathForState('dashboard', 'all', 'os-virtual-memory')).toBe('/?topic=os-virtual-memory');
    });
  });

  describe('parseCurrentRoute logic', () => {
    it('parses valid tab routes correctly', () => {
      expect(parseCurrentRoute('/live-arena').tab).toBe('live-arena');
      expect(parseCurrentRoute('/system-design-canvas').tab).toBe('system-design-canvas');
      expect(parseCurrentRoute('/system-design-hub').tab).toBe('system-design-hub');
      expect(parseCurrentRoute('/pdf-readiness').tab).toBe('pdf-readiness');
    });

    it('parses topic query param correctly for sharable links', () => {
      const parsed = parseCurrentRoute('/os', '?topic=os-os-goals');
      expect(parsed.tab).toBe('knowledge');
      expect(parsed.domain).toBe('os');
      expect(parsed.topic).not.toBeNull();
      expect(parsed.topic?.id).toBe('os-os-goals');
    });

    it('marks unrecognized routes as 404', () => {
      const parsed = parseCurrentRoute('/some-nonexistent-random-route');
      expect(parsed.tab).toBe('404');
      expect(parsed.isNotFound).toBe(true);
      expect(parsed.notFoundPath).toBe('/some-nonexistent-random-route');
    });
  });

  describe('NotFoundPage Component', () => {
    it('renders 404 page with the invalid path and navigation buttons', () => {
      const mockNavigate = vi.fn();
      const mockSearch = vi.fn();

      render(
        <NotFoundPage
          currentPath="/invalid-secret-page"
          onNavigate={mockNavigate}
          onSearch={mockSearch}
        />
      );

      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
      expect(screen.getByText('/invalid-secret-page')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
      expect(mockNavigate).toHaveBeenCalledWith('dashboard');
    });

    it('supports quick search from the 404 page', () => {
      const mockNavigate = vi.fn();
      const mockSearch = vi.fn();

      render(
        <NotFoundPage
          currentPath="/unknown"
          onNavigate={mockNavigate}
          onSearch={mockSearch}
        />
      );

      const input = screen.getByPlaceholderText(/search concepts/i);
      fireEvent.change(input, { target: { value: 'Deadlock' } });
      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));

      expect(mockSearch).toHaveBeenCalledWith('Deadlock');
      expect(mockNavigate).toHaveBeenCalledWith('knowledge', 'all');
    });

    it('triggers onBack when Go Previous button is clicked', () => {
      const mockNavigate = vi.fn();
      const mockSearch = vi.fn();
      const mockBack = vi.fn();

      render(
        <NotFoundPage
          currentPath="/missing-page"
          onNavigate={mockNavigate}
          onSearch={mockSearch}
          onBack={mockBack}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /go previous/i }));
      expect(mockBack).toHaveBeenCalled();
    });
  });
});
