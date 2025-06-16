import { Router, Request, Response } from "express";
import  conversationController  from "../controllers/conversationController";
import { autheenticateToken } from "../middlewares/authMiddleware";
const conversationRoutes = Router();

conversationRoutes.get("/:id", conversationController.getConversationOfUser);
conversationRoutes.post("/start", conversationController.startConversation);
conversationRoutes.get("/conversation/:id", conversationController.getConversation);

export default conversationRoutes;