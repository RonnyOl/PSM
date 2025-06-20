
import {Request, Response} from 'express';

import { createConversation, getConversationsByUser, getConversationWithUsers } from '../services/conversationService';



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

const getConversation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const conversation = await getConversationWithUsers(id);

  if (!conversation) {
     res.status(404).json({ message: 'Conversation not found' });
     return
  }

   res.status(200).json({
    message: 'Conversation retrieved successfully',
    data: {
      id: conversation.id,
      user1_id: conversation.user1_id,
      user2_id: conversation.user2_id,
      users: conversation.users,
    },
  });
  return
};


export const startConversation = async (req: Request, res: Response) => {
  const { userId, userId2 } = req.body;

  if (!userId || !userId2) {
     res.status(400).json({ message: "Faltan datos." });
    return
    }

  try {
    const conversationCreated = await createConversation(userId, userId2);
    
    res.status(201).json(conversationCreated);
    return
} catch (error) {
    console.error("Error al crear conversación:", error);
     res.status(500).json({ message: "Error interno del servidor." });
    return
    }
};

const conversationController = {
  getConversationOfUser,
  startConversation,
  getConversation,
};

export default conversationController;