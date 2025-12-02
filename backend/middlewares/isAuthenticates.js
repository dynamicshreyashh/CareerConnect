import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Check if token is missing
    if (!token) {
      return res.status(401).json({
        message: "User not Authenticated",
        success: false,
      });
    }

    // Verify the token - FIXED: Changed SECRET_KEY to JWT_SECRET
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // If verification fails, handle it
    if (!decode) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Invalid token signature",
        success: false,
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Token expired, please login again",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;