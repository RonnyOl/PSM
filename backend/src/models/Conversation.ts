import { Message } from "./Message";
import { User } from "./User";

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
}
export interface ConversationWithMessages extends Conversation {
  messages: {
    id: string;
    sender_id: string;
    message_text: string;
    created_at: Date;
  }[];
}

export interface FullConversation extends Conversation {
  messages: Message[];
  users: User[];
}