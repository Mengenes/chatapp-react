import  type { Request, Response, NextFunction } from "express";


export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user; 


  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }

  
  next();
};