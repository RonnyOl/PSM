import { Router, Request, Response } from "express";

import { messageController } from "../controllers/messageController";
const messageRoutes = Router();

messageRoutes.get("/:conversationId", messageController.getMessagesByConversationPaginated);
messageRoutes.post("/send", messageController.sendMessage);

export default messageRoutes;