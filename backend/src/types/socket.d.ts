import type { JwtUser } from "../middlewares/socketAuth.ts"; // adjust path

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export {};