import { pool } from '../config/db';
import { Conversation } from '../models/Conversation';
import {v4 as uuidv4} from 'uuid';

export const getConversationsByUserDB = async (userId: string): Promise<Conversation[]> => {
   const [rows] = await pool.query(
    `
    SELECT 
      c.id,
      c.user1_id,
      c.user2_id,
      u.id AS other_user_id,
      u.username AS other_username
    FROM conversations c
    JOIN users u ON u.id = CASE
      WHEN c.user1_id = ? THEN c.user2_id
      ELSE c.user1_id
    END
    WHERE c.user1_id = ? OR c.user2_id = ?
    `,
    [userId, userId, userId]
  );
  return rows as Conversation[];
};

export const getConversationByIdDB = async (id: string): Promise<Conversation | null> => {
  const [rows] = await pool.query('SELECT * FROM conversations WHERE conversations.id = ?', [id]);
  return (rows as Conversation[])[0] || null;
};

export const createConversationDB = async (user1_id: string, user2_id: string): Promise<Conversation> => {
  const id = uuidv4();
  await pool.query(
    "INSERT INTO conversations (id, user1_id, user2_id) VALUES (?,?,?)",
    [id, user1_id, user2_id]
  );

  return { id, user1_id, user2_id };
};

export const getConversationBetweenUsers = async (user1_id: string, user2_id: string): Promise<Conversation | null> => {
  const [rows] = await pool.query(
    'SELECT * FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
    [user1_id, user2_id, user2_id, user1_id]
  );
  return (rows as Conversation[])[0] || null;
}

