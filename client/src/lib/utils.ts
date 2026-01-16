import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Skill {
  id: number;
  userId: number;
  skillName: string;
  category: string;
  level: number | null;
  targetLevel: number | null;
}

export interface CategoryStat {
  avg: number;
  count: number;
}

export interface Stats {
  technical: CategoryStat;
  aptitude: CategoryStat;
  soft: CategoryStat;
  overallAvg: number;
  totalCount: number;
}

export function calculateStats(skills: Skill[]): Stats {
  const categories = ["technical", "aptitude", "soft"];
  
  const stats = categories.reduce((acc, category) => {
    const categorySkills = skills.filter(s => s.category === category);
    const avg = categorySkills.length 
      ? Math.round(categorySkills.reduce((sum, s) => sum + (s.level || 0), 0) / categorySkills.length)
      : 0;
    
    acc[category as keyof Omit<Stats, 'overallAvg' | 'totalCount'>] = {
      avg,
      count: categorySkills.length
    };
    return acc;
  }, {} as any);

  const overallAvg = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + (s.level || 0), 0) / skills.length)
    : 0;

  return {
    ...stats,
    overallAvg,
    totalCount: skills.length
  };
}
