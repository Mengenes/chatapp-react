import type  { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtUser } from "./socketAuth.ts";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUser;

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};