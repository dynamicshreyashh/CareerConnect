import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

const fail = (res, error, message) => {
  console.error(error);
  return res.status(500).json({ success: false, message });
};

export const registerCompany = async (req, res) => {
  try {
    const { companyName, description = "", website = "", location = "" } = req.body;
    const name = String(companyName || "").trim();
    if (!name) return res.status(400).json({ success: false, message: "Company name is required." });
    const existing = await Company.findOne({ name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }, userId: req.id });
    if (existing) return res.status(409).json({ success: false, message: "You have already added this company." });
    const company = await Company.create({ name, description: String(description).trim(), website: String(website).trim(), location: String(location).trim(), userId: req.id });
    return res.status(201).json({ success: true, message: "Company added to your workspace.", company });
  } catch (error) {
    return fail(res, error, "Unable to create the company.");
  }
};

export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, companies });
  } catch (error) {
    return fail(res, error, "Unable to load your companies.");
  }
};

export const getCompanyById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid company link." });
    const company = await Company.findOne({ _id: req.params.id, userId: req.id }).lean();
    if (!company) return res.status(404).json({ success: false, message: "Company not found in your recruiter account." });
    return res.status(200).json({ success: true, company });
  } catch (error) {
    return fail(res, error, "Unable to load this company.");
  }
};

export const updateCompany = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid company link." });
    const company = await Company.findOne({ _id: req.params.id, userId: req.id });
    if (!company) return res.status(404).json({ success: false, message: "Company not found in your recruiter account." });
    const { name, description, website, location } = req.body;
    if (name !== undefined && String(name).trim()) company.name = String(name).trim();
    if (description !== undefined) company.description = String(description).trim();
    if (website !== undefined) company.website = String(website).trim();
    if (location !== undefined) company.location = String(location).trim();
    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) return res.status(503).json({ success: false, message: "Company logo uploads are not configured on this server." });
      const uploaded = await cloudinary.uploader.upload(getDataUri(req.file).content, { folder: "careerconnect/companies" });
      company.logo = uploaded.secure_url;
    }
    await company.save();
    return res.status(200).json({ success: true, message: "Company information updated.", company });
  } catch (error) {
    return fail(res, error, "Unable to update this company.");
  }
};

export const deleteCompany = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid company link." });
    const company = await Company.findOne({ _id: req.params.id, userId: req.id });
    if (!company) return res.status(404).json({ success: false, message: "Company not found in your recruiter account." });
    const jobsCount = await Job.countDocuments({ company: company._id });
    if (jobsCount > 0) return res.status(409).json({ success: false, message: "This company has job postings. Remove those postings before deleting the company." });
    await company.deleteOne();
    return res.status(200).json({ success: true, message: "Company removed." });
  } catch (error) {
    return fail(res, error, "Unable to delete this company.");
  }
};
