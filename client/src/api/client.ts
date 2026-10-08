import { WorkflowSession, SamplePaper } from '../types';

const BASE_URL = '/api';

export async function fetchSamples(): Promise<SamplePaper[]> {
  const res = await fetch(`${BASE_URL}/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample papers');
  const data = await res.json();
  return data.samples;
}

export async function initSession(sampleId?: string): Promise<{ sessionId: string; session: WorkflowSession }> {
  const res = await fetch(`${BASE_URL}/session/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId })
  });
  if (!res.ok) throw new Error('Failed to initialize session');
  return res.json();
}

export async function uploadPaper(file: File): Promise<{
  sessionId: string;
  metadata: any;
  pageCount: number;
  textPreview: string;
  fullText: string;
}> {
  const formData = new FormData();
  formData.append('paper', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload research paper');
  }
  return data;
}

export async function analyzePaper(
  sessionId: string,
  paperText?: string,
  sampleId?: string
): Promise<{ session: WorkflowSession }> {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, paperText, sampleId })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Paper analysis failed');
  }
  return data;
}

export async function executePipeline(
  sessionId: string,
  sampleId?: string
): Promise<{ session: WorkflowSession }> {
  const res = await fetch(`${BASE_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, sampleId })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Workflow execution failed');
  }
  return data;
}

export async function fetchSession(sessionId: string): Promise<WorkflowSession> {
  const res = await fetch(`${BASE_URL}/session/${sessionId}`);
  if (!res.ok) throw new Error('Session not found');
  const data = await res.json();
  return data.session;
}

export function subscribeToEvents(
  sessionId: string,
  onMessage: (data: { type: string; event?: any; session: WorkflowSession }) => void
): () => void {
  const eventSource = new EventSource(`${BASE_URL}/session/${sessionId}/events`);

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    } catch (e) {
      console.error('Failed to parse SSE event data', e);
    }
  };

  eventSource.onerror = (err) => {
    console.warn('SSE connection warning:', err);
  };

  return () => {
    eventSource.close();
  };
}

export async function runPrediction(
  sessionId: string,
  sampleId: string | undefined,
  inputs: Record<string, any>
): Promise<any> {
  const res = await fetch(`${BASE_URL}/session/${sessionId}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId, inputs })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Prediction calculation failed');
  }
  return data.result;
}
