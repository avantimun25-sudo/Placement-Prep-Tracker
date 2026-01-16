import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, RefreshCcw, ExternalLink, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function Resume() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = user.userId || user.id;

  const [isDragging, setIsDragging] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["/api/resume", userId],
    queryFn: async () => {
      const res = await fetch(`/api/resume?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch resume");
      return res.json();
    },
    enabled: !!userId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("userId", userId.toString());
      formData.append("resume", file);

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resume", userId] });
      toast({ title: "Success", description: "Resume uploaded successfully!" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/resume?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resume", userId] });
      toast({ title: "Success", description: "Resume deleted successfully!" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate(file);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Checking resume status...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Manage Resume</h2>
        <p className="text-slate-500 mt-2">Upload and manage your professional resume.</p>
      </div>

      {!resume ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={clsx(
            "relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer bg-white",
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-200 hover:border-primary/50",
            uploadMutation.isPending && "opacity-50 pointer-events-none"
          )}
        >
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".pdf"
          />
          
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className={clsx(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 bg-primary/10 text-primary",
              uploadMutation.isPending && "animate-pulse"
            )}>
              <Upload className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
              </h3>
              <p className="text-slate-500 mt-2">
                Drag & drop or click to browse (PDF only)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8 animate-in fade-in zoom-in-95">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <a 
                  href={resume.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-slate-900 text-lg hover:text-primary transition-colors flex items-center gap-2 group/link"
                >
                  {resume.fileName}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
                <p className="text-sm text-slate-500">Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200" asChild>
                <a href={resume.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> View
                </a>
              </Button>

              <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200" asChild>
                <a href={resume.url} download={resume.fileName}>
                  <Download className="w-4 h-4" /> Download
                </a>
              </Button>

              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  accept=".pdf"
                />
                <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200" asChild>
                  <span><RefreshCcw className="w-4 h-4" /> Replace</span>
                </Button>
              </label>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2 h-11 px-6 rounded-xl shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-300">
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your uploaded resume from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700 rounded-xl"
                      onClick={() => deleteMutation.mutate()}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
