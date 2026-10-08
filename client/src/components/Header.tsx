import React from 'react';
import { Cpu, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  status: string;
}

export const Header: React.FC<HeaderProps> = ({ onReset, status }) => {
  return (
    <header className="border-b border-gray-800 bg-[#0d1322]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                Paper2Prototype <span className="text-indigo-400">AI</span>
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                PROMPT WARS 2026
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Autonomous Research-to-Prototype Agent: Understands, Plans, Builds, Tests & Debugs
            </p>
          </div>
        </div>

        {/* Status Pill & Reset */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status === 'ready' ? 'bg-emerald-400' :
                status === 'failed' ? 'bg-rose-400' :
                status === 'awaiting_approval' ? 'bg-amber-400' :
                status === 'idle' ? 'bg-gray-400' : 'bg-indigo-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                status === 'ready' ? 'bg-emerald-500' :
                status === 'failed' ? 'bg-rose-500' :
                status === 'awaiting_approval' ? 'bg-amber-500' :
                status === 'idle' ? 'bg-gray-500' : 'bg-indigo-500'
              }`} />
            </span>
            <span className="text-gray-300 font-medium capitalize">
              {status === 'awaiting_approval' ? 'Human Approval Required' : status.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 transition"
            title="Reset Workflow"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">New Paper</span>
          </button>
        </div>
      </div>
    </header>
  );
};
