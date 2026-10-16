import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Please sign in to continue." });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Authentication is not configured." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id role fullName email");
    if (!user) {
      return res.status(401).json({ success: false, message: "Your account could not be found. Please sign in again." });
    }

    req.id = user._id.toString();
    req.user = user;
    return next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      message: expired ? "Your session expired. Please sign in again." : "Your session is invalid. Please sign in again.",
    });
  }
};

export default isAuthenticated;
