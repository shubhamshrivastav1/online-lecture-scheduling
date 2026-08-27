import { Router } from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  adminTest,
  getAllInstructors,
} from "../controllers/auth.controller.js";

import {
  verifyJWT,
  isAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

// Get current logged-in user
router.get("/me", verifyJWT, getCurrentUser);

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Admin test
router.get("/admin-test", verifyJWT, isAdmin, adminTest);

// Get all instructors - Admin only
router.get("/instructors", verifyJWT, isAdmin, getAllInstructors);

export default router;