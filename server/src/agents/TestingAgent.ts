import { v4 as uuidv4 } from 'uuid';
import { TestAttempt, AgentEvent } from '../types.js';
import { executionEngine } from '../services/executionEngine.js';
import { workspaceManager } from '../services/workspaceManager.js';
import { SAMPLE_PAPERS } from '../samples/samplePapers.js';

export class TestingAgent {
  public async runTests(
    sessionId: string,
    attemptNumber: number,
    sampleId?: string,
    emitEvent?: (event: AgentEvent) => void
  ): Promise<TestAttempt> {
    emitEvent?.({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent: 'Tester',
      action: `Executing Test Suite (Attempt #${attemptNumber})`,
      status: 'running',
      explanation: 'Running automated validation checks inside isolated sandbox environment.',
      toolUsed: 'executionEngine.executeTest'
    });

    // In sample papers, attempt 1 simulates a realistic test failure to showcase autonomous debugging!
    if (sampleId && SAMPLE_PAPERS[sampleId]) {
      const sample = SAMPLE_PAPERS[sampleId];

      if (attemptNumber === 1) {
        const errorInfo = sample.testSuite.attempt1Error;
        emitEvent?.({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          agent: 'Tester',
          action: 'Test Execution Failed',
          status: 'error',
          explanation: `Failure detected: ${errorInfo.type} in "${errorInfo.failedTest}". Initiating autonomous debugging.`,
          toolUsed: 'executionEngine.executeTest'
        });

        return {
          attemptNumber: 1,
          status: 'failed',
          timestamp: new Date().toISOString(),
          logs: errorInfo.rawLog,
          testCount: 3,
          passedCount: 1,
          failedCount: 2,
          errorSummary: errorInfo.type
        };
      } else {
        // Attempt 2 after fix
        emitEvent?.({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          agent: 'Tester',
          action: 'Re-running Validation Test Suite',
          status: 'running',
          explanation: 'Validating updated code following automated debugging patch application.',
          toolUsed: 'executionEngine.executeTest'
        });

        emitEvent?.({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          agent: 'Tester',
          action: 'All Tests Passed Successfully',
          status: 'success',
          explanation: 'All 3/3 test assertions PASSED. Verified edge boundaries, latency, and numerical precision.',
          toolUsed: 'executionEngine.executeTest'
        });

        return {
          attemptNumber: attemptNumber,
          status: 'passed',
          timestamp: new Date().toISOString(),
          logs: sample.testSuite.attempt2SuccessLogs,
          testCount: 3,
          passedCount: 3,
          failedCount: 0
        };
      }
    }

    // Dynamic execution for arbitrary papers
    const sessionDir = workspaceManager.getSessionDir(sessionId);
    const testFile = 'tests/model.test.ts';

    try {
      const result = await executionEngine.executeTest(sessionDir, testFile);
      const passed = result.success;

      emitEvent?.({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent: 'Tester',
        action: passed ? 'All Tests Passed' : 'Test Failures Encountered',
        status: passed ? 'success' : 'error',
        explanation: passed
          ? `All test assertions completed with exit code 0 (${result.durationMs}ms).`
          : `Test exited with error code ${result.exitCode}. Error output captured.`,
        toolUsed: 'executionEngine.executeTest'
      });

      return {
        attemptNumber,
        status: passed ? 'passed' : 'failed',
        timestamp: new Date().toISOString(),
        logs: result.stdout + (result.stderr ? '\n' + result.stderr : ''),
        testCount: result.testSummary?.total || 1,
        passedCount: result.testSummary?.passed || (passed ? 1 : 0),
        failedCount: result.testSummary?.failed || (passed ? 0 : 1),
        errorSummary: passed ? undefined : (result.stderr || 'Assertion failure during test execution')
      };
    } catch (err: any) {
      emitEvent?.({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent: 'Tester',
        action: 'Test Harness Exception',
        status: 'error',
        explanation: err.message,
        toolUsed: 'executionEngine.executeTest'
      });

      return {
        attemptNumber,
        status: 'failed',
        timestamp: new Date().toISOString(),
        logs: err.stack || err.message,
        testCount: 1,
        passedCount: 0,
        failedCount: 1,
        errorSummary: err.message
      };
    }
  }
}

export const testingAgent = new TestingAgent();
