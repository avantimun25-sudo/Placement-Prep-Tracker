import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedData() {
  const existingSkills = await storage.getSkills();
  if (existingSkills.length === 0) {
    await storage.createSkill({ name: "JavaScript", category: "technical", proficiency: 70, targetLevel: 90 });
    await storage.createSkill({ name: "React", category: "technical", proficiency: 60, targetLevel: 85 });
    await storage.createSkill({ name: "Communication", category: "soft-skills", proficiency: 80, targetLevel: 100 });
    await storage.createSkill({ name: "Problem Solving", category: "aptitude", proficiency: 50, targetLevel: 90 });
  }

  const existingCompanies = await storage.getCompanies();
  if (existingCompanies.length === 0) {
    await storage.createCompany({ name: "Google", role: "Software Engineer", status: "wishlist", notes: "Focus on DSA" });
    await storage.createCompany({ name: "Microsoft", role: "SDE I", status: "applied", notes: "Applied via referral" });
    await storage.createCompany({ name: "Amazon", role: "SDE", status: "interviewing", notes: "OA cleared" });
  }

  const existingTips = await storage.getTips();
  if (existingTips.length === 0) {
    await storage.createTip({ title: "STAR Method", category: "interview", content: "Situation, Task, Action, Result - use this for behavioral questions." });
    await storage.createTip({ title: "Resume Formatting", category: "resume", content: "Keep it to one page. Use action verbs. Quantify achievements." });
  }
  
  const existingGoals = await storage.getGoals();
  if (existingGoals.length === 0) {
    await storage.createGoal({ title: "Solve 2 LeetCode Mediums", isCompleted: false });
    await storage.createGoal({ title: "Update Resume", isCompleted: true });
    await storage.createGoal({ title: "Mock Interview", isCompleted: false });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  seedData();

  // Skills
  app.get(api.skills.list.path, async (_req, res) => {
    const result = await storage.getSkills();
    res.json(result);
  });

  app.post(api.skills.create.path, async (req, res) => {
    try {
      const input = api.skills.create.input.parse(req.body);
      const result = await storage.createSkill(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.patch(api.skills.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.skills.update.input.parse(req.body);
      const result = await storage.updateSkill(id, input);
      res.json(result);
    } catch (err) {
       res.status(404).json({ message: "Not found" });
    }
  });

  app.delete(api.skills.delete.path, async (req, res) => {
    try {
      await storage.deleteSkill(parseInt(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  });

  // Goals
  app.get(api.goals.list.path, async (_req, res) => {
    const result = await storage.getGoals();
    res.json(result);
  });

  app.post(api.goals.create.path, async (req, res) => {
    try {
      const input = api.goals.create.input.parse(req.body);
      const result = await storage.createGoal(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.patch(api.goals.toggle.path, async (req, res) => {
    try {
      const result = await storage.toggleGoal(parseInt(req.params.id));
      res.json(result);
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  });

  // Companies
  app.get(api.companies.list.path, async (_req, res) => {
    const result = await storage.getCompanies();
    res.json(result);
  });

  app.post(api.companies.create.path, async (req, res) => {
    try {
      const input = api.companies.create.input.parse(req.body);
      const result = await storage.createCompany(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.patch(api.companies.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.companies.update.input.parse(req.body);
      const result = await storage.updateCompany(id, input);
      res.json(result);
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  });

  // Tips
  app.get(api.tips.list.path, async (_req, res) => {
    const result = await storage.getTips();
    res.json(result);
  });

  return httpServer;
}
