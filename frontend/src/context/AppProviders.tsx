import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProgressProvider } from './ProgressContext';

export interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Unified Application Context Providers
 * 
 * Order of contexts:
 * 1. BrowserRouter: Supplies routing context to all sub-components & hooks
 * 2. AuthProvider: Manages user authentication, profile, token lifecycle
 * 3. ProgressProvider: Tracks problem completion, spaced repetition & revisions (can access Auth state)
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
