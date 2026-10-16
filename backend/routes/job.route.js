import express from "express";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import requireRole from "../middlewares/requireRole.js";
import { deleteJob, getAdminJobs, getAllJobs, getJobById, jobPost, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);
router.post("/post", isAuthenticated, requireRole("recruiter"), jobPost);
router.get("/getadminjobs", isAuthenticated, requireRole("recruiter"), getAdminJobs);
router.put("/:id", isAuthenticated, requireRole("recruiter"), updateJob);
router.delete("/:id", isAuthenticated, requireRole("recruiter"), deleteJob);

export default router;
