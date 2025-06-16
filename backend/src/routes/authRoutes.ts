import { Router, Request, Response } from "express";
import { authController } from "../controllers/authController";

const authRoutes = Router();

// POST /api/auth/login
authRoutes.post("/login", authController.loginUser);

// POST /api/auth/register
authRoutes.post("/register", authController.register);

authRoutes.get('/me', authController.getUserInfo);

authRoutes.get('/test', (_req: Request, res: Response) => {
  res.send('Servidor funcionando');
});

export default authRoutes;
