import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
});
const publicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  profile: user.profile,
  savedJobs: user.savedJobs || [],
});
const handleError = (res, error, fallback = "Something went wrong. Please try again.") => {
  if (error?.code === 11000) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: fallback });
};

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!fullName?.trim() || !normalizedEmail || !phoneNumber || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, email, phone, password, and role are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({ success: false, message: "Choose a valid account type." });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const file = req.files?.find((item) => item.fieldname === "file");
    let profilePhoto = "";
    if (file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(503).json({ success: false, message: "Image uploads are not configured yet. Please try without a profile photo." });
      }
      const uploaded = await cloudinary.uploader.upload(getDataUri(file).content, { folder: "careerconnect/profiles" });
      profilePhoto = uploaded.secure_url;
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber: String(phoneNumber).trim(),
      password: await bcrypt.hash(password, 12),
      role,
      profile: { profilePhoto },
    });
    return res.status(201).json({ success: true, message: "Account created successfully. Please sign in.", user: publicUser(user) });
  } catch (error) {
    return handleError(res, error, "Unable to create your account.");
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Email, password, and account type are required." });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Authentication is not configured on this server." });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }
    if (role !== user.role) {
      return res.status(403).json({ success: false, message: "This account belongs to a different account type." });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.cookie("token", token, cookieOptions()).status(200).json({
      success: true,
      message: `Welcome back, ${user.fullName.split(" ")[0]}!`,
      user: publicUser(user),
    });
  } catch (error) {
    return handleError(res, error, "Unable to sign in.");
  }
};

export const logout = (_req, res) => {
  const { maxAge: _maxAge, ...options } = cookieOptions();
  return res.clearCookie("token", options).status(200).json({
    success: true,
    message: "You have been signed out.",
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return handleError(res, error, "Unable to load your account.");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const { fullName, email, phoneNumber, bio, skills } = req.body;
    if (fullName !== undefined) user.fullName = String(fullName).trim();
    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ success: false, message: "Please enter a valid email address." });
      }
      const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (duplicate) return res.status(409).json({ success: false, message: "That email is already in use." });
      user.email = normalizedEmail;
    }
    if (phoneNumber !== undefined) user.phoneNumber = String(phoneNumber).trim();
    if (bio !== undefined) user.profile.bio = String(bio).trim();
    if (skills !== undefined) {
      user.profile.skills = Array.isArray(skills)
        ? skills.map(String).map((skill) => skill.trim()).filter(Boolean)
        : String(skills).split(",").map((skill) => skill.trim()).filter(Boolean);
    }

    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(503).json({ success: false, message: "File uploads are not configured yet." });
      }
      const isResume = req.file.mimetype === "application/pdf" ||
        req.file.mimetype.includes("wordprocessingml") ||
        req.file.mimetype === "application/msword";
      const uploaded = await cloudinary.uploader.upload(getDataUri(req.file).content, {
        folder: isResume ? "careerconnect/resumes" : "careerconnect/profiles",
        resource_type: "auto",
      });
      if (isResume) {
        user.profile.resume = uploaded.secure_url;
        user.profile.resumeOriginalName = req.file.originalname;
      } else {
        user.profile.profilePhoto = uploaded.secure_url;
      }
    }

    await user.save();
    return res.status(200).json({ success: true, message: "Profile updated successfully.", user: publicUser(user) });
  } catch (error) {
    return handleError(res, error, "Unable to update your profile.");
  }
};

export const saveJob = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Only students can save jobs." });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    const user = await User.findById(req.id);
    const alreadySaved = user.savedJobs.some((id) => id.toString() === job._id.toString());
    if (alreadySaved) return res.status(409).json({ success: false, message: "This job is already saved." });
    user.savedJobs.push(job._id);
    await user.save();
    return res.status(200).json({ success: true, message: "Job saved for later.", savedJobs: user.savedJobs });
  } catch (error) {
    return handleError(res, error, "Unable to save this job.");
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Only students can view saved jobs." });
    const user = await User.findById(req.id).populate({ path: "savedJobs", populate: { path: "company" } }).select("savedJobs");
    return res.status(200).json({ success: true, jobs: user?.savedJobs || [] });
  } catch (error) {
    return handleError(res, error, "Unable to load saved jobs.");
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== req.params.id);
    await user.save();
    return res.status(200).json({ success: true, message: "Job removed from saved jobs.", savedJobs: user.savedJobs });
  } catch (error) {
    return handleError(res, error, "Unable to update saved jobs.");
  }
};
