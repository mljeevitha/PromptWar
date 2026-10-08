import React from 'react';
import { AgentRole, AgentStatus } from '../types';
import { FileSearch, GitFork, Code2, CheckCircle2, Wrench, ShieldCheck, Clock, Check, X, AlertCircle } from 'lucide-react';

interface AgentStatusBadgesProps {
  agentStates: Record<AgentRole, AgentStatus>;
}

const AGENT_CONFIG: Array<{ role: AgentRole; label: string; icon: React.ElementType }> = [
  { role: 'Supervisor', label: 'Supervisor Agent', icon: ShieldCheck },
  { role: 'PaperAnalyst', label: 'Paper Analyst Agent', icon: FileSearch },
  { role: 'Planner', label: 'Planning Agent', icon: GitFork },
  { role: 'Coder', label: 'Coding Agent', icon: Code2 },
  { role: 'Tester', label: 'Testing Agent', icon: CheckCircle2 },
  { role: 'Debugger', label: 'Debugging Agent', icon: Wrench },
];

export const AgentStatusBadges: React.FC<AgentStatusBadgesProps> = ({ agentStates }) => {
  return (
    <div className="bg-[#0f172a]/70 border border-gray-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800/80">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Autonomous Agent Orchestration Swarm
        </h3>
        <span className="text-[11px] text-gray-500">6 Specialized Agent Roles</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {AGENT_CONFIG.map(({ role, label, icon: Icon }) => {
          const status = agentStates[role] || 'idle';

          let statusBadge = (
            <span className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
              <Clock className="w-3 h-3 text-gray-600" />
              <span>Waiting</span>
            </span>
          );

          let borderClass = 'border-gray-800/60 bg-gray-900/40';

          if (status === 'running') {
            borderClass = 'border-indigo-500/50 bg-indigo-950/20 shadow-lg shadow-indigo-500/10';
            statusBadge = (
              <span className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>Running</span>
              </span>
            );
          } else if (status === 'waiting_approval') {
            borderClass = 'border-amber-500/50 bg-amber-950/20';
            statusBadge = (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Approval</span>
              </span>
            );
          } else if (status === 'completed') {
            borderClass = 'border-emerald-500/30 bg-emerald-950/10';
            statusBadge = (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Completed</span>
              </span>
            );
          } else if (status === 'failed') {
            borderClass = 'border-rose-500/50 bg-rose-950/20';
            statusBadge = (
              <span className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                <X className="w-3.5 h-3.5 text-rose-400" />
                <span>Failed</span>
              </span>
            );
          }

          return (
            <div
              key={role}
              className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between ${borderClass}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${
                  status === 'running' ? 'bg-indigo-500/20 text-indigo-400' :
                  status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  status === 'waiting_approval' ? 'bg-amber-500/20 text-amber-400' :
                  status === 'failed' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-gray-800/80 text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-medium text-gray-200 truncate" title={label}>
                  {label.replace(' Agent', '')}
                </div>
              </div>

              <div className="pt-1 border-t border-gray-800/50 flex justify-between items-center">
                {statusBadge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
