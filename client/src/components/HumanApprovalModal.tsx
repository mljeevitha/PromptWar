import React from 'react';
import { ShieldCheck, CheckCircle2, Play, X, AlertTriangle } from 'lucide-react';

interface HumanApprovalModalProps {
  isOpen: boolean;
  onApprove: () => void;
  onCancel: () => void;
  isExecuting: boolean;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  onApprove,
  onCancel,
  isExecuting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111827] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
        <button
          onClick={onCancel}
          disabled={isExecuting}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Security & Guardrail Checkpoint
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Review Generated Consequential Actions
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          The <strong>Planning Agent</strong> has synthesized the architecture. Autonomous execution will modify the workspace, run sandboxed code, and execute verification test loops.
        </p>

        {/* Action Checkpoints */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-3 font-mono text-xs">
          <div className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-2">
            Target Execution Pipeline:
          </div>

          <div className="flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Create implementation files (data/, src/, tests/)</span>
          </div>

          <div className="flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Verify and isolate workspace execution boundary</span>
          </div>

          <div className="flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Execute generated model code in isolated sandbox</span>
          </div>

          <div className="flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Run automated test assertions & trigger debug loop</span>
          </div>
        </div>

        {/* Guardrail Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/40 border border-gray-800 text-[11px] text-gray-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            Operations are restricted to <code className="text-gray-300">workspace/generated/</code>. No destructive shell commands or external system access will occur.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isExecuting}
            className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs border border-gray-700 transition"
          >
            Review Plan Again
          </button>

          <button
            onClick={onApprove}
            disabled={isExecuting}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isExecuting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                Authorizing Agents...
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>APPROVE & EXECUTE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
