import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const resumeStorage = multer.diskStorage({
  destination: "resumes/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: uploadStorage });
const resumeUpload = multer({ storage: resumeStorage });

async function seedData() {
  // Seeding disabled to maintain clean user state
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Static file serving for uploads
  app.use("/uploads", express.static("uploads"));

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

  app.get("/api/profile", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const profile = await storage.getUserProfile(userId);
      res.json(profile || {});
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", upload.single("profile_image"), async (req, res) => {
    try {
      const { userId, fullName, email, phone, department, academicStatus, graduationYear } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      
      let profileImageUrl = undefined;
      if (req.file) {
        profileImageUrl = `/uploads/${req.file.filename}`;
      }

      const profile = await storage.upsertUserProfile(parseInt(userId.toString()), {
        fullName,
        email,
        phone,
        department,
        academicStatus,
        graduationYear: graduationYear ? parseInt(graduationYear.toString()) : undefined,
        profileImageUrl
      });
      res.json(profile);
    } catch (err) {
      console.error("Profile update error:", err);
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

  app.post("/api/skills", async (req, res) => {
    const { userId, skill_name, level } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const result = await storage.createSkill({
        userId: parseInt(userId.toString()),
        skillName: skill_name,
        level: level || 0,
        category: "technical", // Defaulting to avoid schema error
        targetLevel: 100
      });

      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
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
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) return res.status(401).json({ message: "User ID required" });
      const result = await storage.getGoals(userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.goals.create.path, async (req, res) => {
    try {
      const { userId, title, completed } = req.body;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      if (!title) return res.status(400).json({ message: "Missing title" });
      
      const result = await storage.createGoal({ 
        userId: parseInt(userId.toString()), 
        title, 
        isCompleted: !!completed 
      });
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
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

  app.post("/api/companies", async (req, res) => {
    const { userId, company_name, role, status } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!company_name || !role || !status) {
      return res.status(400).json({ error: "Missing fields" });
    }

    try {
      const result = await storage.createCompany({
        userId: parseInt(userId.toString()),
        companyName: company_name,
        role,
        status,
        notes: null
      });

      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
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

  // Company Notes
  app.get("/api/company-notes", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      
      const result = await storage.getCompanyNotes(userId, companyId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/api/company-notes", async (req, res) => {
    try {
      const { userId, companyId, title, content } = req.body;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      if (!companyId || !title || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await storage.createCompanyNote({
        userId: parseInt(userId.toString()),
        companyId: parseInt(companyId.toString()),
        title,
        content
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.put("/api/company-notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId, title, content } = req.body;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await storage.updateCompanyNote(id, userId, { title, content });
      res.json(result);
    } catch (err) {
      res.status(404).json({ message: "Note not found or unauthorized" });
    }
  });

  app.delete("/api/company-notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      await storage.deleteCompanyNote(id, userId);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ message: "Note not found or unauthorized" });
    }
  });

  // Tips
  app.get(api.tips.list.path, async (_req, res) => {
    const result = await storage.getTips();
    res.json(result);
  });

  // Resumes
  app.get("/api/resume", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) return res.status(400).json({ message: "User ID required" });
      const resume = await storage.getResume(userId);
      res.json(resume || null);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.post("/api/resume", resumeUpload.single("resume"), async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: "User ID required" });
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const existing = await storage.getResume(parseInt(userId));
      if (existing) {
        if (fs.existsSync(existing.filePath)) {
          fs.unlinkSync(existing.filePath);
        }
        await storage.deleteResume(parseInt(userId));
      }

      const resume = await storage.createResume({
        userId: parseInt(userId),
        fileName: req.file.originalname,
        filePath: req.file.path,
      });

      res.status(201).json(resume);
    } catch (err) {
      console.error("Resume upload error:", err);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  app.delete("/api/resume", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) return res.status(400).json({ message: "User ID required" });

      const resume = await storage.getResume(userId);
      if (!resume) return res.status(404).json({ message: "No resume found" });

      if (fs.existsSync(resume.filePath)) {
        fs.unlinkSync(resume.filePath);
      }
      await storage.deleteResume(userId);
      res.json({ success: true });
    } catch (err) {
      console.error("Resume delete error:", err);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  return httpServer;
}
