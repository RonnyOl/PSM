import { Router, Request, Response } from "express";

import { messageController } from "../controllers/messageController";
const messageRoutes = Router();

messageRoutes.get("/:conversationId", messageController.getMessagesByConversation);
messageRoutes.post("/send", messageController.sendMessage);

export default messageRoutes;