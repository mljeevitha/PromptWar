import React, { useState } from 'react';
import { GeneratedFile } from '../types';
import { Code2, Copy, Check, FileCode, Folder, Terminal } from 'lucide-react';

interface CodeViewerProps {
  files: GeneratedFile[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!files || files.length === 0) {
    return (
      <div className="bg-[#0f172a]/70 border border-gray-800 rounded-3xl p-8 text-center text-gray-500">
        <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No code generated yet. Approve plan to synthesize codebase.</p>
      </div>
    );
  }

  const activeFile = files[activeFileIndex] || files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0f172a]/70 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header Banner */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">
            Coding Agent · Generated Workspace Architecture
          </h3>
          <span className="text-xs text-gray-500 ml-2 font-mono">
            {files.length} Files Generated
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs border border-gray-700 transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Copy File</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[420px]">
        {/* Left: File Tree Explorer */}
        <div className="border-r border-gray-800/80 bg-gray-950/40 p-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-1">
            Workspace Files
          </div>
          {files.map((file, idx) => {
            const isActive = idx === activeFileIndex;
            return (
              <button
                key={file.path}
                onClick={() => setActiveFileIndex(idx)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-mono transition ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                <span className="truncate">{file.path}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Code Content Display */}
        <div className="lg:col-span-3 flex flex-col bg-[#070b14]/80">
          <div className="px-5 py-2.5 bg-gray-950/80 border-b border-gray-800/60 flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="text-indigo-300">{activeFile.path}</span>
            <span className="text-gray-500">{activeFile.description}</span>
          </div>

          <div className="p-5 overflow-auto flex-1 max-h-[500px]">
            <pre className="font-mono text-xs text-gray-300 leading-relaxed">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
