import React from 'react';
import { TestAttempt } from '../types';
import {
  CheckCircle2,
  XCircle,
  Wrench,
  RotateCw,
  Terminal,
  Bug,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface TestDebugLoopViewProps {
  attempts: TestAttempt[];
  status: string;
}

export const TestDebugLoopView: React.FC<TestDebugLoopViewProps> = ({ attempts, status }) => {
  if (!attempts || attempts.length === 0) {
    return null;
  }

  const latestPassed = attempts.some(a => a.status === 'passed');

  return (
    <div className="bg-[#0f172a]/70 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <RotateCw className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span>Autonomous Self-Healing Loop · Testing & Debugging Agent</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Verification & Continuous Debugging Trace
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {latestPassed ? (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Test Assertions Passed</span>
            </span>
          ) : status === 'debugging' ? (
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <Wrench className="w-4 h-4" />
              <span>Debugging Agent Patching Code...</span>
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>Testing In Progress</span>
            </span>
          )}
        </div>
      </div>

      {/* Attempts Stepper */}
      <div className="space-y-6">
        {attempts.map((attempt) => {
          const isFailed = attempt.status === 'failed';

          return (
            <div
              key={attempt.attemptNumber}
              className={`rounded-2xl border p-5 transition-all duration-300 ${
                isFailed
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : 'border-emerald-500/40 bg-emerald-950/10 shadow-lg shadow-emerald-500/5'
              }`}
            >
              {/* Attempt Bar */}
              <div className="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isFailed
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    #{attempt.attemptNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Attempt {attempt.attemptNumber} — {isFailed ? 'Test Assertions Failed' : 'Test Verification Passed'}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {new Date(attempt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">
                    Passed: <strong className="text-emerald-400">{attempt.passedCount}</strong> / {attempt.testCount}
                  </span>
                  {isFailed ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </div>

              {/* Execution Logs */}
              <div className="bg-gray-950/90 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-gray-800/80 text-gray-300 max-h-48">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-indigo-400" />
                  <span>Sandbox Test Runner Output</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">{attempt.logs}</pre>
              </div>

              {/* Debugging Agent Action Card (Shown if attempt failed and has diagnosis) */}
              {isFailed && attempt.diagnosis && (
                <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Wrench className="w-4 h-4" />
                    <span>Autonomous Debugging Agent · Intervention & Fix</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-400 font-semibold text-[11px] uppercase">
                        Diagnosed Root Cause:
                      </span>
                      <p className="text-gray-200 leading-relaxed bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
                        {attempt.diagnosis}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400 font-semibold text-[11px] uppercase">
                        Applied Correction Patch:
                      </span>
                      <p className="text-emerald-300 leading-relaxed bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
                        {attempt.patchApplied}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-amber-300/80 font-mono">
                    <span>Target patched in workspace</span>
                    <span className="flex items-center gap-1">
                      <span>Triggering re-test iteration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
