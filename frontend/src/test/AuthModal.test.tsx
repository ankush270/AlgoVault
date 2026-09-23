import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthModal } from '../components/AuthModal';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

vi.mock('../services/authService', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

describe('AuthModal Component UI Unit Tests', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccessSync: vi.fn(),
    initialTab: 'login' as const,
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(<AuthModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders sign in tab by default with email and password fields', () => {
    render(<AuthModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it('switches to Sign Up tab when Create Account button is clicked', () => {
    render(<AuthModal {...defaultProps} />);

    const createAccountTab = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountTab);

    expect(screen.getByPlaceholderText(/e\.g\. ankush kumar/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /create pro account/i })).toBeInTheDocument();
  });

  it('updates form fields on user typing', () => {
    render(<AuthModal {...defaultProps} initialTab="signup" />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. ankush kumar/i);
    const emailInput = screen.getByPlaceholderText(/name@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(nameInput, { target: { value: 'Alex Morgan' } });
    fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    expect(nameInput).toHaveValue('Alex Morgan');
    expect(emailInput).toHaveValue('alex@example.com');
    expect(passwordInput).toHaveValue('secret123');
  });

  it('toggles password visibility when toggle eye button is clicked', () => {
    render(<AuthModal {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find eye icon toggle button inside password input container
    const toggleBtn = passwordInput.nextElementSibling as HTMLElement;
    if (toggleBtn) {
      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  it('calls onClose when close button (X) is clicked', () => {
    const onClose = vi.fn();
    render(<AuthModal {...defaultProps} onClose={onClose} />);

    // X close button is in top right
    const closeBtn = screen.getAllByRole('button')[0];
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
