import { pool } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../models/Message';

// Obtener mensajes por conversación
export const getMessages = async (conversation_id: string, limit: number) => {
  const [rows] = await pool.query(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT ?',
    [conversation_id, limit]
  );
  return rows as Message[];
};

// Obtener un mensaje por ID
export const getMessageById = async (id: string) => {
  const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [id]);
  return (rows as Message[])[0] || null;
};

// Crear un nuevo mensaje
export const createMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
  const id = uuidv4();
  await pool.query(
    'INSERT INTO messages (id, conversation_id, sender_id, message_text) VALUES (?, ?, ?, ?)',
    [id, message.conversation_id, message.sender_id, message.message_text]
  );
  return { id, ...message, timestamp: new Date() };
};

export const getMessagesByConversationId = async (conversation_id: string, limit: number) => {
  const [rows] = await pool.query('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT ?', [conversation_id, limit]);
  return rows as Message[];
}
