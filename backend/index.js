import "./config/loadEnv.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./utils/db.js";
import UserRoute from "./routes/user.route.js";
import CompanyRoute from "./routes/company.route.js";
import JobRoute from "./routes/job.route.js";
import ApplicationRoute from "./routes/application.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
];

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "careerconnect-api" });
});
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/company", CompanyRoute);
app.use("/api/v1/job", JobRoute);
app.use("/api/v1/application", ApplicationRoute);

app.use((err, _req, res, _next) => {
  console.error("Unhandled request error:", err.message);
  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  res.status(status).json({
    success: false,
    message: status === 500 ? "Something went wrong. Please try again." : err.message,
  });
});

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI. Add it to backend/.env or your hosting environment.");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET. Add a long random secret to backend/.env or your hosting environment.");
  process.exit(1);
}

connectDB()
  .then(() => app.listen(PORT, () => console.log(`CareerConnect API listening on port ${PORT}`)))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

export default app;
