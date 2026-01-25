// backend/controllers/company.controller.js

import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company Name is required",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register the same company again",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      description,
      website,
      location,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id });

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(400).json({
        message: "No company found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const { name, description, website, location } = req.body;

    console.log("REQ FILE =>", req.file); // Debug log

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Company logo needed",
        success: false,
      });
    }

    // Convert file to Data URI
    const fileUri = getDataUri(file);

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const updateData = { name, description, website, location, logo };

    const company = await Company.findByIdAndUpdate(companyId, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;

    if (!companyId) {
      return res.status(400).json({
        message: "Company ID is required",
        success: false,
      });
    }

    // Find the company and verify ownership
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // Check if the company belongs to the user
    if (company.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to delete this company",
        success: false,
      });
    }

    // Check if there are any jobs associated with this company
    const jobsCount = await Job.countDocuments({ company: companyId });
    if (jobsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete company. There are ${jobsCount} job(s) associated with this company. Please delete the jobs first.`,
        success: false,
      });
    }

    // Delete the company
    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
      message: "Company deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete company error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};
