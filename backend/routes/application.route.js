import express from "express";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import requireRole from "../middlewares/requireRole.js";
import { applyJob, checkApplication, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply/:id", isAuthenticated, requireRole("student"), applyJob);
router.get("/check/:id", isAuthenticated, requireRole("student"), checkApplication);
router.get("/get", isAuthenticated, requireRole("student"), getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, requireRole("recruiter"), getApplicants);
router.post("/status/:id/update", isAuthenticated, requireRole("recruiter"), updateStatus);

export default router;
