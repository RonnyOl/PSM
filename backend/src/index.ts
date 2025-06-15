import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUsers } from './models/User';
import indexRoutes from './routes/indexRoutes';
import cookieParser from 'cookie-parser'
import { Server } from "socket.io";
import { setupSocket } from "../src/socket"; 
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3001', // Cambia esto por el origen real de tu frontend
  credentials: true                // Muy importante para permitir cookies
}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (_req: Request, res: Response) => {
  res.send('Servidor funcionando');
});

app.get('/test', async (_req: Request, res: Response) => {
  const users = await getUsers();
  res.send(users);
});

app.use('/api', indexRoutes);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true
  }
});
setupSocket(io); // <- configurar listeners

server.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
});
