import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  saveJob,
  getMe,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import { allowAny, singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Signup should accept ANY form-data (with or without file)
router.route("/register").post(allowAny, register);

// Login does not need multer
router.route("/login").post(login);

// Logout simple
router.route("/logout").get(logout);

// Get current user
router.route("/me").get(isAuthenticated, getMe);

// Profile update → needs file upload
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);

// Save job → only for students
router
  .route("/save-job/:id")
  .post(isAuthenticated, saveJob);

export default router;
