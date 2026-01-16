import { useCompanies, useCreateCompany, useUpdateCompany } from "@/hooks/use-companies";
import { useState } from "react";
import { Plus, Building2, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function Companies() {
  const { data: companies = [] } = useCompanies();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ companyName: "", role: "", status: "applied", notes: "" });

  const statuses = [
    { id: 'applied', label: 'Applied', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'interviewing', label: 'Interviewing', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCompany.mutateAsync(newCompany);
    setIsModalOpen(false);
    setNewCompany({ companyName: "", role: "", status: "applied", notes: "" });
  };

  return (
    <div className="space-y-8 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Companies</h2>
          <p className="text-slate-500 mt-1">Track your job applications and interview status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] snap-x">
        {statuses.map(status => {
          const statusCompanies = companies.filter(c => c.status === status.id);
          
          return (
            <div key={status.id} className="min-w-[300px] w-[300px] flex-shrink-0 snap-start">
              <div className={`p-3 rounded-xl border mb-4 font-bold flex items-center justify-between ${status.color}`}>
                {status.label}
                <span className="bg-white/50 px-2 py-0.5 rounded-lg text-xs">{statusCompanies.length}</span>
              </div>
              
              <div className="space-y-4">
                {statusCompanies.map(company => (
                  <motion.div 
                    layoutId={String(company.id)}
                    key={company.id}
                    className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-move"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800">{company.companyName}</h4>
                    <p className="text-sm text-slate-500 mb-3">{company.role}</p>
                    
                    <select 
                      value={company.status}
                      onChange={(e) => updateCompany.mutate({ id: company.id, status: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {statuses.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}
                {statusCompanies.length === 0 && (
                  <div className="h-24 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 text-sm">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Company Modal */}
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
                <h3 className="text-xl font-bold text-slate-800">Add Company</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                  <input 
                    required
                    value={newCompany.companyName}
                    onChange={(e) => setNewCompany({...newCompany, companyName: e.target.value})}
                    placeholder="e.g. Google, Amazon"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                  <input 
                    required
                    value={newCompany.role}
                    onChange={(e) => setNewCompany({...newCompany, role: e.target.value})}
                    placeholder="e.g. SDE Intern"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select 
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({...newCompany, status: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {statuses.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
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
                    disabled={createCompany.isPending}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/25"
                  >
                    {createCompany.isPending ? "Saving..." : "Save"}
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
