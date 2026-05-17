import type { Request, Response } from "express";
import { pool } from "../configs/db.ts";
import bcrypt from "bcrypt";


export const getMe = async (req: Request, res:Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT id, username, email, role FROM users WHERE id=$1",
      [req.user.id]
    );

    return res.json(result.rows[0]);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const updateUsername = async (req:Request, res: Response) => {
  const userId = req.user?.id;
  const { newUsername } = req.body;

  if (!newUsername || newUsername.length < 3 || newUsername.length > 20) {
    return res.status(400).json({ message: "New username is not valid" });
  }

  const existing = await pool.query(
    "SELECT id FROM users WHERE username=$1 AND id != $2",
    [newUsername, userId]
  );

  if (existing.rows.length > 0) {
    return res.status(400).json({ message: "Username already taken" });
  }

  try {
    await pool.query("UPDATE users SET username=$1 WHERE id=$2", [newUsername, userId]);
    return res.json({ success: true, username: newUsername });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { newEmail, currentPassword } = req.body;

  if (!newEmail || !currentPassword) {
    return res.status(400).json({ message: "Email and current password required" });
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE id=$1", [userId]);
    const user = userResult.rows[0];

    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      return res.status(400).json({ message: "New email is the same as current email" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1 AND id != $2",
      [newEmail, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use. Please choose a different email" });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Incorrect password" });

    await pool.query("UPDATE users SET email=$1 WHERE id=$2", [newEmail, userId]);
    return res.json({ success: true, email: newEmail });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Invalid password" });
  }

  try {
    const userResult = await pool.query("SELECT password FROM users WHERE id=$1", [userId]);
    const user = userResult.rows[0];

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashed, userId]);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword } = req.body;

  try {
    const userResult = await pool.query("SELECT password FROM users WHERE id=$1", [userId]);
    const user = userResult.rows[0];

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Incorrect password" });

    await pool.query("DELETE FROM users WHERE id=$1", [userId]);
    return res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};