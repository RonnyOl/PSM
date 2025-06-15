import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado:", socket.id);

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId); // se une a la sala
    });

    socket.on("sendMessage", (message) => {
      const { conversation_id } = message;
      
      io.to(conversation_id).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado:", socket.id);
    });
  });
};
