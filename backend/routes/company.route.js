import express from "express";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import requireRole from "../middlewares/requireRole.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import { companyLogoUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", isAuthenticated, requireRole("recruiter"), registerCompany);
router.get("/get", isAuthenticated, requireRole("recruiter"), getCompany);
router.get("/get/:id", isAuthenticated, requireRole("recruiter"), getCompanyById);
router.put("/update/:id", isAuthenticated, requireRole("recruiter"), companyLogoUpload, updateCompany);
router.delete("/delete/:id", isAuthenticated, requireRole("recruiter"), deleteCompany);

export default router;
