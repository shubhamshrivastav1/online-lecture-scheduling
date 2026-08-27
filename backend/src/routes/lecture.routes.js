import { Router } from "express";

import {
  createLecture,
  getMyLectures,
  getAllLectures,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controller.js";

import {
  verifyJWT,
  isAdmin,
  isInstructor,
} from "../middleware/auth.middleware.js";

const router = Router();

// Admin creates lecture
router.post(
  "/",
  verifyJWT,
  isAdmin,
  createLecture
);

// Instructor sees own lectures
router.get(
  "/my-lectures",
  verifyJWT,
  isInstructor,
  getMyLectures
);

// Admin sees all lectures
router.get(
  "/",
  verifyJWT,
  isAdmin,
  getAllLectures
);

// Admin updates lecture
router.put(
  "/:id",
  verifyJWT,
  isAdmin,
  updateLecture
);

// Admin deletes lecture
router.delete(
  "/:id",
  verifyJWT,
  isAdmin,
  deleteLecture
);

export default router;