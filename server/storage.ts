import {
  skills, goals, companies, tips,
  type Skill, type InsertSkill,
  type Goal, type InsertGoal,
  type Company, type InsertCompany,
  type Tip, type InsertTip
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;

  // Goals
  getGoals(): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  toggleGoal(id: number): Promise<Goal>;

  // Companies
  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;

  // Tips
  getTips(): Promise<Tip[]>;
  createTip(tip: InsertTip): Promise<Tip>; // For seeding
}

export class DatabaseStorage implements IStorage {
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }

  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const [updated] = await db.update(skills).set(updates).where(eq(skills.id, id)).returning();
    if (!updated) throw new Error("Skill not found");
    return updated;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async getGoals(): Promise<Goal[]> {
    return await db.select().from(goals);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db.insert(goals).values(insertGoal).returning();
    return goal;
  }

  async toggleGoal(id: number): Promise<Goal> {
    const goal = await db.select().from(goals).where(eq(goals.id, id)).limit(1);
    if (!goal.length) throw new Error("Goal not found");
    
    const [updated] = await db
      .update(goals)
      .set({ isCompleted: !goal[0].isCompleted })
      .where(eq(goals.id, id))
      .returning();
    return updated;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  async updateCompany(id: number, updates: Partial<InsertCompany>): Promise<Company> {
    const [updated] = await db.update(companies).set(updates).where(eq(companies.id, id)).returning();
    if (!updated) throw new Error("Company not found");
    return updated;
  }

  async getTips(): Promise<Tip[]> {
    return await db.select().from(tips);
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const [tip] = await db.insert(tips).values(insertTip).returning();
    return tip;
  }
}

export const storage = new DatabaseStorage();
