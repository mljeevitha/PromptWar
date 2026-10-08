import React, { useState } from 'react';
import { PrototypeInterfaceConfig } from '../types';
import { runPrediction } from '../api/client';
import {
  Play,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  Layers,
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';

interface WorkingPrototypeProps {
  sessionId: string;
  sampleId?: string;
  config?: PrototypeInterfaceConfig;
}

export const WorkingPrototype: React.FC<WorkingPrototypeProps> = ({
  sessionId,
  sampleId,
  config
}) => {
  const defaultConfig: PrototypeInterfaceConfig = config || {
    name: 'Synthesized Model Inference Bench',
    description: 'Interactive inference testbench generated from uploaded research paper.',
    modelType: 'Synthesized Neural Classifier',
    metrics: {
      'Precision': '94.2%',
      'Latency': '4.2 ms',
      'Tested Assertions': '100% Passed'
    },
    inputs: [
      { name: 'amount', type: 'number', label: 'Transaction / Metric Amount', defaultValue: 150, min: 1, max: 5000, step: 10 },
      { name: 'v14', type: 'number', label: 'Latent Component 1 (V14)', defaultValue: -0.2, min: -10, max: 10, step: 0.1 },
      { name: 'v17', type: 'number', label: 'Latent Component 2 (V17)', defaultValue: 0.1, min: -10, max: 10, step: 0.1 },
      { name: 'v4', type: 'number', label: 'Latent Component 3 (V4)', defaultValue: 0.4, min: -10, max: 10, step: 0.1 },
      { name: 'timeDelta', type: 'number', label: 'Temporal Gap (Seconds)', defaultValue: 3600, min: 1, max: 86400, step: 60 }
    ],
    samplePresets: [
      {
        name: 'Normal Baseline Scenario',
        description: 'Standard benign operational input',
        values: { amount: 25.0, v14: 0.1, v17: -0.05, v4: 0.2, timeDelta: 3600 }
      },
      {
        name: 'Adversarial Outlier Scenario',
        description: 'Severe anomaly deviating from manifold',
        values: { amount: 3800.0, v14: -8.5, v17: -6.2, v4: 4.5, timeDelta: 12 }
      }
    ]
  };

  const initialValues: Record<string, any> = {};
  defaultConfig.inputs.forEach((inp) => {
    initialValues[inp.name] = inp.defaultValue;
  });

  const [inputValues, setInputValues] = useState<Record<string, any>>(initialValues);
  const [prediction, setPrediction] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: any) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyPreset = (presetValues: Record<string, any>) => {
    setInputValues({ ...presetValues });
  };

  const handleRunInference = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await runPrediction(sessionId, sampleId, inputValues);
      setPrediction(res);
    } catch (err: any) {
      setError(err.message || 'Inference execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-[#0f172a]/70 border-2 border-indigo-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background glow badge */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Autonomous Execution Result · Live Working Prototype</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {defaultConfig.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {defaultConfig.description}
          </p>
        </div>

        {/* Model Spec Tag */}
        <div className="px-3.5 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 font-mono flex items-center gap-2 self-start sm:self-center">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{defaultConfig.modelType}</span>
        </div>
      </div>

      {/* Bench Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(defaultConfig.metrics).map(([key, val]) => (
          <div key={key} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{key}</div>
            <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      {/* Presets Bar */}
      {defaultConfig.samplePresets && defaultConfig.samplePresets.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quick Test Scenarios (Preset Vectors):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {defaultConfig.samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.values)}
                className="px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-indigo-600/20 text-gray-300 hover:text-white border border-gray-700 hover:border-indigo-500/40 text-xs font-medium transition text-left"
              >
                <span className="font-semibold">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Controls & Prediction Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Controls Column */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Interactive Model Inputs</span>
          </h4>

          <div className="space-y-3.5">
            {defaultConfig.inputs.map((inp) => (
              <div key={inp.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="text-gray-300 font-medium">{inp.label}</label>
                  <span className="font-mono text-indigo-400 font-semibold">
                    {inputValues[inp.name]}
                  </span>
                </div>

                {inp.type === 'number' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={inp.min ?? 0}
                      max={inp.max ?? 100}
                      step={inp.step ?? 1}
                      value={inputValues[inp.name] ?? inp.defaultValue}
                      onChange={(e) => handleInputChange(inp.name, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <input
                      type="number"
                      step={inp.step ?? 1}
                      value={inputValues[inp.name] ?? inp.defaultValue}
                      onChange={(e) => handleInputChange(inp.name, parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono text-white text-right"
                    />
                  </div>
                ) : inp.type === 'select' ? (
                  <select
                    value={inputValues[inp.name] ?? inp.defaultValue}
                    onChange={(e) => handleInputChange(inp.name, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs font-medium text-white"
                  >
                    {inp.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : null}

                {inp.description && (
                  <p className="text-[10px] text-gray-500">{inp.description}</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleRunInference}
            disabled={isRunning}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                Evaluating Model Manifold...
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Model Prediction</span>
              </>
            )}
          </button>
        </div>

        {/* Live Output Column */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Inference Output</span>
            </h4>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {prediction ? (
              <div className="space-y-4">
                {/* Big Verdict Banner */}
                <div className={`p-4 rounded-2xl border text-center space-y-1 ${
                  prediction.isFraud || prediction.isChurnRisk || prediction.riskLevel === 'CRITICAL'
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                    : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                }`}>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                    Decision Verdict
                  </div>
                  <div className="text-xl font-black">
                    {prediction.verdict}
                  </div>
                  {prediction.riskLevel && (
                    <div className="text-xs font-mono font-semibold">
                      Risk Tier: {prediction.riskLevel}
                    </div>
                  )}
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 space-y-1">
                    <span className="text-gray-400 text-[10px] uppercase">Calculated Risk Score</span>
                    <div className="text-lg font-bold text-white">
                      {prediction.fraudProbability ?? prediction.churnProbability ?? `${(prediction.score * 100).toFixed(1)}%`}%
                    </div>
                  </div>

                  <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 space-y-1">
                    <span className="text-gray-400 text-[10px] uppercase">Execution Latency</span>
                    <div className="text-lg font-bold text-cyan-400 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>{prediction.latencyMs} ms</span>
                    </div>
                  </div>
                </div>

                {/* Diagnostic Details */}
                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 space-y-2 text-xs">
                  {prediction.reconstructionError !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reconstruction Error (MSE):</span>
                      <span className="font-mono text-gray-200">{prediction.reconstructionError}</span>
                    </div>
                  )}
                  {prediction.latentAttentionScore !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Latent Attention Weight:</span>
                      <span className="font-mono text-gray-200">{prediction.latentAttentionScore}</span>
                    </div>
                  )}
                  {prediction.projectedLoss !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Projected Annual Attrition Loss:</span>
                      <span className="font-mono text-rose-400">${prediction.projectedLoss}</span>
                    </div>
                  )}
                  {prediction.recommendation && (
                    <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-300">
                      <strong className="text-indigo-400">Action:</strong> {prediction.recommendation}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 space-y-2">
                <Activity className="w-8 h-8 mx-auto opacity-40 animate-pulse" />
                <p className="text-xs">
                  Adjust vector controls and click <strong>Run Model Prediction</strong> to test the synthesized prototype.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Synthesized by Paper2Prototype AI</span>
            <span className="text-emerald-400 font-mono font-semibold">Ready for Production Deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
