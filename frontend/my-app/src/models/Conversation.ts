import { Message } from "./Message";
import { User } from "./User";

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  other_username?: string;
  other_user_id?: string;
}

export interface FullConversation extends Conversation {
  users: User[];
}