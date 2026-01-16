import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Routes
  app.post("/api/register", async (req, res) => {
    try {
      const result = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByEmail(result.email);
      if (existing) return res.status(400).json({ message: "User already exists" });
      const user = await storage.createUser(result);
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/profile", async (req, res) => {
    try {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ message: "User ID required" });
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Simple API test route
  app.get("/api/health", async (_req, res) => {
    res.json({ status: "ok", message: "Server is running and connected to DB" });
  });

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
