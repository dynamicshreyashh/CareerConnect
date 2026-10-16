import express from "express";
import {
  getMe,
  getSavedJobs,
  login,
  logout,
  register,
  removeSavedJob,
  saveJob,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import { allowAny, profileUpload } from "../middlewares/multer.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

router.post("/register", allowAny, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMe);
router.post("/profile/update", isAuthenticated, profileUpload, updateProfile);
router.get("/saved-jobs", isAuthenticated, requireRole("student"), getSavedJobs);
router.post("/save-job/:id", isAuthenticated, requireRole("student"), saveJob);
router.delete("/save-job/:id", isAuthenticated, requireRole("student"), removeSavedJob);

export default router;
