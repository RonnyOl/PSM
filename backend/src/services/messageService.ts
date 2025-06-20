import {createMessage, getMessagesByConversationId} from '../repositories/messageRepo';
import {Message} from '../models/Message';




export const getMessagesByConversation = async (conversationId: string, limit: number, before?: Date) => {
    return await getMessagesByConversationId(conversationId, limit, before);
}

export const sendMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
        ...message,
    };
    return await createMessage(newMessage);
}