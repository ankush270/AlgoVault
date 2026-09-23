export interface ExecutionResult {
  output: string;
  stderr: string;
  executionTime: number;
  memory: number;
  status: 'SUCCESS' | 'ERROR' | 'COMPILE_ERROR';
}

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export const languageMap: Record<string, { language: string; version: string; defaultBoilerplate: string }> = {
  cpp: {
    language: 'cpp',
    version: '10.2.0',
    defaultBoilerplate: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "AlgoVault C++ Runner Ready!" << endl;
    return 0;
}`
  },
  python: {
    language: 'python',
    version: '3.10.0',
    defaultBoilerplate: `# AlgoVault Python Runner
def solution():
    print("AlgoVault Python Runner Ready!")

if __name__ == "__main__":
    solution()`
  },
  java: {
    language: 'java',
    version: '15.0.2',
    defaultBoilerplate: `public class Main {
    public static void main(String[] args) {
        System.out.println("AlgoVault Java Runner Ready!");
    }
}`
  },
  javascript: {
    language: 'javascript',
    version: '18.15.0',
    defaultBoilerplate: `// AlgoVault JavaScript Runner
function solution() {
    console.log("AlgoVault JS Runner Ready!");
}

solution();`
  },
};

export async function executeCode(language: string, code: string, stdin = ''): Promise<ExecutionResult> {
  const langConfig = languageMap[language] || languageMap.javascript;
  
  try {
    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: code }],
        stdin,
      }),
    });

    if (!response.ok) {
      throw new Error(`Execution service error (${response.status})`);
    }

    const data = await response.json();
    const run = data.run || {};

    const stdout = run.stdout || '';
    const stderr = run.stderr || '';
    const codeStatus = run.code === 0 ? 'SUCCESS' : 'ERROR';

    return {
      output: stdout,
      stderr: stderr,
      executionTime: run.time ? Math.round(run.time * 1000) : 0,
      memory: run.memory || 0,
      status: codeStatus,
    };
  } catch (err: any) {
    return {
      output: '',
      stderr: err?.message || 'Failed to connect to execution provider.',
      executionTime: 0,
      memory: 0,
      status: 'ERROR',
    };
  }
}
