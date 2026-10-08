import React from 'react';
import { PaperAnalysis } from '../types';
import {
  FileText,
  Target,
  Brain,
  Database,
  BarChart2,
  ListOrdered,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Layers,
  Sparkles
} from 'lucide-react';

interface PaperAnalysisCardProps {
  analysis: PaperAnalysis;
}

export const PaperAnalysisCard: React.FC<PaperAnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="bg-[#0f172a]/70 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
      {/* Paper Title Banner */}
      <div className="border-b border-gray-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Paper Analyst Agent · Extracted Technical Insights</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {analysis.title}
        </h2>
      </div>

      {/* Grid of Key Facets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Research Problem */}
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Research Problem</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {analysis.researchProblem}
          </p>
        </div>

        {/* Objective */}
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Target Objective</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {analysis.objective}
          </p>
        </div>

        {/* Methodology */}
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Methodology</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {analysis.methodology}
          </p>
        </div>

        {/* Algorithm / Models */}
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Algorithms & Models</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.algorithms.map((alg, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono"
              >
                {alg}
              </span>
            ))}
          </div>
        </div>

        {/* Dataset & Target */}
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Dataset Specification</span>
          </div>
          <div className="text-xs text-gray-200 font-semibold">{analysis.dataset.name}</div>
          <p className="text-xs text-gray-400 line-clamp-2">
            {analysis.dataset.description}
          </p>
          {analysis.dataset.targetColumn && (
            <div className="text-[11px] text-emerald-400/90 font-mono">
              Target: <span className="text-white">{analysis.dataset.targetColumn}</span>
            </div>
          )}
        </div>

        {/* Evaluation Metrics */}
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BarChart2 className="w-4 h-4" />
            <span>Evaluation Metrics</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.evaluationMetrics.map((metric, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Input Features & Target Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Input Features</div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.inputFeatures.map((feat, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs font-mono border border-gray-700">
                {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expected Model Output</div>
          <div className="text-xs sm:text-sm text-gray-200 font-mono bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            {analysis.output}
          </div>
        </div>
      </div>

      {/* Implementation Steps, Assumptions & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        {/* Steps */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <ListOrdered className="w-4 h-4" />
            <span>Key Implementation Steps</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {analysis.keyImplementationSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assumptions */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Assumptions</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {analysis.assumptions.map((assump, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{assump}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Potential Challenges</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {analysis.potentialChallenges.map((chal, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">⚠</span>
                <span>{chal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
