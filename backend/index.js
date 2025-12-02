
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./utils/db.js";
import UserRoute from "./routes/user.route.js";
import CompanyRoute from "./routes/company.route.js";
import JobRoute from "./routes/job.route.js";
import ApplicationRoute from "./routes/application.route.js";

// 🔥 FIX: Load .env specifically from backend folder
dotenv.config({ path: path.resolve("backend/.env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/company", CompanyRoute);
app.use("/api/v1/job", JobRoute);
app.use("/api/v1/application", ApplicationRoute);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    });
