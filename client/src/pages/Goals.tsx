import { useGoals, useCreateGoal, useToggleGoal } from "@/hooks/use-goals";
import { useState } from "react";
import { Plus, Check, Trash2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function Goals() {
  const { data: goals = [] } = useGoals();
  const createGoal = useCreateGoal();
  const toggleGoal = useToggleGoal();
  
  const [newGoal, setNewGoal] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    await createGoal.mutateAsync({ title: newGoal, isCompleted: false });
    setNewGoal("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Daily Goals</h2>
        <p className="text-slate-500 mt-2">Consistent small steps lead to big achievements.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleCreate} className="flex gap-4 mb-8">
          <input 
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="What do you want to achieve today?"
            className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-lg focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-400"
          />
          <button 
            type="submit"
            disabled={createGoal.isPending || !newGoal.trim()}
            className="px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        <div className="space-y-4">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={clsx(
                  "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                  goal.isCompleted 
                    ? "bg-green-50/50 border-green-100" 
                    : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-md"
                )}
              >
                <button
                  onClick={() => toggleGoal.mutate(goal.id)}
                  className={clsx(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    goal.isCompleted
                      ? "bg-green-500 border-green-500 text-white scale-110"
                      : "border-slate-300 text-transparent hover:border-primary"
                  )}
                >
                  <Check className="w-5 h-5" />
                </button>
                
                <div className="flex-1">
                  <span className={clsx(
                    "text-lg font-medium transition-all duration-300 block",
                    goal.isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700"
                  )}>
                    {goal.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {new Date(goal.date || "").toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {goals.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p>No goals set yet. Start with something small!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
