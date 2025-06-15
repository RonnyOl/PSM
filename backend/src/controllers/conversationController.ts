
import {Request, Response} from 'express';

import { getConversationsByUser, getConversationById, createConversation } from '../models/Conversation';



const getConversationOfUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const conversation = await getConversationsByUser(id);
    if (!conversation) {
        res.status(404).json({ message: 'Conversation not found' });
        return
    }
    res.json(conversation);
    return;
};

const startConversation = async(req: Request, res: Response) => {
    const { userId, userId2} = req.body;
    if (!userId || !userId2) {
        res.status(400).json({ message: 'Faltan datos.' });
        return;
    }
    const conversationCreated = await createConversation({
        user1_id: userId,
        user2_id: userId2
    });
    
    res.status(201).json(conversationCreated);
    return;
}

export const conversationController = {
    getConversationOfUser,
    startConversation
};
