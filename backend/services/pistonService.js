import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const PISTON_URL = (process.env.PISTON_URL || 'http://localhost:2000').replace(/\/$/, '');
const JUDGE0_URL = (process.env.JUDGE0_URL || 'https://ce.judge0.com').replace(/\/$/, '');
const WANDBOX_URL = (process.env.WANDBOX_URL || 'https://wandbox.org').replace(/\/$/, '');

// Language configuration mapping for Piston and cloud/local runners
export const LANGUAGE_CONFIG = {
  python: {
    pistonLang: 'python',
    pistonVersion: '*',
    judge0Id: 71, // Python (3.8.1)
    fallbackCmd: 'python',
    ext: '.py'
  },
  javascript: {
    pistonLang: 'javascript',
    pistonVersion: '*',
    judge0Id: 63, // JavaScript (Node.js 12.14.0)
    fallbackCmd: 'node',
    ext: '.js'
  },
  cpp: {
    pistonLang: 'cpp',
    pistonVersion: '*',
    judge0Id: 54, // C++ (GCC 9.2.0)
    fallbackCmd: 'g++',
    ext: '.cpp'
  },
  java: {
    pistonLang: 'java',
    pistonVersion: '*',
    judge0Id: 62, // Java (OpenJDK 13.0.1)
    fallbackCmd: 'javac',
    ext: '.java'
  }
};

/**
 * Check if the Piston Docker/Local API service is reachable
 */
export async function checkPistonHealth() {
  try {
    const res = await fetch(`${PISTON_URL}/api/v2/packages`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return { ok: false, error: `Piston status ${res.status}` };
    const packages = await res.json();
    return {
      ok: true,
      url: PISTON_URL,
      installedCount: Array.isArray(packages) ? packages.filter(p => p.installed).length : 0,
      packages: Array.isArray(packages) ? packages : []
    };
  } catch (err) {
    return { ok: false, url: PISTON_URL, error: err.message };
  }
}

/**
 * Automatically check and install missing core packages in Piston container
 */
export async function initPistonPackages() {
  try {
    const health = await checkPistonHealth();
    if (!health.ok) {
      console.log(`ℹ️ [PISTON ENGINE] Piston service not reachable at ${PISTON_URL}. Multi-tiered cloud & native fallback execution active.`);
      return;
    }

    console.log(`⚡ [PISTON ENGINE] Connected to Piston at ${PISTON_URL}. Checking runtime packages...`);
    const installed = new Set(
      health.packages.filter(p => p.installed).map(p => `${p.language}:${p.language_version}`)
    );

    const neededPackages = [
      { language: 'python', version: '3.10.0' },
      { language: 'node', version: '18.15.0' },
      { language: 'gcc', version: '10.2.0' },
      { language: 'java', version: '15.0.2' }
    ];

    for (const pkg of neededPackages) {
      const key = `${pkg.language}:${pkg.version}`;
      if (!installed.has(key)) {
        console.log(`📦 [PISTON ENGINE] Requesting installation of ${key}...`);
        fetch(`${PISTON_URL}/api/v2/packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pkg)
        }).catch(e => console.warn(`Failed to trigger install for ${key}:`, e.message));
      } else {
        console.log(`✅ [PISTON ENGINE] Runtime ready: ${key}`);
      }
    }
  } catch (err) {
    console.warn('[PISTON ENGINE] Package initialization notice:', err.message);
  }
}

/**
 * Execute code via local or hosted Piston API
 */
async function executeWithPiston(langKey, code, stdin = '') {
  const config = LANGUAGE_CONFIG[langKey] || LANGUAGE_CONFIG.javascript;

  const payload = {
    language: config.pistonLang,
    version: config.pistonVersion || '*',
    files: [
      {
        name: langKey === 'java' ? 'Main.java' : `solution${config.ext}`,
        content: code
      }
    ],
    stdin: stdin || '',
    run_timeout: 4000,
    compile_timeout: 10000
  };

  const response = await fetch(`${PISTON_URL}/api/v2/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Piston error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const run = data.run || {};
  const compile = data.compile || {};

  // Check compile error first
  if (compile && compile.code !== undefined && compile.code !== 0) {
    return {
      output: compile.output || compile.stdout || '',
      stderr: compile.stderr || compile.output || 'Compilation failed',
      executionTime: 0,
      memory: 0,
      status: 'COMPILE_ERROR',
      engine: 'piston'
    };
  }

  const codeStatus = run.code === 0 ? 'SUCCESS' : 'ERROR';
  const stdout = run.stdout || run.output || '';
  const stderr = run.stderr || '';

  return {
    output: stdout,
    stderr: stderr,
    executionTime: run.time !== undefined ? Math.round(run.time * 1000) : (run.wall_time || 0),
    memory: run.memory || 0,
    status: codeStatus,
    engine: 'piston'
  };
}

/**
 * Normalizes Java code for runners that expect a Main class entry point
 */
function normalizeJavaCode(code) {
  // If the user's code already defines a Main class with main method, return as is
  if (/class\s+Main\b/.test(code)) {
    return code;
  }

  // If there's a Solution class or similar with main method, attach a Main launcher class
  const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
  if (classMatch && classMatch[1] && classMatch[1] !== 'Main') {
    const targetClass = classMatch[1];
    return `${code}\n\nclass Main {\n    public static void main(String[] args) throws Throwable {\n        try {\n            ${targetClass}.main(args);\n        } catch (Throwable t) {\n            throw t;\n        }\n    }\n}\n`;
  }

  return code;
}

/**
 * Execute code via Judge0 CE public API with base64 encoding to prevent encoding issues
 */
async function executeWithJudge0(langKey, code, stdin = '') {
  const config = LANGUAGE_CONFIG[langKey];
  if (!config || !config.judge0Id) {
    throw new Error(`Judge0 does not have a language ID configured for '${langKey}'.`);
  }

  const preparedCode = langKey === 'java' ? normalizeJavaCode(code) : code;

  const payload = {
    source_code: Buffer.from(preparedCode, 'utf-8').toString('base64'),
    language_id: config.judge0Id,
    stdin: Buffer.from(stdin || '', 'utf-8').toString('base64')
  };

  const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(18000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  const decodeB64 = (val) => {
    if (!val) return '';
    try {
      return Buffer.from(val, 'base64').toString('utf-8');
    } catch {
      return val;
    }
  };

  const stdout = decodeB64(data.stdout);
  const stderr = decodeB64(data.stderr);
  const compileOutput = decodeB64(data.compile_output);
  const message = decodeB64(data.message);

  const statusId = data.status ? data.status.id : null;

  // Status ID 6 = Compilation Error
  if (statusId === 6 || (compileOutput && !stdout && statusId !== 3)) {
    return {
      output: '',
      stderr: compileOutput || 'Compilation error occurred.',
      executionTime: 0,
      memory: 0,
      status: 'COMPILE_ERROR',
      engine: 'judge0'
    };
  }

  // Status ID 5 = Time Limit Exceeded
  if (statusId === 5) {
    return {
      output: stdout,
      stderr: 'Time Limit Exceeded (Judge0).',
      executionTime: Math.round(parseFloat(data.time || '5') * 1000),
      memory: data.memory || 0,
      status: 'ERROR',
      engine: 'judge0'
    };
  }

  const isSuccess = statusId === 3; // 3 = Accepted
  const combinedStderr = [stderr, message].filter(Boolean).join('\n');

  return {
    output: stdout,
    stderr: combinedStderr,
    executionTime: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
    memory: data.memory || 0,
    status: isSuccess ? 'SUCCESS' : 'ERROR',
    engine: 'judge0'
  };
}

/**
 * Execute C++ via Wandbox API (high reliability backup for C++)
 */
async function executeWithWandbox(langKey, code, stdin = '') {
  if (langKey !== 'cpp') {
    throw new Error('Wandbox execution is configured primarily for C++ fallback.');
  }

  const payload = {
    compiler: 'gcc-head',
    code: code,
    stdin: stdin || '',
    options: 'c++20,warning'
  };

  const response = await fetch(`${WANDBOX_URL}/api/compile.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(18000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Wandbox error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (data.compiler_error && data.status !== '0' && data.status !== 0) {
    return {
      output: data.compiler_output || '',
      stderr: data.compiler_error || 'Compilation error',
      executionTime: 0,
      memory: 0,
      status: 'COMPILE_ERROR',
      engine: 'wandbox'
    };
  }

  const isSuccess = data.status === '0' || data.status === 0;
  return {
    output: data.program_output || data.compiler_output || '',
    stderr: data.program_error || '',
    executionTime: 120, // Wandbox doesn't return exact runtime in compile.json
    memory: 0,
    status: isSuccess ? 'SUCCESS' : 'ERROR',
    engine: 'wandbox'
  };
}

/**
 * Helper to execute a command with timeout and stdin piping
 */
function spawnAndCollect(command, args, options, stdin, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let child;
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      if (child) {
        try { child.kill('SIGKILL'); } catch (e) {}
      }
      resolve({
        output: '',
        stderr: `Time Limit Exceeded (${timeoutMs}ms limit reached).`,
        executionTime: timeoutMs,
        memory: 0,
        status: 'ERROR'
      });
    }, timeoutMs);

    try {
      child = spawn(command, args, options);
    } catch (err) {
      clearTimeout(timeout);
      return resolve({
        output: '',
        stderr: err.message,
        executionTime: 0,
        memory: 0,
        status: 'ERROR'
      });
    }

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (d) => { stdout += d.toString(); });
    child.stderr?.on('data', (d) => { stderr += d.toString(); });

    if (stdin && child.stdin) {
      try {
        child.stdin.write(stdin);
        child.stdin.end();
      } catch (e) {}
    }

    child.on('error', (err) => {
      clearTimeout(timeout);
      if (timedOut) return;
      resolve({
        output: '',
        stderr: `Execution spawn error: ${err.message}`,
        executionTime: Date.now() - startTime,
        memory: 0,
        status: 'ERROR'
      });
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (timedOut) return;
      resolve({
        output: stdout,
        stderr: stderr,
        executionTime: Date.now() - startTime,
        memory: 0,
        status: code === 0 ? 'SUCCESS' : 'ERROR'
      });
    });
  });
}

/**
 * Safe local fallback execution using child_process
 * ONLY allowed if ALLOW_LOCAL_FALLBACK=true in environment (for offline local development).
 * In production, unsandboxed host code execution is disabled to prevent RCE.
 */
async function executeLocalFallback(langKey, code, stdin = '') {
  if (process.env.ALLOW_LOCAL_FALLBACK !== 'true') {
    return {
      output: '',
      stderr: 'Sandboxed code execution (Piston/Judge0) is currently unavailable. Unsandboxed host execution is disabled for server security.',
      executionTime: 0,
      memory: 0,
      status: 'ERROR'
    };
  }

  const config = LANGUAGE_CONFIG[langKey] || LANGUAGE_CONFIG.javascript;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'algovault_run_'));
  const fileName = langKey === 'java' ? 'Main.java' : `solution${config.ext}`;
  const filePath = path.join(tempDir, fileName);

  fs.writeFileSync(filePath, code, 'utf-8');

  const cleanup = () => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (e) {}
  };

  try {
    if (langKey === 'javascript') {
      const res = await spawnAndCollect(process.execPath, [filePath], { cwd: tempDir }, stdin);
      cleanup();
      return { ...res, engine: 'local-fallback' };
    }

    if (langKey === 'python') {
      const res = await spawnAndCollect('python', [filePath], { cwd: tempDir }, stdin);
      cleanup();
      return { ...res, engine: 'local-fallback' };
    }

    if (langKey === 'cpp') {
      // Try local g++ if present
      const outBinary = path.join(tempDir, process.platform === 'win32' ? 'solution.exe' : 'solution');
      const compileRes = await spawnAndCollect('g++', ['-O2', filePath, '-o', outBinary], { cwd: tempDir }, '', 8000);
      if (compileRes.status !== 'SUCCESS') {
        cleanup();
        return {
          output: '',
          stderr: compileRes.stderr || 'Local C++ compilation failed.',
          executionTime: 0,
          memory: 0,
          status: 'COMPILE_ERROR',
          engine: 'local-fallback'
        };
      }
      const runRes = await spawnAndCollect(outBinary, [], { cwd: tempDir }, stdin);
      cleanup();
      return { ...runRes, engine: 'local-fallback' };
    }

    if (langKey === 'java') {
      // Try local javac + java if present
      const compileRes = await spawnAndCollect('javac', [filePath], { cwd: tempDir }, '', 8000);
      if (compileRes.status !== 'SUCCESS') {
        cleanup();
        return {
          output: '',
          stderr: compileRes.stderr || 'Local Java compilation failed.',
          executionTime: 0,
          memory: 0,
          status: 'COMPILE_ERROR',
          engine: 'local-fallback'
        };
      }
      const runRes = await spawnAndCollect('java', ['-cp', tempDir, 'Main'], { cwd: tempDir }, stdin);
      cleanup();
      return { ...runRes, engine: 'local-fallback' };
    }

    cleanup();
    return {
      output: '',
      stderr: `Unsupported language: '${langKey}'.`,
      executionTime: 0,
      memory: 0,
      status: 'ERROR',
      engine: 'local-fallback'
    };
  } catch (err) {
    cleanup();
    return {
      output: '',
      stderr: err.message,
      executionTime: 0,
      memory: 0,
      status: 'ERROR',
      engine: 'local-fallback'
    };
  }
}

/**
 * Main execute function with multi-tiered sandboxing:
 * 1. Configured/Local Piston container (isolated sandbox)
 * 2. Judge0 CE Cloud Runner (isolated sandbox)
 * 3. Wandbox Runner (isolated sandbox for C++)
 * 4. Local fallback (ONLY if explicitly enabled via ALLOW_LOCAL_FALLBACK=true)
 */
export async function runCode({ language, code, stdin }) {
  const normalizedLang = (language || 'javascript').toLowerCase().trim();
  const langKey = normalizedLang === 'node' || normalizedLang === 'js' ? 'javascript'
    : normalizedLang === 'py' ? 'python'
    : normalizedLang === 'c++' ? 'cpp'
    : normalizedLang;

  if (!code || typeof code !== 'string') {
    return {
      output: '',
      stderr: 'Code string is required for execution.',
      executionTime: 0,
      memory: 0,
      status: 'ERROR'
    };
  }

  // Tier 1: Try Piston container service if reachable
  try {
    const result = await executeWithPiston(langKey, code, stdin);
    return result;
  } catch (pistonErr) {
    // Piston container is offline or unreachable
  }

  // Tier 2: Judge0 CE Cloud Runner (isolated sandbox for JS, Python, C++, Java)
  try {
    const judge0Result = await executeWithJudge0(langKey, code, stdin);
    return judge0Result;
  } catch (judge0Err) {
    console.warn(`[EXECUTION ENGINE] Judge0 fallback failed for ${langKey} (${judge0Err.message}).`);
  }

  // Tier 3: Wandbox Runner (specialized fallback for C++)
  if (langKey === 'cpp') {
    try {
      const wandboxResult = await executeWithWandbox(langKey, code, stdin);
      return wandboxResult;
    } catch (wandboxErr) {
      console.warn(`[EXECUTION ENGINE] Wandbox fallback failed for C++ (${wandboxErr.message}).`);
    }
  }

  // Tier 4: Local host fallback (strictly guarded by ALLOW_LOCAL_FALLBACK flag)
  const fallbackResult = await executeLocalFallback(langKey, code, stdin);
  return fallbackResult;
}


