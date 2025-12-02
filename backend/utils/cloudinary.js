import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

// Load correct backend .env file
dotenv.config({ path: path.resolve("backend/.env") });

// DEBUG LOG
console.log("Cloudinary Loaded ENV:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING"
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
