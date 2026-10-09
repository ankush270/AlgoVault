import { apiExecute } from './api';

export interface ExecutionResult {
  output: string;
  stderr: string;
  executionTime: number;
  memory: number;
  status: 'SUCCESS' | 'ERROR' | 'COMPILE_ERROR';
  engine?: string;
  isUnauthorized?: boolean;
}

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
  try {
    const data = await apiExecute.runCode(language, code, stdin);

    if (!data) {
      throw new Error('No response received from code execution service.');
    }

    const isUnauthorized = Boolean(
      data.isUnauthorized ||
      (typeof data.stderr === 'string' && /log in to run code|unauthorized/i.test(data.stderr))
    );

    return {
      output: data.output || '',
      stderr: data.stderr || '',
      executionTime: typeof data.executionTime === 'number' ? data.executionTime : 0,
      memory: typeof data.memory === 'number' ? data.memory : 0,
      status: data.status || (data.stderr ? 'ERROR' : 'SUCCESS'),
      engine: data.engine,
      isUnauthorized
    };
  } catch (err: any) {
    const isUnauthorized = Boolean(
      err?.status === 401 ||
      (typeof err?.message === 'string' && /401|log in|unauthorized/i.test(err.message))
    );

    return {
      output: '',
      stderr: err?.message || 'Failed to connect to backend execution engine. Ensure backend server is running.',
      executionTime: 0,
      memory: 0,
      status: 'ERROR',
      isUnauthorized
    };
  }
}

