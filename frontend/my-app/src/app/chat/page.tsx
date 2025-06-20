/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Conversation } from "@/models/Conversation"
import { useSocket } from "@/hooks/useSocket" // Asegurate de tener este hook
import api from "@/lib/api"
export default function Chat() {
  const [typingConversations, setTypingConversations] = useState<
    Record<string, boolean>
  >({})
  const user = useSelector((state: RootState) => state.user.user)
  const [conversations, setConversations] = useState<Conversation[]>([])

  const socketRef = useSocket()

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    const handleUserWriting = ({
      conversationId,
    }: {
      conversationId: string
    }) => {
      setTypingConversations(
        (prev) => (
          console.log(prev),
          {
            ...prev,
            [conversationId]: true,
          }
        )
      )
      setTimeout(() => {
        setTypingConversations((prev) => ({
          ...prev,
          [conversationId]: false,
        }))
      }, 3000)
    }

    socket.on("userWriting", handleUserWriting)
    return () => {
      socket.off("userWriting", handleUserWriting)
    }
  }, [socketRef])

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return
      try {
        const res = await api.get(`conversations/${user.id}`)
        setConversations(res.data)

        // 🔌 Unirse a todas las salas de las conversaciones
        const socket = socketRef.current
        if (socket) {
          res.data.forEach((conv: Conversation) => {
            console.log(conv.id)
            socket.emit("joinConversation", conv.id)
          })
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
      }
    }
    fetchConversations()
  }, [user])

  return (
    <>
      <div>{user ? `Welcome ${user.username}` : "Please log in"}</div>
      <div>
        <h1>Chats:</h1>

        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div key={conversation.id}>
              <a href={`/chat/${conversation.id}`}>
                {conversation.other_username}
              </a>
              {typingConversations[conversation.id] && (
                <span className="text-sm text-gray-500 italic ml-2">
                  está escribiendo...
                </span>
              )}
            </div>
          ))
        ) : (
          <p>No tienes conversaciones</p>
        )}
      </div>
    </>
  )
}
