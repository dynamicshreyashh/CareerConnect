import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

const errorResponse = (res, error, message = "Unable to complete this job action.") => {
  console.error(error);
  return res.status(500).json({ success: false, message });
};
const safeRegex = (value) => String(value).replace(/[.*+?^\x24{ }()|[\]\\]/g, "\\$&");

export const jobPost = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    if (![title, description, salary, location, jobType, experience, position, companyId].every((v) => v !== undefined && String(v).trim() !== "")) {
      return res.status(400).json({ success: false, message: "Complete every required field before publishing the job." });
    }
    const salaryValue = Number(salary);
    const experienceValue = Number(experience);
    const positionValue = Number(position);
    if (!Number.isFinite(salaryValue) || salaryValue < 0 || !Number.isFinite(experienceValue) || experienceValue < 0 || !Number.isInteger(positionValue) || positionValue < 1) {
      return res.status(400).json({ success: false, message: "Salary, experience, or number of openings is invalid." });
    }
    const company = await Company.findOne({ _id: companyId, userId: req.id });
    if (!company) return res.status(403).json({ success: false, message: "Choose a company managed by your recruiter account." });

    const job = await Job.create({
      title: String(title).trim(),
      description: String(description).trim(),
      requirements: Array.isArray(requirements)
        ? requirements.map(String).map((item) => item.trim()).filter(Boolean)
        : String(requirements || "").split(",").map((item) => item.trim()).filter(Boolean),
      salary: salaryValue,
      location: String(location).trim(),
      jobType: String(jobType).trim(),
      position: positionValue,
      experienceLevel: experienceValue,
      company: company._id,
      created_by: req.id,
    });
    const populatedJob = await Job.findById(job._id).populate("company");
    return res.status(201).json({ success: true, message: "Your job is live.", job: populatedJob });
  } catch (error) {
    return errorResponse(res, error, "Unable to publish the job.");
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    const filter = keyword
      ? { $or: [{ title: { $regex: safeRegex(keyword), $options: "i" } }, { description: { $regex: safeRegex(keyword), $options: "i" } }, { location: { $regex: safeRegex(keyword), $options: "i" } }] }
      : {};
    const jobs = await Job.find(filter).populate({ path: "company", select: "name logo location website description" }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, jobs, total: jobs.length });
  } catch (error) {
    return errorResponse(res, error, "Unable to load jobs.");
  }
};

export const getJobById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid job link." });
    const job = await Job.findById(req.params.id)
      .populate({ path: "company", select: "name logo location website description" })
      .lean();
    if (!job) return res.status(404).json({ success: false, message: "This job is no longer available." });
    return res.status(200).json({ success: true, job });
  } catch (error) {
    return errorResponse(res, error, "Unable to load this job.");
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ created_by: req.id })
      .populate({ path: "company", select: "name logo location website" })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, jobs, total: jobs.length });
  } catch (error) {
    return errorResponse(res, error, "Unable to load your job postings.");
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, created_by: req.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found in your recruiter account." });
    const allowed = ["title", "description", "location", "jobType", "salary", "experienceLevel", "position", "requirements"];
    for (const key of allowed) {
      if (req.body[key] === undefined) continue;
      if (["salary", "experienceLevel", "position"].includes(key)) {
        const numeric = Number(req.body[key]);
        if (!Number.isFinite(numeric) || numeric < 0 || (key === "position" && (!Number.isInteger(numeric) || numeric < 1))) {
          return res.status(400).json({ success: false, message: `Invalid value for ${key}.` });
        }
        job[key] = numeric;
      } else if (key === "requirements") {
        job.requirements = Array.isArray(req.body[key]) ? req.body[key] : String(req.body[key]).split(",");
      } else {
        job[key] = String(req.body[key]).trim();
      }
    }
    await job.save();
    const result = await Job.findById(job._id).populate("company");
    return res.status(200).json({ success: true, message: "Job updated.", job: result });
  } catch (error) {
    return errorResponse(res, error, "Unable to update this job.");
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, created_by: req.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found in your recruiter account." });
    const { Application } = await import("../models/application.model.js");
    await Application.deleteMany({ job: job._id });
    return res.status(200).json({ success: true, message: "Job posting and its applications were removed." });
  } catch (error) {
    return errorResponse(res, error, "Unable to delete this job.");
  }
};
