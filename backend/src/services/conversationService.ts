import { Conversation, FullConversation } from "../models/Conversation";
import { createConversationDB, getConversationBetweenUsers, getConversationByIdDB, getConversationsByUserDB } from "../repositories/conversationRepo";
import { getMessagesByConversationId } from "../repositories/messageRepo";
import { getUsersByConversationId } from "../repositories/userRepo";


export const getConversationWithMessagesAndUser = async (id: string, limit: number) : Promise<FullConversation | null> => {
  const conversation = await getConversationByIdDB(id);
  if (!conversation) return null;

  const messages = await getMessagesByConversationId(id, limit);
  const users = await getUsersByConversationId(id);
  return {
    ...conversation,
    messages,
    users
  };
};

export const createConversation = async (user1_id: string, user2_id: string): Promise<Conversation> => {
  const existingConversation = await getConversationBetweenUsers(user1_id, user2_id);
  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await createConversationDB(user1_id, user2_id);
  return conversation;
};

export const getConversationsByUser = async (userId: string): Promise<Conversation[]> => {
  const conversations = await getConversationsByUserDB(userId);
  return conversations;
};

