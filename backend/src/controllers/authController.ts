import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// Elimina los tipos de retorno Promise<Response> o Response
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Faltan datos.' });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'El usuario ya existe.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ username, email, password: hashedPassword });

    if (!newUser) {
      res.status(500).json({ message: 'Error al crear el usuario.' });
      return;
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1h' }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: 'Usuario registrado exitosamente.',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if ( !email || !password) {
      res.status(400).json({ message: 'Faltan datos.' });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Contraseña incorrecta.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1h' }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Inicio de sesión exitoso.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    if (!decoded || typeof decoded === 'string') {
      res.status(401).json({ message: 'Token inválido.' });
      return;
    }

    const user = await findUserByEmail(decoded.email);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return;
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
}

export const authController = {
  registerUser,
  loginUser,
  getUserInfo
};