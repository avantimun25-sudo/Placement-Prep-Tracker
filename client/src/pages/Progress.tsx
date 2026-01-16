import { useSkills } from "@/hooks/use-skills";
import { useGoals } from "@/hooks/use-goals";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from "recharts";

export default function Progress() {
  const { data: skills = [] } = useSkills();
  const { data: goals = [] } = useGoals();

  const skillsData = skills.map(skill => ({
    name: skill.name,
    Current: skill.proficiency || 0,
    Target: skill.targetLevel || 100,
  }));

  const technicalProficiency = skills
    .filter(s => s.category === 'technical')
    .reduce((acc, s) => acc + (s.proficiency || 0), 0) / (skills.filter(s => s.category === 'technical').length || 1);

  const aptitudeProficiency = skills
    .filter(s => s.category === 'aptitude')
    .reduce((acc, s) => acc + (s.proficiency || 0), 0) / (skills.filter(s => s.category === 'aptitude').length || 1);

  const softSkillsProficiency = skills
    .filter(s => s.category === 'soft-skills')
    .reduce((acc, s) => acc + (s.proficiency || 0), 0) / (skills.filter(s => s.category === 'soft-skills').length || 1);

  const categoryData = [
    { name: 'Technical', score: Math.round(technicalProficiency), fill: '#8b5cf6' },
    { name: 'Aptitude', score: Math.round(aptitudeProficiency), fill: '#3b82f6' },
    { name: 'Soft Skills', score: Math.round(softSkillsProficiency), fill: '#10b981' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Detailed Analytics</h2>
        <p className="text-slate-500 mt-2">Visual insights into your preparation journey.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Proficiency Gap Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Skill Proficiency vs Target</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Current" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Radar/Radial */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Domain Mastery</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={categoryData}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="score"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
