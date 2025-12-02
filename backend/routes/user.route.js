import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
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

// Profile update → needs file upload
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);

export default router;
