import { Router, Request, Response } from "express";
import { conversationController } from "../controllers/conversationController";
const conversationRoutes = Router();

conversationRoutes.get("/:id", conversationController.getConversationOfUser);
conversationRoutes.post("/start", conversationController.startConversation);
conversationRoutes.get("/test", (_req: Request, res: Response) => {
  res.send('Servidor funcionando');
});

export default conversationRoutes;