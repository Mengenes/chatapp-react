import { Router } from "express";
import { firstGet,authRegister,authLogin, logout,refreshToken, forgotPassword,resetPassword, getMessages,getUsers } from "../handlers/authHandlers.ts";
import { forgotLimiter, loginLimiter, resetLimiter } from "../middlewares/RateLimitters.ts";


const router=Router();

router.get("/", firstGet);

router.post("/register", authRegister);
router.post("/login", loginLimiter, authLogin);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotLimiter, forgotPassword);
router.post("/reset-password/:token",resetLimiter, resetPassword);
router.get("/messages", getMessages);
router.get("/users",getUsers);

export default router;