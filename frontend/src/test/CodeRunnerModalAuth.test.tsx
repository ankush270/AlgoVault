import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CodeRunnerModal } from '../components/common/CodeRunnerModal';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Monaco Editor for test environment
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="mock-monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

// Mock codeExecutionService
const mockExecuteCode = vi.fn();
vi.mock('../services/codeExecutionService', async () => {
  const actual = await vi.importActual<any>('../services/codeExecutionService');
  return {
    ...actual,
    executeCode: (...args: any[]) => mockExecuteCode(...args),
  };
});

// Mock aiReviewService
vi.mock('../services/aiReviewService', () => ({
  analyzeCodeWithAI: vi.fn(),
}));

describe('CodeRunnerModal Guest Experience & 401 Auth CTA Tests', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <BrowserRouter>
        <CodeRunnerModal isOpen={false} onClose={mockOnClose} />
      </BrowserRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal header and code runner interface when isOpen is true', () => {
    render(
      <BrowserRouter>
        <CodeRunnerModal
          isOpen={true}
          onClose={mockOnClose}
          problemTitle="Two Sum Sandbox"
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Two Sum Sandbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run Code/i })).toBeInTheDocument();
  });

  it('displays the "Sign In to Run Code" CTA banner when backend returns 401 unauthenticated response', async () => {
    mockExecuteCode.mockResolvedValueOnce({
      output: '',
      stderr: '🔒 Please log in to run code.',
      status: 'ERROR',
      executionTime: 0,
      memory: 0,
      isUnauthorized: true,
    });

    render(
      <BrowserRouter>
        <CodeRunnerModal
          isOpen={true}
          onClose={mockOnClose}
          problemTitle="Binary Search Test"
        />
      </BrowserRouter>
    );

    const runBtn = screen.getByRole('button', { name: /Run Code/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Cloud code sandbox execution requires an active session/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Run Code/i })).toBeInTheDocument();
    expect(screen.getByTestId('login-cta-btn')).toBeInTheDocument();
  });

  it('navigates to /login and closes modal when "Sign In to Run Code" button is clicked', async () => {
    mockExecuteCode.mockResolvedValueOnce({
      output: '',
      stderr: '🔒 Please log in to run code.',
      status: 'ERROR',
      executionTime: 0,
      memory: 0,
      isUnauthorized: true,
    });

    render(
      <BrowserRouter>
        <CodeRunnerModal
          isOpen={true}
          onClose={mockOnClose}
        />
      </BrowserRouter>
    );

    const runBtn = screen.getByRole('button', { name: /Run Code/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByTestId('login-cta-btn')).toBeInTheDocument();
    });

    const ctaBtn = screen.getByTestId('login-cta-btn');
    fireEvent.click(ctaBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does NOT display sign-in CTA banner when code execution succeeds', async () => {
    mockExecuteCode.mockResolvedValueOnce({
      output: 'AlgoVault Python Runner Ready!\n',
      stderr: '',
      status: 'SUCCESS',
      executionTime: 42,
      memory: 10240,
      isUnauthorized: false,
    });

    render(
      <BrowserRouter>
        <CodeRunnerModal
          isOpen={true}
          onClose={mockOnClose}
        />
      </BrowserRouter>
    );

    const runBtn = screen.getByRole('button', { name: /Run Code/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });

    expect(screen.getByText('AlgoVault Python Runner Ready!')).toBeInTheDocument();
    expect(screen.queryByTestId('login-cta-btn')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Sign In to Run Code/i })).not.toBeInTheDocument();
  });

  it('displays the sign-in CTA banner when execution throws an unauthenticated error', async () => {
    mockExecuteCode.mockRejectedValueOnce({
      status: 401,
      message: 'Unauthorized: Please log in to run code on cloud sandbox',
    });

    render(
      <BrowserRouter>
        <CodeRunnerModal
          isOpen={true}
          onClose={mockOnClose}
        />
      </BrowserRouter>
    );

    const runBtn = screen.getByRole('button', { name: /Run Code/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByTestId('login-cta-btn')).toBeInTheDocument();
    });

    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Run Code/i })).toBeInTheDocument();
  });
});
