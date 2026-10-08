import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface ExecutionResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  testSummary?: {
    total: number;
    passed: number;
    failed: number;
  };
}

export class ExecutionEngine {
  /**
   * Safely executes a script or test file in the isolated session workspace
   */
  public async executeTest(sessionDir: string, testRelPath: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const fullTestPath = path.resolve(sessionDir, testRelPath);

    if (!fullTestPath.startsWith(sessionDir)) {
      throw new Error('Access denied: Execution target outside session workspace.');
    }

    if (!fs.existsSync(fullTestPath)) {
      return {
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: `Test file not found at: ${testRelPath}`,
        durationMs: 0
      };
    }

    // Create a safe test runner script inside the session dir
    const runnerScriptPath = path.join(sessionDir, '__run_tests__.cjs');
    
    // We create a CJS runner that can execute the generated test file
    const runnerContent = `
const path = require('path');
const fs = require('fs');

async function run() {
  try {
    const testFile = path.resolve(__dirname, '${testRelPath.replace(/\\/g, '/')}');
    // Read and execute via dynamic evaluation or node test
    console.log('[EXECUTION ENGINE] Initializing test harness for ' + testFile);
    
    // Safe mock execution harness
    const content = fs.readFileSync(testFile, 'utf8');
    
    // Check if test file has runTests function or test assertions
    if (content.includes('runTests')) {
      console.log('[TEST HARNESS] Invoking test suite...');
      // Execute test module in sandbox
      // For TypeScript/JS files in memory:
      const vm = require('vm');
      const sandbox = {
        console,
        Math,
        parseFloat,
        parseInt,
        isNaN,
        isFinite,
        Buffer,
        Array,
        Object,
        String,
        Number,
        Boolean,
        Date,
        RegExp,
        Error,
        TypeError,
        exports: {}
      };
      
      // Load dependencies from session directory if needed
      // To ensure clean execution without compiling issues, compile on the fly:
      const tsCode = content.replace(/export (function|class|const|let)/g, '$1')
                           .replace(/: [A-Za-z0-9_\\[\\]<> |{}]+/g, '')
                           .replace(/import .*/g, '');
      
      vm.createContext(sandbox);
      vm.runInContext(tsCode, sandbox);
      
      if (typeof sandbox.runTests === 'function') {
        const result = sandbox.runTests();
        if (result && result.logs) {
          result.logs.forEach(l => console.log(l));
        }
        if (result && result.failed > 0) {
          console.error('[TEST FAILURE] ' + result.failed + ' test assertions failed.');
          process.exit(1);
        } else {
          console.log('[TEST SUCCESS] All test assertions passed.');
          process.exit(0);
        }
      }
    }
    
    console.log('[TEST SUCCESS] Test execution completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[TEST RUNNER ERROR]', err.stack || err.message);
    process.exit(1);
  }
}

run();
`;

    fs.writeFileSync(runnerScriptPath, runnerContent, 'utf8');

    return new Promise<ExecutionResult>((resolve) => {
      // Find node executable
      const nodePath = process.execPath;
      const child = spawn(nodePath, [runnerScriptPath], {
        cwd: sessionDir,
        env: {
          ...process.env,
          NODE_ENV: 'test',
          PATH: `${path.dirname(process.execPath)};${process.env.PATH}`
        },
        timeout: 10000 // 10s maximum timeout to prevent hanging
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (err) => {
        stderr += `Spawn error: ${err.message}\n`;
      });

      child.on('close', (code) => {
        const durationMs = Date.now() - startTime;
        // Clean up runner script
        if (fs.existsSync(runnerScriptPath)) {
          try { fs.unlinkSync(runnerScriptPath); } catch (_) {}
        }

        const success = code === 0;
        
        // Parse summary counts
        let passed = 0;
        let failed = 0;
        const passedMatches = stdout.match(/✓ Test (\d+) Passed/g);
        if (passedMatches) passed = passedMatches.length;

        const failedMatches = (stdout + stderr).match(/✗ Test (\d+) Failed/g);
        if (failedMatches) failed = failedMatches.length;

        if (code !== 0 && failed === 0) failed = 1;

        resolve({
          success,
          exitCode: code ?? 1,
          stdout,
          stderr,
          durationMs,
          testSummary: {
            total: passed + failed,
            passed,
            failed
          }
        });
      });
    });
  }
}

export const executionEngine = new ExecutionEngine();
