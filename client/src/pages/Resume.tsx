import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export default function Resume() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setUploadStatus("uploading");
    // Mock upload delay
    setTimeout(() => {
      setUploadStatus("success");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Resume Review</h2>
        <p className="text-slate-500 mt-2">Upload your resume for AI analysis and score.</p>
      </div>

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          "relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer bg-white",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-200 hover:border-primary/50",
          uploadStatus === "success" && "border-green-200 bg-green-50/30"
        )}
      >
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept=".pdf,.doc,.docx"
        />
        
        <div className="flex flex-col items-center gap-4 pointer-events-none">
          <div className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
            uploadStatus === "success" ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
          )}>
            {uploadStatus === "success" ? (
              <CheckCircle2 className="w-10 h-10" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {uploadStatus === "success" ? "Resume Uploaded!" : "Upload Resume"}
            </h3>
            <p className="text-slate-500 mt-2">
              {file ? file.name : "Drag & drop or click to browse (PDF only)"}
            </p>
          </div>

          {uploadStatus === "uploading" && (
            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-primary animate-[loading_1s_ease-in-out_infinite]" style={{ width: '50%' }} />
            </div>
          )}
        </div>
      </div>

      {uploadStatus === "success" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Analysis Result</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider">ATS Score</span>
              <p className="text-3xl font-bold text-green-700 mt-1">92/100</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Keywords</span>
              <p className="text-3xl font-bold text-blue-700 mt-1">15/18</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Format</span>
              <p className="text-3xl font-bold text-orange-700 mt-1">Good</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-slate-700">Suggestions</h4>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 text-sm text-slate-600">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
              <p>Consider adding more metrics to your project descriptions (e.g., "Improved performance by 20%").</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 text-sm text-slate-600">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
              <p>Add a link to your GitHub profile or portfolio in the header.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
