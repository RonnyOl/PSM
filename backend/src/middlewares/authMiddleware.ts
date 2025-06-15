import { NextFunction, Request, Response  } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const autheenticateToken = (req: Request, res: Response, next: NextFunction) : void => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    return 
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
    return;
  }
}