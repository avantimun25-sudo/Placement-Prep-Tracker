import { useState } from "react";
import { useCompanies } from "@/hooks/use-companies";
import { useCompanyNotes, useCreateCompanyNote, useUpdateCompanyNote, useDeleteCompanyNote } from "@/hooks/use-company-notes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Save, X, NotebookPen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyNotes() {
  const { data: companies = [] } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const { data: notes = [], isLoading } = useCompanyNotes(selectedCompanyId ? parseInt(selectedCompanyId) : undefined);
  const createNote = useCreateCompanyNote();
  const updateNote = useUpdateCompanyNote();
  const deleteNote = useDeleteCompanyNote();
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleSave = async () => {
    if (!selectedCompanyId) return;
    try {
      if (editingId) {
        await updateNote.mutateAsync({ id: editingId, title: newTitle, content: newContent });
        toast({ title: "Success", description: "Note updated successfully" });
      } else {
        await createNote.mutateAsync({
          companyId: parseInt(selectedCompanyId),
          title: newTitle,
          content: newContent
        });
        toast({ title: "Success", description: "Note created successfully" });
      }
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save note", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewTitle("");
    setNewContent("");
  };

  const startEdit = (note: any) => {
    setEditingId(note.id);
    setNewTitle(note.title);
    setNewContent(note.content);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote.mutateAsync(id);
        toast({ title: "Success", description: "Note deleted" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete note", variant: "destructive" });
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <NotebookPen className="w-8 h-8 text-primary" />
            Company-wise Notes
          </h1>
          <p className="text-muted-foreground mt-1">Store interview prep, HR notes, and follow-ups</p>
        </div>
        
        <div className="w-full md:w-64">
          <Label htmlFor="company-select">Select Company</Label>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger id="company-select">
              <SelectValue placeholder="Choose a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedCompanyId ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-12 text-center">
            <NotebookPen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Company Selected</h3>
            <p className="text-muted-foreground">Select a company from the dropdown to view or add notes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Notes for {companies.find(c => c.id.toString() === selectedCompanyId)?.companyName}</h2>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Add Note
              </Button>
            )}
          </div>

          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle>{editingId ? "Edit Note" : "New Note"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g., Technical Round 1 Topics" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Write your notes here..." 
                        rows={6}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={resetForm} className="gap-2">
                        <X className="w-4 h-4" /> Cancel
                      </Button>
                      <Button onClick={handleSave} className="gap-2" disabled={!newTitle || !newContent}>
                        <Save className="w-4 h-4" /> Save Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">No notes found for this company. Click "Add Note" to get started.</p>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <CardDescription>
                        Updated {new Date(note.updatedAt || note.createdAt!).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(note)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
