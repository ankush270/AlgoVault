import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AIChatbot } from '../components/common/AIChatbot';
import { apiChat } from '../services/api';
import { analyzeCodeWithAI } from '../services/aiReviewService';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock apiChat
vi.mock('../services/api', () => ({
  apiChat: {
    sendMessage: vi.fn(),
  },
  getBackendBaseUrl: () => 'http://localhost:5000',
}));

// Mock useAuth
let mockAuth = {
  user: null as any,
  token: null as string | null,
  isAuthenticated: false,
};

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

describe('AIChatbot & Code Review Unauthenticated 401 Handling Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockAuth = {
      user: null,
      token: null,
      isAuthenticated: false,
    };

    // Mock global fetch for config loading
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('chatbot_config.json')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              welcomeMessage: 'Welcome to DevForge AI Assistant!',
              suggestions: ['Explain QuickSort vs MergeSort'],
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }) as any;
  });

  it('renders unauthenticated prompt when user sends message without being logged in', async () => {
    render(
      <BrowserRouter>
        <AIChatbot />
      </BrowserRouter>
    );

    // Open chat
    const openBtn = screen.getByTitle('Open AI Assistant');
    fireEvent.click(openBtn);

    // Verify input exists
    const input = screen.getByPlaceholderText(/Ask Sarvam AI/i);
    fireEvent.change(input, { target: { value: 'Explain Binary Search' } });

    // Click send
    const sendBtn = screen.getByTitle('Send Message');
    fireEvent.click(sendBtn);

    // Verify apiChat.sendMessage was NOT called
    expect(apiChat.sendMessage).not.toHaveBeenCalled();

    // Verify friendly prompt is displayed instead of error
    await waitFor(() => {
      expect(
        screen.getByText(/Please log in or register to chat with (?:DevForge|AlgoVault) AI Tutor/i)
      ).toBeInTheDocument();
    });

    // Verify login button is present
    const loginBtn = screen.getByRole('button', { name: /Log In \/ Register/i });
    expect(loginBtn).toBeInTheDocument();

    // Click login button
    fireEvent.click(loginBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('displays friendly auth prompt if backend returns 401 or token error', async () => {
    // User has a token in state
    mockAuth = {
      user: { name: 'Test User', email: 'test@example.com' },
      token: 'expired-token',
      isAuthenticated: true,
    };
    localStorage.setItem('techswitch_token', 'expired-token');

    // Backend returns 401 Unauthorized
    vi.mocked(apiChat.sendMessage).mockResolvedValueOnce({
      success: false,
      status: 401,
      message: 'Access denied. No token provided.',
    });

    render(
      <BrowserRouter>
        <AIChatbot />
      </BrowserRouter>
    );

    // Open chat
    fireEvent.click(screen.getByTitle('Open AI Assistant'));
    await screen.findByText(/Welcome to (?:DevForge|AlgoVault) AI Assistant!/);

    // Send message
    const input = screen.getByPlaceholderText(/Ask Sarvam AI/i);
    fireEvent.change(input, { target: { value: 'What is memoization?' } });
    fireEvent.click(screen.getByTitle('Send Message'));

    await waitFor(() => {
      expect(apiChat.sendMessage).toHaveBeenCalled();
    });

    // Verify friendly auth prompt is shown, NOT "Could not connect to Sarvam AI"
    await waitFor(() => {
      expect(
        screen.getByText(/Please log in or register to chat with (?:DevForge|AlgoVault) AI Tutor/i)
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/Could not connect to Sarvam AI/i)
    ).not.toBeInTheDocument();
  });

  it('successfully replies when user is authenticated and backend succeeds', async () => {
    mockAuth = {
      user: { name: 'Valid User', email: 'valid@example.com' },
      token: 'valid-jwt-token',
      isAuthenticated: true,
    };
    localStorage.setItem('techswitch_token', 'valid-jwt-token');

    vi.mocked(apiChat.sendMessage).mockResolvedValueOnce({
      success: true,
      reply: 'Binary search runs in O(log N) time complexity.',
    });

    render(
      <BrowserRouter>
        <AIChatbot />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTitle('Open AI Assistant'));
    await screen.findByText(/Welcome to (?:DevForge|AlgoVault) AI Assistant!/);

    const input = screen.getByPlaceholderText(/Ask Sarvam AI/i);
    fireEvent.change(input, { target: { value: 'Explain Binary Search complexity' } });
    fireEvent.click(screen.getByTitle('Send Message'));

    await waitFor(() => {
      expect(
        screen.getByText('Binary search runs in O(log N) time complexity.')
      ).toBeInTheDocument();
    });
  });

  it('analyzeCodeWithAI returns offline estimation and isUnauthenticated flag when no token exists', async () => {
    localStorage.removeItem('techswitch_token');

    const result = await analyzeCodeWithAI('def foo(): pass', 'python');

    expect(result.isUnauthenticated).toBe(true);
    expect(result.timeComplexity).toBe('O(N)');
    expect(result.spaceComplexity).toBe('O(1)');
    expect(result.suggestions[0]).toContain('Authentication Required');
  });
});
