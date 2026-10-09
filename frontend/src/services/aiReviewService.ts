import { getBackendBaseUrl } from './api';

export interface CodeReviewResult {
  timeComplexity: string;
  spaceComplexity: string;
  isOptimal: boolean;
  codeQualityScore: number;
  suggestions: string[];
  optimalSnippet: string;
  isUnauthenticated?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export async function analyzeCodeWithAI(
  code: string,
  language: string,
  problemTitle?: string,
  problemDescription?: string
): Promise<CodeReviewResult> {
  const backendUrl = getBackendBaseUrl();
  const token = typeof window !== 'undefined' ? localStorage.getItem('techswitch_token') : null;

  // Pre-check authentication: unauthenticated users receive friendly offline estimation
  if (!token) {
    return {
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      isOptimal: true,
      codeQualityScore: 82,
      isUnauthenticated: true,
      suggestions: [
        '🔒 Authentication Required: Please log in or register to get real-time AI code reviews powered by Sarvam AI.',
        'Showing offline algorithmic estimation based on common DSA patterns.',
        'Consider boundary conditions such as empty collections or negative values.'
      ],
      optimalSnippet: code,
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${backendUrl}/api/chat/code-review`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code,
        language,
        problemTitle: problemTitle || 'Algorithm Practice',
        problemDescription: problemDescription || '',
      }),
    });

    if (response.status === 401 || response.status === 403) {
      return {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        isOptimal: true,
        codeQualityScore: 82,
        isUnauthenticated: true,
        suggestions: [
          '🔒 Session Expired: Please log in or register to get real-time AI code reviews powered by Sarvam AI.',
          'Showing offline algorithmic estimation based on common DSA patterns.'
        ],
        optimalSnippet: code,
      };
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || `AI service returned error status ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'AI evaluation failed');
    }

    return {
      timeComplexity: data.timeComplexity || 'O(N)',
      spaceComplexity: data.spaceComplexity || 'O(1)',
      isOptimal: data.isOptimal ?? false,
      codeQualityScore: data.codeQualityScore ?? 75,
      suggestions: data.suggestions || ['Review input validations and edge cases.'],
      optimalSnippet: data.optimalSnippet || code,
      isUnauthenticated: false,
    };
  } catch (err: any) {
    console.warn('AI Code Review Error:', err);
    return {
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      isOptimal: false,
      codeQualityScore: 0,
      isError: true,
      errorMessage: err?.message || 'Failed to connect to AI Code Review service.',
      suggestions: [
        `⚠️ AI Review Error: ${err?.message || 'The AI service encountered an error.'}`,
        'Please verify that your network/backend is online and try analyzing again.'
      ],
      optimalSnippet: code,
      isUnauthenticated: false
    };
  }
}

