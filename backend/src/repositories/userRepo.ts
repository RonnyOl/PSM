import {pool} from '../config/db';
import {v4 as uuidv4} from 'uuid';
import { User } from '../models/User';

export const getUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows as User[];
};

export const getUserById = async (id: number) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as User[])[0] || null;
}

export const getUserByEmail = async (email: string) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return (rows as User[])[0] || null;
}

export const createUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
    const id = uuidv4();
    const [result] = await pool.query(
        'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
        [id, user.username, user.email, user.password]
    );
    return { id, ...user,  };
}

export const getUsersByConversationId = async (conversationId: string) : Promise<User[]> =>  {
    const [rows] = await pool.query(
        'SELECT u.id, u.username FROM conversations c JOIN users u ON u.id = c.user1_id OR u.id = c.user2_id WHERE c.id = ?',
        [conversationId]
    )
    return (rows as User[]);
}