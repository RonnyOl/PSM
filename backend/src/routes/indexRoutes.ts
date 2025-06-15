import { Router, Request, Response } from "express";
import messageRoutes from "./messageRoutes";
import authRoutes from "./authRoutes";
import conversationRoutes from "./conversationRoutes";

const router = Router();

router.use("/user", authRoutes); // Apply auth middleware to user routes
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);

export default router;
