import { Router } from "express";

import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

import {
  verifyJWT,
  isAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

// Create course
router.post(
  "/",
  verifyJWT,
  isAdmin,
  createCourse
);

// Get all courses
router.get(
  "/",
  verifyJWT,
  isAdmin,
  getAllCourses
);

// Get single course
router.get(
  "/:id",
  verifyJWT,
  isAdmin,
  getCourseById
);

// Update course
router.put(
  "/:id",
  verifyJWT,
  isAdmin,
  updateCourse
);

// Delete course
router.delete(
  "/:id",
  verifyJWT,
  isAdmin,
  deleteCourse
);

export default router;