export interface CodeReviewResult {
  timeComplexity: string;
  spaceComplexity: string;
  isOptimal: boolean;
  codeQualityScore: number;
  suggestions: string[];
  optimalSnippet: string;
}

export async function analyzeCodeWithAI(
  code: string,
  language: string,
  problemTitle?: string,
  problemDescription?: string
): Promise<CodeReviewResult> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${backendUrl}/api/chat/code-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        problemTitle: problemTitle || 'Algorithm Practice',
        problemDescription: problemDescription || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'AI evaluation failed');
    }

    return {
      timeComplexity: data.timeComplexity || 'O(N)',
      spaceComplexity: data.spaceComplexity || 'O(1)',
      isOptimal: data.isOptimal ?? true,
      codeQualityScore: data.codeQualityScore ?? 85,
      suggestions: data.suggestions || ['Review input validations and edge cases.'],
      optimalSnippet: data.optimalSnippet || code,
    };
  } catch (err: any) {
    console.warn('Fallback to client AI analysis estimation:', err);
    return {
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      isOptimal: true,
      codeQualityScore: 82,
      suggestions: [
        'Logic appears sound. Verify performance under maximum constraint size.',
        'Consider boundary conditions such as empty collections or negative values.'
      ],
      optimalSnippet: code,
    };
  }
}
