import { useState, useRef } from "react"
import api from "@/lib/api"
import { Message } from "@/models/Message"

export function useChatMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const isFetchingRef = useRef(false)
  const hasMoreRef = useRef(true)

  const fetchMessages = async (before?: string) => {
    if (!hasMoreRef.current || isFetchingRef.current) return
    isFetchingRef.current = true

    const url = before
      ? `/messages/${conversationId}?limit=20&before=${before}`
      : `/messages/${conversationId}?limit=20`

    const res = await api.get(url)
    const data: Message[] = res.data

    data.reverse()
    if (data.length === 0) {
      hasMoreRef.current = false
      isFetchingRef.current = false
      return
    }
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id))
      const newMessages = data.reverse().filter((m) => !existingIds.has(m.id))
      return [...newMessages, ...prev]
    })

    isFetchingRef.current = false
  }

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg])
  }

  return { messages, fetchMessages, addMessage }
}
