import {pool} from '../config/db';
import {v4 as uuidv4} from 'uuid';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

export const getUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows as User[];
};

export const getUserById = async (id: number) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as User[])[0] || null;
}

export const findUserByEmail = async (email: string) => {
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