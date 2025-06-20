import {User} from '../models/User';
import {getUserByEmail, getUserById, createUser, getUsersByConversationId} from '../repositories/userRepo';

export const getUsers = async () => {

};

export const getUserInfo = async (id: number) => {
   return await getUserById(id);
};

export const findUserByEmail = async (email: string) => {
   return await getUserByEmail(email);
}

export const registerUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
   return await createUser(user);
}

export const getUsersInfoByConversationId = async (conversationId: string) => {
   return await getUsersByConversationId(conversationId);
}