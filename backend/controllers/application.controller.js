import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

const handleError = (res, error, message) => {
  console.error(error);
  if (error?.code === 11000) return res.status(409).json({ success: false, message: "You have already applied to this job." });
  return res.status(500).json({ success: false, message });
};

export const checkApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ job: req.params.id, applicant: req.id }).select("_id status createdAt").lean();
    return res.status(200).json({ success: true, applied: Boolean(application), application: application || null });
  } catch (error) {
    return handleError(res, error, "Unable to check your application status.");
  }
};

export const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "This job is no longer available." });
    const existing = await Application.findOne({ job: job._id, applicant: req.id });
    if (existing) return res.status(409).json({ success: false, message: "You have already applied to this job." });
    const application = await Application.create({ job: job._id, applicant: req.id });
    job.applications.push(application._id);
    await job.save();
    return res.status(201).json({ success: true, message: "Application submitted successfully.", applicationId: application._id });
  } catch (error) {
    return handleError(res, error, "Unable to submit your application.");
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const application = await Application.find({ applicant: req.id })
      .sort({ createdAt: -1 })
      .populate({ path: "job", populate: { path: "company", select: "name logo website location" } })
      .lean();
    return res.status(200).json({ success: true, message: "Your applications", application });
  } catch (error) {
    return handleError(res, error, "Unable to load your applications.");
  }
};

export const getApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, created_by: req.id })
      .populate({ path: "applications", options: { sort: { createdAt: -1 } }, populate: { path: "applicant", select: "fullName email phoneNumber profile" } })
      .populate({ path: "company", select: "name logo" });
    if (!job) return res.status(404).json({ success: false, message: "Job not found in your recruiter account." });
    return res.status(200).json({ success: true, job });
  } catch (error) {
    return handleError(res, error, "Unable to load applicants.");
  }
};

export const updateStatus = async (req, res) => {
  try {
    const allowedStatuses = ["pending", "under review", "shortlisted", "interview", "accepted", "rejected"];
    const status = String(req.body.status || "").trim().toLowerCase();
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Choose a valid application status." });
    }
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found." });
    if (String(application.job.created_by) !== String(req.id)) {
      return res.status(403).json({ success: false, message: "You can only review applicants for jobs you posted." });
    }
    application.status = status;
    await application.save();
    return res.status(200).json({ success: true, message: "Application status updated.", application: { _id: application._id, status: application.status } });
  } catch (error) {
    return handleError(res, error, "Unable to update application status.");
  }
};
