// Server / middleware / auth.js
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

/* -------- Require Authentication -------- */
export const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required to access this resource.",
      });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Your authentication token is invalid.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your authentication token has expired.",
      });
    }

    if (error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Your authentication token is not yet valid.",
      });
    }

    console.error(
      "Authentication Middleware Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while verifying your authentication.",
      error: `Authentication Middleware Error: ${error?.stack || error?.message || error}`,
    });
  }
};
