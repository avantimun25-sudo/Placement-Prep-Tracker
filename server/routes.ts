import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

async function seedData() {
  // Seeding disabled to maintain clean user state
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Routes
  app.post("/api/register", async (req, res) => {
    console.log("Register request body:", JSON.stringify(req.body));
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.createUser({
        email,
        password,
        name: null,
        phone: null,
        branch: null,
        academicStatus: null,
        graduationYear: null,
      });

      res.status(201).json({ id: user.id, email: user.email });
    } catch (err: any) {
      console.error("Registration error fully logged:", {
        code: err.code,
        message: err.message,
        detail: err.detail,
        stack: err.stack
      });
      
      // SQLITE_CONSTRAINT unique or Postgres unique constraint
      if (err.code === 'SQLITE_CONSTRAINT' || err.code === '23505' || err.message?.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: "User already exists" });
      }
      res.status(500).json({ message: "Registration failed", error: err.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`Login attempt for: ${email}`);
      
      const user = await storage.getUserByEmail(email);
      console.log(`DB query result for ${email}:`, user ? "User found" : "User NOT found");

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Return only essential info, no password
      res.json({ id: user.id, email: user.email });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const { userId, name, phone, branch, academicStatus, graduationYear } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      
      const user = await storage.updateUser(userId, {
        name,
        phone,
        branch,
        academicStatus,
        graduationYear
      });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Simple API test route
  app.get("/api/health", async (_req, res) => {
    res.json({ status: "ok", message: "Server is running and connected to DB" });
  });

  // seedData(); // Removed seed data on startup

  // Skills
  app.get(api.skills.list.path, async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (!userId) return res.status(400).json({ message: "User ID required" });
    const result = await storage.getSkills(userId);
    res.json(result);
  });

  app.post(api.skills.create.path, async (req, res) => {
    try {
      const { userId, ...data } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const input = api.skills.create.input.parse(data);
      const result = await storage.createSkill({ ...input, userId });
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
      const { userId, ...data } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const input = api.skills.update.input.parse(data);
      const result = await storage.updateSkill(id, userId, input);
      res.json(result);
    } catch (err) {
       res.status(404).json({ message: "Not found" });
    }
  });

  app.delete(api.skills.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);
      if (!userId) return res.status(400).json({ message: "User ID required" });
      await storage.deleteSkill(id, userId);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  });

  // Goals
  app.get(api.goals.list.path, async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (!userId) return res.status(400).json({ message: "User ID required" });
    const result = await storage.getGoals(userId);
    res.json(result);
  });

  app.post(api.goals.create.path, async (req, res) => {
    try {
      const { userId, ...data } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const input = api.goals.create.input.parse(data);
      const result = await storage.createGoal({ ...input, userId });
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.patch(api.goals.toggle.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const result = await storage.toggleGoal(id, userId);
      res.json(result);
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  });

  // Companies
  app.get(api.companies.list.path, async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (!userId) return res.status(400).json({ message: "User ID required" });
    const result = await storage.getCompanies(userId);
    res.json(result);
  });

  app.post(api.companies.create.path, async (req, res) => {
    try {
      const { userId, ...data } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const input = api.companies.create.input.parse(data);
      const result = await storage.createCompany({ ...input, userId });
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
      const { userId, ...data } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const input = api.companies.update.input.parse(data);
      const result = await storage.updateCompany(id, userId, input);
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
