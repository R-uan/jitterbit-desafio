import "dotenv/config";
import config from "../common/config.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

/**
 * Authentication Middleware
 *
 * Validates JWT tokens in the Authorization header and extracts the user ID.
 * This middleware must be applied to protected routes that require authentication.
 */
export function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as CustomJwtPayload;
    const userId = parseInt(decoded.userId);
    req.userId = userId;
  } catch {
    return res.status(401).json({ error: "Authentication required" });
  }

  next();
}
