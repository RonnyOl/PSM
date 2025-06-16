"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import api from "@/lib/api"; 

interface Message {
  id: string;
  sender_id: string;
  message_text: string;
}

interface User {
  id: string;
  username: string;
  email?: string;
}

export default function ChatPage() {
  // === Estados ===
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  // === Hooks ===
  const socketRef = useSocket();
  const { conversationId } = useParams();

  // === Funciones ===
  const fetchConversation = async () => {
    try {
      const res = await api.get(`/conversations/conversation/${conversationId}`);
      console.log("Conversación obtenida:", res.data);
      return setMessages(res.data.data?.messages || []);
    } catch (error) {
      console.error("Error al obtener conversación", error);
    }
  }

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data);
    } catch (error) {
      console.error("No autenticado o error al obtener usuario", error);
    }
  };

  const sendMessage = async () => {
    if (!user || newMessage.trim() === "") return;

    const messageData = {
      conversation_id: conversationId,
      sender_id: user.id,
      message_text: newMessage,
    };

    try {
      await api.post("/messages/send", messageData);

      const socket = socketRef.current;
      if (socket) {
        socket.emit("sendMessage", messageData);
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error al enviar mensaje", error);
    }
  };

  // === Efectos ===

  useEffect(() => {
    fetchUser();
    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("joinConversation", conversationId);

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socketRef, conversationId]);

  // === Render ===

  return (
    user ? (
      <div className="p-4 max-w-xl mx-auto">
      <div className="border h-96 overflow-y-scroll mb-4 p-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <b>{msg.sender_id}</b>: {msg.message_text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!user}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={!user || newMessage.trim() === ""}
        >
          Enviar
        </button>
      </div>
    </div>
    ) : (
      <div className="flex items-center justify-center h-screen">
        <p>No estás autenticado. Por favor, inicia sesión.</p>
      </div>
  ))
}
