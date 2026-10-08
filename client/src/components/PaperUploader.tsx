import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { SamplePaper } from '../types';

interface PaperUploaderProps {
  onUpload: (file: File) => Promise<void>;
  onSelectSample: (sampleId: string) => Promise<void>;
  samples: SamplePaper[];
  isLoading: boolean;
}

export const PaperUploader: React.FC<PaperUploaderProps> = ({
  onUpload,
  onSelectSample,
  samples,
  isLoading
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadError(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Invalid file type: Please upload a valid PDF research paper.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 15MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01]'
            : 'border-gray-800 hover:border-gray-700 bg-[#0f172a]/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Upload Research Paper PDF</h3>
            <p className="text-sm text-gray-400 mt-1">
              Drag & drop any machine learning or scientific publication, or click to browse.
            </p>
          </div>

          {selectedFile ? (
            <div className="bg-gray-900/90 border border-indigo-500/40 rounded-xl p-3 flex items-center justify-between text-left">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-sm font-medium text-white truncate">{selectedFile.name}</div>
                  <div className="text-xs text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
              </div>
              <button
                onClick={handleUploadClick}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <span>Extract & Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium border border-gray-700 transition shadow-sm"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              Select PDF File
            </button>
          )}

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* 1-Click Hackathon Judging Prepared Demo Papers */}
      <div className="bg-[#0f172a]/60 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">1-Click Prepared Research Papers (Judges Demo Mode)</h4>
          </div>
          <span className="text-xs text-gray-400">Zero-config instantaneous execution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {samples.map((sample) => (
            <div
              key={sample.id}
              onClick={() => !isLoading && onSelectSample(sample.id)}
              className="group p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-indigo-950/20 hover:border-indigo-500/40 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {sample.domain}
                  </span>
                  <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition" />
                </div>
                <h5 className="text-sm font-semibold text-gray-200 group-hover:text-white line-clamp-2">
                  {sample.title}
                </h5>
                <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                  {sample.abstract}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
                <span>Load & Run Autonomous Agent</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
