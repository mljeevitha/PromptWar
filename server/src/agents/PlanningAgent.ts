import { v4 as uuidv4 } from 'uuid';
import { PaperAnalysis, ImplementationTask, AgentEvent } from '../types.js';
import { SAMPLE_PAPERS } from '../samples/samplePapers.js';

export class PlanningAgent {
  public plan(
    analysis: PaperAnalysis,
    sampleId?: string,
    emitEvent?: (event: AgentEvent) => void
  ): ImplementationTask[] {
    emitEvent?.({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent: 'Planner',
      action: 'Decomposing Research Methodology into Tasks',
      status: 'running',
      explanation: 'Analyzing architectural dependencies, data transformations, and testing requirements.',
      toolUsed: 'TaskDecomposer'
    });

    if (sampleId && SAMPLE_PAPERS[sampleId]) {
      const tasks = SAMPLE_PAPERS[sampleId].defaultTasks;
      emitEvent?.({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent: 'Planner',
        action: 'Ordered Execution Plan Formulated',
        status: 'success',
        explanation: `Synthesized ${tasks.length} ordered tasks with strict dependency directed acyclic graph (DAG).`,
        toolUsed: 'DependencyResolver'
      });
      return tasks;
    }

    // Dynamic planning derived from PaperAnalysis
    const tasks: ImplementationTask[] = [
      {
        id: 'task-1',
        order: 1,
        title: 'Data Ingestion & Feature Normalization',
        description: `Implement ingestion module for dataset "${analysis.dataset.name}". Normalize inputs (${analysis.inputFeatures.slice(0, 3).join(', ')}).`,
        fileTarget: 'data/preprocessor.ts',
        dependencies: [],
        status: 'pending'
      },
      {
        id: 'task-2',
        order: 2,
        title: 'Core Algorithm & Model Architecture',
        description: `Implement core model: ${analysis.algorithms[0] || 'Neural Model'} with mathematical feed-forward passes.`,
        fileTarget: 'src/model.ts',
        dependencies: ['task-1'],
        status: 'pending'
      },
      {
        id: 'task-3',
        order: 3,
        title: 'Inference Engine & Decision Scorer',
        description: `Build prediction pipeline yielding target output: ${analysis.output}.`,
        fileTarget: 'src/inference.ts',
        dependencies: ['task-2'],
        status: 'pending'
      },
      {
        id: 'task-4',
        order: 4,
        title: 'Automated Test Suite & Verification Harness',
        description: 'Construct unit tests testing normal inputs, adversarial anomalies, and boundary zeros.',
        fileTarget: 'tests/model.test.ts',
        dependencies: ['task-3'],
        status: 'pending'
      }
    ];

    emitEvent?.({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent: 'Planner',
      action: 'Execution Plan Ready for Review',
      status: 'success',
      explanation: `Generated ${tasks.length} modular implementation milestones mapped to isolated workspace files.`,
      toolUsed: 'PlanOptimizer'
    });

    return tasks;
  }
}

export const planningAgent = new PlanningAgent();
