import { useSkills } from "@/hooks/use-skills";
import { useGoals } from "@/hooks/use-goals";
import { useCompanies } from "@/hooks/use-companies";
import { StatCard } from "@/components/StatCard";
import { Trophy, Briefcase, CheckSquare, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const { data: skills = [] } = useSkills();
  const { data: goals = [] } = useGoals();
  const { data: companies = [] } = useCompanies();

  const completedGoals = goals.filter(g => g.isCompleted).length;
  const pendingGoals = goals.length - completedGoals;
  const activeApplications = companies.filter(c => ['applied', 'interviewing'].includes(c.status)).length;
  const offers = companies.filter(c => c.status === 'offer').length;
  const avgProficiency = skills.length 
    ? Math.round(skills.reduce((acc, s) => acc + (s.proficiency || 0), 0) / skills.length) 
    : 0;

  const chartData = [
    { name: 'Technical', value: skills.filter(s => s.category === 'technical').length },
    { name: 'Aptitude', value: skills.filter(s => s.category === 'aptitude').length },
    { name: 'Soft Skills', value: skills.filter(s => s.category === 'soft-skills').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 mt-2">Welcome back! Here's your preparation overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Skills Average" 
          value={skills.length > 0 ? `${avgProficiency}%` : "0%"} 
          icon={TrendingUp} 
          color="primary"
          trend={skills.length > 0 ? "+2% this week" : undefined}
        />
        <StatCard 
          label="Active Applications" 
          value={activeApplications} 
          icon={Briefcase} 
          color="blue"
        />
        <StatCard 
          label="Goals Completed" 
          value={completedGoals} 
          icon={CheckSquare} 
          color="green"
        />
        <StatCard 
          label="Offers Received" 
          value={offers} 
          icon={Trophy} 
          color="accent"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity / Goals */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Today's Focus</h3>
            <span className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No goals set for today. Add goals to track your progress.</p>
              </div>
            ) : (
              goals.slice(0, 5).map(goal => (
                <div key={goal.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${goal.isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                    {goal.isCompleted && <CheckSquare className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`flex-1 font-medium ${goal.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {goal.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skill Distribution Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Skill Distribution</h3>
          {skills.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
              <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
              <p>Add skills to see your distribution chart.</p>
            </div>
          ) : (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-sm text-slate-500">
                {chartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
