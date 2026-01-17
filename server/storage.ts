import { users, userProfiles, resumes, skills, goals, companies, tips, companyNotes, type User, type InsertUser, type UserProfile, type InsertUserProfile, type Resume, type InsertResume, type Skill, type InsertSkill, type Goal, type InsertGoal, type Company, type InsertCompany, type Tip, type InsertTip, type CompanyNote, type InsertCompanyNote } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User Profile
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  upsertUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile>;

  // Resumes
  getResume(userId: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  deleteResume(userId: number): Promise<void>;

  // Skills
  getSkills(userId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill & { userId: number }): Promise<Skill>;
  updateSkill(id: number, userId: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number, userId: number): Promise<void>;

  // Goals
  getGoals(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal & { userId: number }): Promise<Goal>;
  toggleGoal(id: number, userId: number): Promise<Goal>;

  // Companies
  getCompanies(userId: number): Promise<Company[]>;
  createCompany(company: InsertCompany & { userId: number }): Promise<Company>;
  updateCompany(id: number, userId: number, company: Partial<InsertCompany>): Promise<Company>;

  // Company Notes
  getCompanyNotes(userId: number, companyId?: number): Promise<CompanyNote[]>;
  createCompanyNote(note: InsertCompanyNote & { userId: number }): Promise<CompanyNote>;
  updateCompanyNote(id: number, userId: number, note: Partial<InsertCompanyNote>): Promise<CompanyNote>;
  deleteCompanyNote(id: number, userId: number): Promise<void>;

  // Tips
  getTips(): Promise<Tip[]>;
  createTip(tip: InsertTip): Promise<Tip>; // For seeding
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(userId: number, updates: Partial<InsertUserProfile>): Promise<UserProfile> {
    const existing = await this.getUserProfile(userId);
    if (existing) {
      const [updated] = await db
        .update(userProfiles)
        .set(updates)
        .where(eq(userProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(userProfiles)
        .values({ ...updates, userId } as InsertUserProfile)
        .returning();
      return inserted;
    }
  }

  async getResume(userId: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.userId, userId));
    return resume;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(insertResume).returning();
    return resume;
  }

  async deleteResume(userId: number): Promise<void> {
    await db.delete(resumes).where(eq(resumes.userId, userId));
  }

  async getSkills(userId: number): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.userId, userId));
  }

  async createSkill(insertSkill: InsertSkill & { userId: number }): Promise<Skill> {
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }

  async updateSkill(id: number, userId: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const [updated] = await db.update(skills).set(updates).where(and(eq(skills.id, id), eq(skills.userId, userId))).returning();
    if (!updated) throw new Error("Skill not found");
    return updated;
  }

  async deleteSkill(id: number, userId: number): Promise<void> {
    await db.delete(skills).where(and(eq(skills.id, id), eq(skills.userId, userId)));
  }

  async getGoals(userId: number): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async createGoal(insertGoal: InsertGoal & { userId: number }): Promise<Goal> {
    const [goal] = await db.insert(goals).values(insertGoal).returning();
    return goal;
  }

  async toggleGoal(id: number, userId: number): Promise<Goal> {
    const goalList = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId))).limit(1);
    if (!goalList.length) throw new Error("Goal not found");
    const goal = goalList[0];
    
    const [updated] = await db
      .update(goals)
      .set({ isCompleted: !goal.isCompleted })
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
    return updated;
  }

  async getCompanies(userId: number): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.userId, userId));
  }

  async createCompany(insertCompany: InsertCompany & { userId: number }): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  async updateCompany(id: number, userId: number, updates: Partial<InsertCompany>): Promise<Company> {
    const [updated] = await db.update(companies).set(updates).where(and(eq(companies.id, id), eq(companies.userId, userId))).returning();
    if (!updated) throw new Error("Company not found");
    return updated;
  }

  async getCompanyNotes(userId: number, companyId?: number): Promise<CompanyNote[]> {
    if (companyId) {
      return await db.select().from(companyNotes).where(and(eq(companyNotes.userId, userId), eq(companyNotes.companyId, companyId)));
    }
    return await db.select().from(companyNotes).where(eq(companyNotes.userId, userId));
  }

  async createCompanyNote(insertNote: InsertCompanyNote & { userId: number }): Promise<CompanyNote> {
    const [note] = await db.insert(companyNotes).values(insertNote).returning();
    return note;
  }

  async updateCompanyNote(id: number, userId: number, updates: Partial<InsertCompanyNote>): Promise<CompanyNote> {
    const [updated] = await db
      .update(companyNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(companyNotes.id, id), eq(companyNotes.userId, userId)))
      .returning();
    if (!updated) throw new Error("Note not found");
    return updated;
  }

  async deleteCompanyNote(id: number, userId: number): Promise<void> {
    await db.delete(companyNotes).where(and(eq(companyNotes.id, id), eq(companyNotes.userId, userId)));
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
