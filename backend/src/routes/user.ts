
import { Router } from "express";

import { deleteAccount, getMe, updateEmail, updatePassword, updateUsername } from "../handlers/userHandlers.ts";
import { authMiddleware } from "../middlewares/routeAuth.ts";


const router = Router();

router.patch('/update-email',authMiddleware, updateEmail);
router.patch('/update-password',authMiddleware, updatePassword);
router.patch('/update-username',authMiddleware, updateUsername);
router.delete('/delete-account',authMiddleware, deleteAccount);
router.get('/me',authMiddleware,getMe)

export default router;