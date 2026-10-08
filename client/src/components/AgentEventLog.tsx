import React, { useState, useRef, useEffect } from 'react';
import { AgentEvent, AgentRole } from '../types';
import { Terminal, Filter, ShieldCheck, FileSearch, GitFork, Code2, CheckCircle2, Wrench, ChevronDown } from 'lucide-react';

interface AgentEventLogProps {
  events: AgentEvent[];
}

export const AgentEventLog: React.FC<AgentEventLogProps> = ({ events }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const filteredEvents = selectedAgent === 'ALL'
    ? events
    : events.filter(e => e.agent === selectedAgent);

  const getAgentColor = (agent: AgentRole) => {
    switch (agent) {
      case 'Supervisor': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'PaperAnalyst': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Planner': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'Coder': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Tester': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Debugger': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const getStatusBadge = (status: AgentEvent['status']) => {
    switch (status) {
      case 'success': return <span className="text-emerald-400">✓</span>;
      case 'error': return <span className="text-rose-400">✗</span>;
      case 'warning': return <span className="text-amber-400">⚠</span>;
      case 'running': return <span className="text-indigo-400 animate-pulse">●</span>;
      default: return <span className="text-gray-500">i</span>;
    }
  };

  return (
    <div className="bg-[#0b101c]/90 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col h-[520px]">
      {/* Terminal Bar */}
      <div className="px-5 py-3.5 bg-gray-950/90 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
            Agent Swarm Event & Activity Stream
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
            {events.length} Events
          </span>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg text-gray-300 px-2 py-1 text-xs font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Agents</option>
            <option value="Supervisor">Supervisor</option>
            <option value="PaperAnalyst">Paper Analyst</option>
            <option value="Planner">Planner</option>
            <option value="Coder">Coder</option>
            <option value="Tester">Tester</option>
            <option value="Debugger">Debugger</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div ref={scrollRef} className="p-4 overflow-y-auto space-y-3 font-mono text-xs flex-1">
        {filteredEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
            <Terminal className="w-8 h-8 opacity-40" />
            <p className="text-xs font-sans">Awaiting initial agent activation...</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-gray-700/80 transition space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusBadge(evt.status)}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getAgentColor(evt.agent)}`}>
                    [{evt.agent}]
                  </span>
                  <span className="font-semibold text-gray-200 font-sans text-xs">
                    {evt.action}
                  </span>
                </div>

                <div className="text-[10px] text-gray-500">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <p className="text-xs text-gray-400 font-sans pl-5 leading-relaxed">
                {evt.explanation}
              </p>

              {evt.toolUsed && (
                <div className="pl-5 pt-1 flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="text-gray-600">Tool:</span>
                  <code className="text-indigo-400/90 bg-indigo-950/30 px-1.5 py-0.2 rounded border border-indigo-900/40">
                    {evt.toolUsed}
                  </code>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
