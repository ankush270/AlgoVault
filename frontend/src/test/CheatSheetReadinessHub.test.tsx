import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import { CheatSheetReadinessHub } from '../components/CheatSheetReadinessHub';

// Mock @react-pdf/renderer
vi.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children }: any) => <div data-testid="mock-pdf-link">{typeof children === 'function' ? children({ loading: false }) : children}</div>,
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Document: ({ children }: any) => <div>{children}</div>,
  Page: ({ children }: any) => <div>{children}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  View: ({ children }: any) => <div>{children}</div>,
  Font: {
    register: vi.fn(),
  },
}));

// Mock ProgressContext
vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({
    progress: { completed: [], bookmarks: [], notes: {}, starred: {}, statuses: {} },
    getMasteredCount: () => 5,
  }),
}));

describe('CheatSheetReadinessHub & Code Hygiene Tests', () => {
  it('renders company readiness hub with target company options', () => {
    render(<CheatSheetReadinessHub />);
    expect(screen.getByText(/Target Company Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Readiness Benchmark/i)).toBeInTheDocument();
  });

  it('strictly adheres to ES module hygiene with all imports hoisted to top before any constants or functions', () => {
    const filePath = path.resolve(__dirname, '../components/CheatSheetReadinessHub.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let inMultiLineImport = false;
    let encounteredNonImportCode = false;
    const misplacedImports: { line: number; text: string }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip empty lines and comments
      if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
        continue;
      }

      if (inMultiLineImport) {
        if (line.includes("from '") || line.includes('from "')) {
          inMultiLineImport = false;
        }
        continue;
      }

      if (line.startsWith('import ') || line.startsWith('import{')) {
        if (encounteredNonImportCode) {
          misplacedImports.push({ line: i + 1, text: line });
        }
        if (!line.includes("from '") && !line.includes('from "') && !line.includes("';") && !line.includes('";')) {
          inMultiLineImport = true;
        }
      } else {
        encounteredNonImportCode = true;
      }
    }

    expect(misplacedImports).toEqual([]);
  });
});
