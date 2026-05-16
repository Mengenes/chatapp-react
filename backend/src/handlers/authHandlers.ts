import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../configs/db.ts";
import bcrypt from "bcrypt";
import { type CookieOptions } from "express";
import crypto from "crypto";
import { Resend } from "resend";

export interface DbUser {
  id: string;
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const accessSecret = process.env.JWT_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, accessSecret, { expiresIn: "30m" });
};

export const generateRefreshToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, refreshSecret, { expiresIn: "30d" });
};

export const firstGet = (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to auth route" });
};

export const authRegister = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Please Provide Required fields" });
  }
  if (password.length < 6 || password.length > 20) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const emailExists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user";

    const newUser = await pool.query(
      `INSERT INTO users (email, username, password, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, username, email, role`,
      [email, username, hashedPassword, role]
    );

    const user = newUser.rows[0];

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const authLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please Provide Required Fields" });
  }

  try {
    const user = await pool.query(
      "SELECT id, role, password, email, username FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userData = user.rows[0] as DbUser;

    const isMatched = await bcrypt.compare(password, userData.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Password or Email is incorrect" });
    }

    const accessToken = generateAccessToken(userData.id, userData.role);
    const refreshToken = generateRefreshToken(userData.id, userData.role);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        role: userData.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please enter your email" });
  }

  const userResult = await pool.query("SELECT id FROM users WHERE email=$1", [email]);

  if (userResult.rows.length === 0) {
    return res.status(200).json({
      message: "If an account with that email exists, we've sent a password reset link.",
    });
  }

  const user = userResult.rows[0];

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expire = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    `INSERT INTO password_resets (user_id, token, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at, updated_at = NOW()`,
    [user.id, hashedToken, expire]
  );

  const clientUrl = process.env.CLIENT_URL;
  const resetLink = `${clientUrl}/reset-password/${rawToken}`;

  await resend.emails.send({
    from: "Chat App <onboarding@resend.dev>",
    to: email,
    subject: "Reset Your Password Link - Valid for 15 minutes",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return res.status(200).json({
    message: "If an account with that email exists, we've sent a password reset link.",
  });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
  res.cookie("accessToken", "", { httpOnly: true, expires: new Date(0) });
  return res.json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, refreshSecret) as JwtPayload;

    const userResult = await pool.query("SELECT role FROM users WHERE id=$1", [decoded.id]);
    const role = userResult.rows[0].role;

    const newAccessToken = jwt.sign({ id: decoded.id, role }, accessSecret, {
      expiresIn: "30m",
    });

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });

    return res.json({ message: "Token refreshed" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }

  if (!token || Array.isArray(token)) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const result = await pool.query(
    `SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > NOW()`,
    [hashedToken]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const userId = result.rows[0].user_id;
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
  await pool.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);

  return res.json({ message: "Password reset successful" });
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT m.id, m.message, m.created_at, u.username
       FROM messages m
       JOIN users u ON u.id = m.user_id
       ORDER BY m.created_at ASC
       LIMIT 100`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load messages" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, username, is_online, last_seen FROM users ORDER BY username ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};