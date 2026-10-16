import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 12000 },
  requirements: [{ type: String, trim: true }],
  salary: { type: Number, required: true, min: 0 },
  experienceLevel: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  jobType: { type: String, required: true, trim: true },
  position: { type: Number, required: true, min: 1 },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
}, { timestamps: true });

jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: "text", description: "text", location: "text" });

export const Job = mongoose.model("Job", jobSchema);
