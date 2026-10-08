import React, { useState, useEffect } from 'react';
import {
  WorkflowSession,
  SamplePaper,
  AgentRole,
  AgentStatus
} from './types';
import {
  fetchSamples,
  initSession,
  uploadPaper,
  analyzePaper,
  executePipeline,
  subscribeToEvents,
  fetchSession
} from './api/client';
import { Header } from './components/Header';
import { AgentStatusBadges } from './components/AgentStatusBadges';
import { PaperUploader } from './components/PaperUploader';
import { PaperAnalysisCard } from './components/PaperAnalysisCard';
import { PlanningView } from './components/PlanningView';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { CodeViewer } from './components/CodeViewer';
import { TestDebugLoopView } from './components/TestDebugLoopView';
import { WorkingPrototype } from './components/WorkingPrototype';
import { AgentEventLog } from './components/AgentEventLog';
import { Sparkles, Terminal, FileText, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [samples, setSamples] = useState<SamplePaper[]>([]);
  const [session, setSession] = useState<WorkflowSession | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(undefined);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'CODE' | 'LOGS'>('WORKSPACE');
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Load sample papers on mount
  useEffect(() => {
    fetchSamples()
      .then(setSamples)
      .catch((err) => console.warn('Could not load samples:', err));
  }, []);

  // Subscribe to live SSE events when a session is active
  useEffect(() => {
    if (!session?.id) return;

    const unsubscribe = subscribeToEvents(session.id, (data) => {
      if (data.session) {
        setSession(data.session);
        if (data.session.status === 'awaiting_approval') {
          setIsApprovalOpen(true);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [session?.id]);

  // Handler: 1-Click Sample Paper Execution
  const handleSelectSample = async (sampleId: string) => {
    setIsLoading(true);
    setGeneralError(null);
    setSelectedSampleId(sampleId);

    try {
      const init = await initSession(sampleId);
      setSession(init.session);

      // Auto-trigger Paper Analysis & Planning
      const analyzed = await analyzePaper(init.sessionId, undefined, sampleId);
      setSession(analyzed.session);
      setIsApprovalOpen(true);
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to process sample paper');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Custom PDF Upload
  const handleUploadPdf = async (file: File) => {
    setIsLoading(true);
    setGeneralError(null);
    setSelectedSampleId(undefined);

    try {
      const uploadRes = await uploadPaper(file);
      // Fetch initial session
      const sess = await fetchSession(uploadRes.sessionId);
      setSession(sess);

      // Run Paper Analysis & Planning on the extracted text
      const analyzed = await analyzePaper(uploadRes.sessionId, uploadRes.fullText);
      setSession(analyzed.session);
      setIsApprovalOpen(true);
    } catch (err: any) {
      setGeneralError(err.message || 'PDF upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Consequential Execution Approved by User
  const handleApproveExecution = async () => {
    if (!session?.id) return;
    setIsLoading(true);
    setGeneralError(null);

    try {
      const res = await executePipeline(session.id, selectedSampleId);
      setSession(res.session);
      setIsApprovalOpen(false);
    } catch (err: any) {
      setGeneralError(err.message || 'Autonomous execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Reset Workflow
  const handleReset = () => {
    setSession(null);
    setSelectedSampleId(undefined);
    setIsApprovalOpen(false);
    setGeneralError(null);
  };

  const defaultAgentStates: Record<AgentRole, AgentStatus> = {
    Supervisor: 'idle',
    PaperAnalyst: 'idle',
    Planner: 'idle',
    Coder: 'idle',
    Tester: 'idle',
    Debugger: 'idle'
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header onReset={handleReset} status={session?.status || 'idle'} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Top Agent Swarm Status Indicator */}
        <AgentStatusBadges agentStates={session?.agentStates || defaultAgentStates} />

        {/* Global Error Banner */}
        {generalError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Landing / Upload Screen (if no session or idle) */}
        {!session || session.status === 'idle' ? (
          <div className="space-y-12 py-4">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Research-to-Prototype Agent</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                From Research Paper <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  to Working Prototype
                </span>
              </h2>

              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
                An autonomous agent swarm that <strong>understands</strong> scientific methodology, <strong>plans</strong> task graphs, <strong>synthesizes</strong> isolated code, <strong>executes</strong> unit tests, and <strong>self-heals bugs</strong> through continuous feedback.
              </p>
            </div>

            {/* Paper Uploader & Samples */}
            <PaperUploader
              onUpload={handleUploadPdf}
              onSelectSample={handleSelectSample}
              samples={samples}
              isLoading={isLoading}
            />
          </div>
        ) : (
          /* Active Workspace Screen */
          <div className="space-y-8 animate-fade-in">
            {/* Workspace Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f172a]/60 border border-gray-800 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('WORKSPACE')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'WORKSPACE'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Research & Prototype</span>
                </button>

                <button
                  onClick={() => setActiveTab('CODE')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'CODE'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="font-mono">&lt;/&gt;</span>
                  <span>Generated Code ({session.files.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('LOGS')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'LOGS'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Agent Stream ({session.events.length})</span>
                </button>
              </div>

              {session.status === 'awaiting_approval' && (
                <button
                  onClick={() => setIsApprovalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Review & Approve Actions</span>
                </button>
              )}
            </div>

            {/* TAB: WORKSPACE */}
            {activeTab === 'WORKSPACE' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (2 Columns) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Final Working Prototype (Top priority when ready!) */}
                  {session.status === 'ready' && (
                    <WorkingPrototype
                      sessionId={session.id}
                      sampleId={selectedSampleId}
                      config={session.prototypeConfig}
                    />
                  )}

                  {/* Testing & Debugging Loop Trace */}
                  <TestDebugLoopView
                    attempts={session.attempts}
                    status={session.status}
                  />

                  {/* Implementation Planning */}
                  {session.plan && session.plan.length > 0 && (
                    <PlanningView
                      tasks={session.plan}
                      status={session.status}
                      onOpenApprovalModal={() => setIsApprovalOpen(true)}
                    />
                  )}

                  {/* Paper Structured Analysis */}
                  {session.analysis && (
                    <PaperAnalysisCard analysis={session.analysis} />
                  )}
                </div>

                {/* Sidebar: Real-time Agent Event Log (1 Column) */}
                <div className="space-y-6">
                  <AgentEventLog events={session.events} />
                </div>
              </div>
            )}

            {/* TAB: CODE */}
            {activeTab === 'CODE' && (
              <CodeViewer files={session.files} />
            )}

            {/* TAB: LOGS */}
            {activeTab === 'LOGS' && (
              <AgentEventLog events={session.events} />
            )}
          </div>
        )}
      </main>

      {/* Human Approval Checkpoint Modal */}
      <HumanApprovalModal
        isOpen={isApprovalOpen}
        onApprove={handleApproveExecution}
        onCancel={() => setIsApprovalOpen(false)}
        isExecuting={isLoading}
      />
    </div>
  );
};

export default App;
