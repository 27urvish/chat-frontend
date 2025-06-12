"use client"

import { useState } from "react"
import { FileText, ImageIcon, Headphones, Video, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessageItemProps {
  message: {
    _id?: string
    sender: string
    content: string
    timestamp: string
    fileUrl?: string
    fileName?: string
    fileType?: string
    fileSize?: number
  }
  currentUser: string
}

export default function MessageItem({ message, currentUser }: MessageItemProps) {
  const [showImagePreview, setShowImagePreview] = useState(false)
  const isOwnMessage = message.sender === currentUser

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Check if message contains a file attachment
  const hasFileAttachment = message.fileUrl && message.fileName

  // Determine file icon and type based on file type
  const getFileIcon = () => {
    if (!message.fileType) return <FileText className="w-5 h-5" />

    if (message.fileType.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5" />
    } else if (message.fileType.startsWith("audio/")) {
      return <Headphones className="w-5 h-5" />
    } else if (message.fileType.startsWith("video/")) {
      return <Video className="w-5 h-5" />
    } else {
      return <FileText className="w-5 h-5" />
    }
  }

  const isImage = message.fileType?.startsWith("image/")
  const isVideo = message.fileType?.startsWith("video/")

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg rounded-lg px-3 py-2 relative ${
          isOwnMessage ? "bg-green-500 text-white" : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        {hasFileAttachment ? (
          <div className="space-y-2">
            {/* Image Display */}
            {isImage && (
              <div className="relative">
                <img
                  src={message.fileUrl || "/placeholder.svg"}
                  alt={message.fileName}
                  className="rounded-md max-w-full h-auto max-h-64 cursor-pointer"
                  onClick={() => setShowImagePreview(!showImagePreview)}
                  onError={(e) => {
                    // Fallback to file display if image fails to load
                    e.currentTarget.style.display = "none"
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-black/20 hover:bg-black/40 text-white"
                  onClick={() => window.open(message.fileUrl, "_blank")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Video Display */}
            {isVideo && (
              <div className="relative">
                <video
                  src={message.fileUrl}
                  className="rounded-md max-w-full h-auto max-h-64"
                  controls
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* File Display for non-images */}
            {!isImage && !isVideo && (
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${isOwnMessage ? "bg-green-600" : "bg-gray-100"}`}
              >
                <div className={`p-2 rounded-lg ${isOwnMessage ? "bg-green-700" : "bg-white"}`}>{getFileIcon()}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isOwnMessage ? "text-white" : "text-gray-900"}`}>
                    {message.fileName}
                  </p>
                  <p className={`text-xs ${isOwnMessage ? "text-green-100" : "text-gray-500"}`}>
                    {message.fileSize ? formatFileSize(message.fileSize) : "Unknown size"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full ${
                    isOwnMessage ? "hover:bg-green-600 text-white" : "hover:bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => window.open(message.fileUrl, "_blank")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Text content if present */}
            {message.content && !message.content.startsWith("📎") && (
              <p className="text-sm whitespace-pre-wrap mt-2">{message.content}</p>
            )}
          </div>
        ) : (
          /* Regular text message */
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}

        <div className={`text-xs mt-1 ${isOwnMessage ? "text-green-100" : "text-gray-500"}`}>
          {message.timestamp ? formatTime(new Date(message.timestamp)) : formatTime(new Date())}
        </div>

        {/* Message tail */}
        <div
          className={`absolute top-0 w-0 h-0 ${
            isOwnMessage
              ? "right-[-8px] border-l-[8px] border-l-green-500 border-t-[8px] border-t-transparent"
              : "left-[-8px] border-r-[8px] border-r-white border-t-[8px] border-t-transparent"
          }`}
        />
      </div>
    </div>
  )
}
