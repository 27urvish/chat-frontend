"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic } from "lucide-react"

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  unreadCount: number
  isOnline: boolean
}

interface ChatWindowProps {
  chat: Chat
  user: string
  onBack: () => void
}

export function ChatWindow({ chat, user, onBack }: ChatWindowProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${chat.id}`,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    setIsTyping(true)
    handleSubmit(e)
    setIsTyping(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="text-lg">{chat.avatar}</AvatarFallback>
            </Avatar>
            {chat.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="font-medium text-gray-900">{chat.name}</h2>
            <p className="text-sm text-gray-500">{chat.isOnline ? "online" : "last seen recently"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{chat.avatar}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{chat.name}</h3>
            <p className="text-gray-500">Start a conversation</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg rounded-lg px-3 py-2 relative ${
                message.role === "user" ? "bg-green-500 text-white" : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className={`text-xs mt-1 ${message.role === "user" ? "text-green-100" : "text-gray-500"}`}>
                {formatTime(new Date())}
              </div>

              {/* Message tail */}
              <div
                className={`absolute top-0 w-0 h-0 ${
                  message.role === "user"
                    ? "right-[-8px] border-l-[8px] border-l-green-500 border-t-[8px] border-t-transparent"
                    : "left-[-8px] border-r-[8px] border-r-white border-t-[8px] border-t-transparent"
                }`}
              />
            </div>
          </div>
        ))}

        {(isLoading || isTyping) && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-100 p-4">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm">
            <Smile className="w-5 h-5" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message"
            disabled={isLoading}
            className="flex-1 bg-white"
          />

          {input.trim() ? (
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="sm">
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
