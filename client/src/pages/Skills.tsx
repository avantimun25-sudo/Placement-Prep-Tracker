import { useSkills, useCreateSkill, useDeleteSkill, useUpdateSkill } from "@/hooks/use-skills";
import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Skills() {
  const { data: skills = [], isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const updateSkill = useUpdateSkill();

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSkill, setNewSkill] = useState<{
      skillName: string;
      category: string;
      level: number;
      targetLevel: number;
    }>({ skillName: "", category: "", level: 50, targetLevel: 100 });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const categories = ["technical", "aptitude", "soft"];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = currentUser.id;

    if (!newSkill.skillName.trim()) {
      alert("Please enter a skill name");
      return;
    }

    if (!newSkill.category) {
      alert("Please select a category");
      return;
    }

    if (newSkill.level === undefined || newSkill.level < 0 || newSkill.level > 100) {
      alert("Please enter a valid level (0-100)");
      return;
    }

    try {
      await createSkill.mutateAsync({
        userId,
        skillName: newSkill.skillName.trim(),
        level: Number(newSkill.level),
        category: newSkill.category,
        targetLevel: Number(newSkill.targetLevel)
      });
      setIsModalOpen(false);
      setNewSkill({ skillName: "", category: "", level: 50, targetLevel: 100 });
    } catch (error) {
      console.error("Failed to create skill:", error);
      alert("Failed to add skill. Please try again.");
    }
  };

  const startEditing = (id: number, currentLevel: number) => {
    setEditingId(id);
    setEditValue(currentLevel.toString());
  };

  const handleSave = async (id: number) => {
    const level = parseInt(editValue);
    if (isNaN(level) || level < 0 || level > 100) {
      return;
    }
    await updateSkill.mutateAsync({ id, level });
    setEditingId(null);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading skills...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Skills Tracker</h2>
          <p className="text-slate-500 mt-1">Monitor your proficiency across different domains.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      <div className="grid gap-8">
        {categories.map(category => {
          const categorySkills = skills.filter(s => s.category === category);
          
          return (
            <div key={category} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 capitalize mb-6 flex items-center gap-3">
                <span className={`w-3 h-8 rounded-full ${
                  category === 'technical' ? 'bg-indigo-500' : 
                  category === 'aptitude' ? 'bg-blue-500' : 'bg-teal-500'
                }`} />
                {category === 'soft' ? 'Soft Skills' : category}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="group p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-700">{skill.skillName}</h4>
                      <div className="flex gap-2">
                        {editingId === skill.id ? (
                          <>
                            <button 
                              onClick={() => handleSave(skill.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditing(skill.id, skill.level || 0)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteSkill.mutate(skill.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                        <div className="flex items-center gap-2">
                          <span>Current:</span>
                          {editingId === skill.id ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-16 px-1 py-0.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 font-bold"
                              autoFocus
                            />
                          ) : (
                            <span className="text-slate-700 font-bold">{skill.level}%</span>
                          )}
                        </div>
                        <span>Target: {skill.targetLevel}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            category === 'technical' ? 'bg-indigo-500' : 
                            category === 'aptitude' ? 'bg-blue-500' : 'bg-teal-500'
                          }`}
                        />
                      </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {skills.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">No skills added yet. Start tracking your progress!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Add New Skill</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Skill Name</label>
                  <input 
                    required
                    value={newSkill.skillName}
                    onChange={(e) => setNewSkill({...newSkill, skillName: e.target.value})}
                    placeholder="e.g. React, Python, Communication"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select 
                    required
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(c => (
                      <option key={c} value={c} className="capitalize">{c === 'soft' ? 'Soft Skills' : c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Current %</label>
                    <input 
                      type="number"
                      min="0" max="100"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Target %</label>
                    <input 
                      type="number"
                      min="0" max="100"
                      value={newSkill.targetLevel}
                      onChange={(e) => setNewSkill({...newSkill, targetLevel: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={createSkill.isPending}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/25"
                  >
                    {createSkill.isPending ? "Adding..." : "Add Skill"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
