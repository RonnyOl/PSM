/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import api from "@/lib/api"
import { useChatMessages } from "@/hooks/useChatMessages"
import { Message } from "@/models/Message"

interface User {
  id: string
  username: string
}

export default function ChatPage() {
  const { conversationId } = useParams()
  const socketRef = useSocket()

  const [user, setUser] = useState<User | null>(null)
  const [userTyping, setUserTyping] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [userMap, setUserMap] = useState<Record<string, User>>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)

  const { messages, fetchMessages, addMessage } = useChatMessages(
    conversationId as string
  )

  // 🔹 Emitir que se está escribiendo
  const handleWriting = () => {
    if (!user) return
    socketRef.current?.emit("writing", {
      conversationId,
      userId: user.id,
    })
  }

  // 🔹 Enviar mensaje
  const sendMessage = async () => {
    if (!user || newMessage.trim() === "") return

    const msg = {
      conversation_id: conversationId,
      sender_id: user.id,
      message_text: newMessage,
    }

    const { data: savedMessage } = await api.post("/messages/send", msg)
    socketRef.current?.emit("sendMessage", savedMessage)
    setNewMessage("")
  }

  // 🔹 Manejo de scroll infinito hacia arriba
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = async () => {
      if (isFetchingRef.current) return
      if (container.scrollTop === 0 && messages.length > 0) {
        const oldest = messages[0]
        const before = oldest.timestamp
        const prevHeight = container.scrollHeight

        await fetchMessages(before)

        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight
          container.scrollTop = newHeight - prevHeight
        })
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [messages])

  // 🔹 Obtener usuario, participantes y mensajes iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      const [userRes, convRes] = await Promise.all([
        api.get("/user/me"),
        api.get(`/conversations/conversation/${conversationId}/`),
      ])

      setUser(userRes.data)

      const map: Record<string, User> = {}
      convRes.data.data.users.forEach((u: User) => {
        map[u.id] = u
      })
      setUserMap(map)

      await fetchMessages()
    }

    fetchInitialData()
  }, [conversationId])

  // 🔹 Socket: unión a la conversación y recepción de mensajes
  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    socket.emit("joinConversation", conversationId)

    const handleNewMessage = (msg: Message) => addMessage(msg)
    socket.on("newMessage", handleNewMessage)

    return () => {
      socket.off("newMessage", handleNewMessage)
    }
  }, [socketRef, conversationId])

  // 🔹 Socket: detección de "escribiendo"
  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    const handleUserWriting = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) {
        setUserTyping(userMap[userId]?.username || "Alguien")
        setTimeout(() => setUserTyping(null), 3000)
      }
    }

    socket.on("userWriting", handleUserWriting)
    return () => {
      socket.off("userWriting", handleUserWriting)
    }
  }, [socketRef, user, userMap])

  // 🔹 Render
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No estás autenticado</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      {userTyping && (
        <div className="text-sm text-gray-500 italic mb-1">
          {userTyping} está escribiendo...
        </div>
      )}

      <div
        ref={containerRef}
        className="h-96 overflow-y-scroll border p-2 mb-4"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <p className="font-semibold">{userMap[msg.sender_id]?.username}</p>
            <p>{msg.message_text}</p>
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
            handleWriting()
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
