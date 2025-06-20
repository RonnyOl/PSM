import { getMessageById, getMessages, createMessage} from '../repositories/messageRepo';
import { getMessagesByConversation } from '../services/messageService';


const getMessagesByConversationPaginated = async (req: any, res: any) => {
    const { conversationId } = req.params;
    const limit = parseInt(req.query.limit) || 10; // Valor por defecto
    const before = req.query.before ? new Date(req.query.before) : undefined;
    
    if (!conversationId) {
        res.status(400).json({ message: 'Falta el ID de la conversación.' });
        return;
    }

    try {
        const messages = await getMessagesByConversation(conversationId, limit, before);
        res.json(messages);
        return
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
        return
    }
}

const sendMessage = async (req: any, res: any) => {
    const { conversation_id, sender_id, message_text } = req.body;
    if (!conversation_id || !sender_id || !message_text) {
        res.status(400).json({ message: 'Faltan datos requeridos.' });
        return;
    }
  try {
    const message = await createMessage({
      conversation_id,
      sender_id,
      message_text,
    });
    res.status(201).json(message);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};


export const messageController = {
    getMessagesByConversationPaginated,
    sendMessage
};