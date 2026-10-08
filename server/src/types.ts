export type AgentRole = 
  | 'Supervisor'
  | 'PaperAnalyst'
  | 'Planner'
  | 'Coder'
  | 'Tester'
  | 'Debugger';

export type AgentStatus = 'idle' | 'running' | 'waiting_approval' | 'completed' | 'failed';

export interface AgentEvent {
  id: string;
  timestamp: string;
  agent: AgentRole;
  action: string;
  status: 'info' | 'success' | 'warning' | 'error' | 'running';
  explanation: string;
  toolUsed?: string;
  details?: Record<string, any>;
}

export interface PaperMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  extractedChars: number;
}

export interface PaperAnalysis {
  title: string;
  researchProblem: string;
  objective: string;
  methodology: string;
  algorithms: string[];
  dataset: {
    name: string;
    description: string;
    features: string[];
    targetColumn: string;
  };
  inputFeatures: string[];
  output: string;
  evaluationMetrics: string[];
  keyImplementationSteps: string[];
  assumptions: string[];
  potentialChallenges: string[];
}

export interface ImplementationTask {
  id: string;
  order: number;
  title: string;
  description: string;
  fileTarget: string;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface GeneratedFile {
  path: string;
  language: string;
  content: string;
  description: string;
}

export interface TestAttempt {
  attemptNumber: number;
  status: 'passed' | 'failed';
  timestamp: string;
  logs: string;
  testCount: number;
  passedCount: number;
  failedCount: number;
  errorSummary?: string;
  diagnosis?: string;
  patchApplied?: string;
}

export interface PrototypeInputSpec {
  name: string;
  type: 'number' | 'text' | 'select' | 'boolean';
  label: string;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description?: string;
}

export interface PrototypeInterfaceConfig {
  name: string;
  description: string;
  modelType: string;
  metrics: Record<string, string | number>;
  inputs: PrototypeInputSpec[];
  samplePresets: Array<{
    name: string;
    description: string;
    values: Record<string, any>;
  }>;
}

export interface WorkflowSession {
  id: string;
  paperMetadata?: PaperMetadata;
  analysis?: PaperAnalysis;
  plan: ImplementationTask[];
  status: 
    | 'idle'
    | 'analyzing'
    | 'planned'
    | 'awaiting_approval'
    | 'coding'
    | 'testing'
    | 'debugging'
    | 'ready'
    | 'failed';
  agentStates: Record<AgentRole, AgentStatus>;
  events: AgentEvent[];
  files: GeneratedFile[];
  attempts: TestAttempt[];
  currentAttempt: number;
  prototypeConfig?: PrototypeInterfaceConfig;
  error?: string;
}
