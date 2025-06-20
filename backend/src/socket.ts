import { Server } from "socket.io"
export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado:", socket.id)

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId) // se une a la sala
    })

    socket.on("sendMessage", (message) => {
      const { conversation_id } = message
      console.log("📨 Mensaje recibido en socket:", message)
      io.to(conversation_id).emit("newMessage", message)
    })

    socket.on("writing", ({ conversationId, userId }) => {
      /// 2. Recibe un objeto con conversationId y userId gracias a la señal de writing y ejecuta una señal que envia al front la informacion del userid quien escribe.
      socket.to(conversationId).emit("userWriting", { conversationId, userId })
    })

    socket.on("disconnect", () => {
      console.log("🔌 Cliente desconectado:", socket.id)
    })
  })
}
