import React from 'react';
import { ImplementationTask } from '../types';
import { GitFork, CheckCircle2, Circle, Clock, ArrowRight, FileCode } from 'lucide-react';

interface PlanningViewProps {
  tasks: ImplementationTask[];
  onOpenApprovalModal?: () => void;
  status: string;
}

export const PlanningView: React.FC<PlanningViewProps> = ({ tasks, onOpenApprovalModal, status }) => {
  return (
    <div className="bg-[#0f172a]/70 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <GitFork className="w-4 h-4 text-indigo-400" />
            <span>Planning Agent · Task Decomposition & Dependency Graph</span>
          </div>
          <h3 className="text-xl font-bold text-white">Synthesized Implementation Plan</h3>
        </div>

        {status === 'awaiting_approval' && onOpenApprovalModal && (
          <button
            onClick={onOpenApprovalModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition animate-pulse-subtle"
          >
            <span>Review Actions for Approval</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => {
          const isDone = task.status === 'completed' || status === 'ready';
          const isRunning = task.status === 'in_progress' || (status === 'coding' && idx === 0);

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : isRunning
                  ? 'border-indigo-500/50 bg-indigo-950/20 shadow-md shadow-indigo-500/10'
                  : 'border-gray-800/80 bg-gray-900/40'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-gray-500 mt-1">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-100">
                      {task.title}
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800/80 text-gray-400 border border-gray-700/60 flex items-center gap-1">
                      <FileCode className="w-3 h-3 text-indigo-400" />
                      {task.fileTarget}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                {isDone ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed</span>
                  </span>
                ) : isRunning ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span>Building...</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-500 border border-gray-800">
                    <Circle className="w-3 h-3 text-gray-600" />
                    <span>Planned</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
