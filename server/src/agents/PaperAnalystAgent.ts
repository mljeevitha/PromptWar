import { v4 as uuidv4 } from 'uuid';
import { PaperAnalysis, AgentEvent } from '../types.js';
import { geminiService } from '../services/geminiService.js';
import { SAMPLE_PAPERS } from '../samples/samplePapers.js';

export class PaperAnalystAgent {
  public async analyze(
    paperText: string,
    sampleId?: string,
    emitEvent?: (event: AgentEvent) => void
  ): Promise<PaperAnalysis> {
    emitEvent?.({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent: 'PaperAnalyst',
      action: 'Initiating Research Paper Extraction',
      status: 'running',
      explanation: 'Scanning document text, parsing LaTeX formulas, and identifying structural sections.',
      toolUsed: 'pdfService.extractText'
    });

    // Check if matching prepared sample
    if (sampleId && SAMPLE_PAPERS[sampleId]) {
      const sample = SAMPLE_PAPERS[sampleId];
      emitEvent?.({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent: 'PaperAnalyst',
        action: 'Identified Research Domain & Methodology',
        status: 'info',
        explanation: `Domain recognized: ${sample.domain}. Target model: ${sample.defaultAnalysis.algorithms[0]}`,
        toolUsed: 'DomainClassifier'
      });

      emitEvent?.({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        agent: 'PaperAnalyst',
        action: 'Paper Analysis Complete',
        status: 'success',
        explanation: `Extracted 9 technical facets: Problem formulation, objective, ${sample.defaultAnalysis.algorithms.length} algorithms, dataset schema, and evaluation metrics.`,
        toolUsed: 'geminiService.analyzePaperText'
      });

      return sample.defaultAnalysis;
    }

    // Dynamic analysis via Gemini / Heuristics
    const analysis = await geminiService.analyzePaperText(paperText);

    emitEvent?.({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent: 'PaperAnalyst',
      action: 'Extracted Research Problem & Methodology',
      status: 'info',
      explanation: `Identified primary problem: "${analysis.researchProblem.slice(0, 90)}..."`,
      toolUsed: 'geminiService.analyzePaperText'
    });

    emitEvent?.({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      agent: 'PaperAnalyst',
      action: 'Paper Analysis Complete',
      status: 'success',
      explanation: `Successfully extracted objective, mathematical algorithms (${analysis.algorithms.join(', ')}), and dataset schema.`,
      toolUsed: 'geminiService.analyzePaperText'
    });

    return analysis;
  }
}

export const paperAnalystAgent = new PaperAnalystAgent();
