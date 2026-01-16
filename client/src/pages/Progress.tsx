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
          <div className="flex flex-col md:flex-row items-center justify-center h-80 gap-10 md:gap-16">
            <div className="relative w-[210px] h-[210px] aspect-square flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="40%" 
                  outerRadius="100%" 
                  barSize={12} 
                  data={categoryData}
                  startAngle={90}
                  endAngle={450}
                >
                  <RadialBar
                    background
                    dataKey="score"
                    cornerRadius={10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900 leading-none">
                  {Math.round(categoryData.reduce((acc, curr) => acc + curr.score, 0) / categoryData.length)}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Average</span>
              </div>
            </div>
            <div className="flex flex-col gap-5 min-w-[160px]">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.fill }} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 leading-none mb-1 group-hover:text-primary transition-colors">{item.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.score}% Mastered</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
