import {pool} from  '../config/db';
import {v4 as uuidv4} from 'uuid';


export interface Conversation {
    id: string;
    user1_id: string;
    user2_id: string;
    createdAt: Date;
}

export const getConversationsByUser = async (userId: string) => {
    const [rows] = await pool.query('SELECT * FROM conversations WHERE user1_id = ? OR user2_id = ?', [userId, userId]);
    return rows as Conversation[];
};

export const getConversationById = async (id: string) => {
    const [rows] = await pool.query('SELECT * FROM conversations WHERE id = ?', [id]);
    return (rows as Conversation[])[0] || null;
};

export const createConversation = async(conversation: Omit<Conversation, 'id' | 'createdAt'>) => {
    const id = uuidv4();
    await pool.query('INSERT INTO conversations (id, user1_id, user2_id) VALUES (?,?,?)', [id,conversation.user1_id, conversation.user2_id])
    return {
        id,     
        user1_id: conversation.user1_id,
        user2_id: conversation.user2_id,
        createdAt: new Date()
    };
}
