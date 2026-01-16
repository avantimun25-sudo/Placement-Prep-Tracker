import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id).notNull(),
  name: text("name").notNull(),
  level: integer("level").default(1),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  targetDate: timestamp("target_date"),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  industry: text("industry"),
  website: text("website"),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertSkillSchema = createInsertSchema(skills);
export const selectSkillSchema = createSelectSchema(skills);
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = z.infer<typeof selectSkillSchema>;

export const insertGoalSchema = createInsertSchema(goals);
export const selectGoalSchema = createSelectSchema(goals);
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = z.infer<typeof selectGoalSchema>;

export const insertCompanySchema = createInsertSchema(companies);
export const selectCompanySchema = createSelectSchema(companies);
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = z.infer<typeof selectCompanySchema>;
