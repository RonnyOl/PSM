import { getMessageById, getMessages, createMessage} from "../models/Messages";



const getMessagesByConversation = async (req: any, res: any) => {
    const { conversationId } = req.params;
    if (!conversationId) {
        res.status(400).json({ message: 'Falta el ID de la conversación.' });
        return;
    }

    try {
        const messages = await getMessages(conversationId);
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
    getMessagesByConversation,
    sendMessage
};