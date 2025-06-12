"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useRef, useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic } from "lucide-react"
import axiosInstance from "@/axios/axios"
import { io } from "socket.io-client"
import VideoCallModal from "@/components/video-call-modal"
import axios from "axios"
import VoiceModal from "@/components/voice-modal"
import MessageItem from "@/components/message-item"
import { AttachmentMenu } from "@/components/attachment-menu"
import { FilePreview } from "@/components/file-preview"

interface ChatData {
  id: string
  name: string
  avatar: string
  isOnline: boolean
}

interface CallState {
  isInCall: boolean
  isInitiating: boolean
  isReceiving: boolean
  callType: "audio" | "video" | null
  remoteUserId: string | null
}

let socket: any = null

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.chatId as string
  const [user, setUser] = useState<string | null>(null)
  const [chatUser, setChatUser] = useState<any>(null)
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [socketMessages, setSocketMessages] = useState<any[]>([])
  const [sourceImage, setSourceImage] = useState<File | null>(null)
  const [targetImage, setTargetImage] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string>("")
  console.log(socketMessages, "socketMessages")
  // Video call states
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isInitiating: false,
    isReceiving: false,
    callType: null,
    remoteUserId: null,
  })

  // File attachment states
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  // Add SpeechRecognition type for TypeScript
  type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T }
    ? T
    : typeof window extends { webkitSpeechRecognition: infer T }
    ? T
    : any

  const [recognition, setRecognition] = useState<InstanceType<SpeechRecognitionType> | null>(null)

  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>
  const remoteVideoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${chatId}`,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const updloadImage = async (file: File, type: "source" | "target") => {
    if (!sourceImage || !targetImage) return alert("Both images are required")

    const formData = new FormData()
    formData.append("source", sourceImage)
    formData.append("target", targetImage)

    setResultUrl("")

    try {
      const response = await axios.post("http://192.168.33.36:5000/api/face-swap", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResultUrl(response.data.result)
    } catch (err: any) {
      console.error("Face swap failed:", err)
      alert("Face swap failed")
    } finally {
    }
  }
  useEffect(() => {
    if (sourceImage && targetImage) {
      updloadImage(sourceImage, "source")
    }
  }, [sourceImage, targetImage])
  // Initialize socket connection

  useEffect(() => {
    if (!socket) {
      socket = io("https://chat-backend-nskn.onrender.com", {
        transports: ["websocket", "polling"],
        autoConnect: false,
      })
    }

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id)
      if (user) {
        socket.emit("join", user)
      }
    }

    const handleMessage = (msg: any) => {
      console.log("📨 Message received:", msg)
      setSocketMessages((prev) => [...prev, msg])
    }

    const handleIncomingCall = ({ from, callType }: { from: string; callType: "audio" | "video" }) => {
      console.log("📞 Incoming call from:", from, "Type:", callType)
      setCallState({
        isInCall: false,
        isInitiating: false,
        isReceiving: true,
        callType,
        remoteUserId: from,
      })
    }

    const handleCallAccepted = async ({ from }: { from: string }) => {
      console.log("✅ Call accepted by:", from)
      setCallState((prev) => ({
        ...prev,
        isInitiating: false,
        isInCall: true,
      }))
      await createOffer()
    }

    const handleCallRejected = ({ from }: { from: string }) => {
      console.log("❌ Call rejected by:", from)
      endCall()
    }

    const handleCallEnded = ({ from }: { from: string }) => {
      console.log("📞 Call ended by:", from)
      endCall()
    }

    const handleWebRTCOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log("📡 Received WebRTC offer from:", from)
      await handleOffer(offer, from)
    }

    const handleWebRTCAnswer = async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
      console.log("📡 Received WebRTC answer from:", from)
      await handleAnswer(answer)
    }

    const handleWebRTCIceCandidate = async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
      console.log("🧊 Received ICE candidate from:", from)
      await handleIceCandidate(candidate)
    }

    const handleCallFailed = ({ reason }: { reason: string }) => {
      console.log("❌ Call failed:", reason)
      alert(`Call failed: ${reason}`)
      endCall()
    }

    socket.on("connect", handleConnect)
    socket.on("message", handleMessage)
    socket.on("incoming-call", handleIncomingCall)
    socket.on("call-accepted", handleCallAccepted)
    socket.on("call-rejected", handleCallRejected)
    socket.on("call-ended", handleCallEnded)
    socket.on("webrtc-offer", handleWebRTCOffer)
    socket.on("webrtc-answer", handleWebRTCAnswer)
    socket.on("webrtc-ice-candidate", handleWebRTCIceCandidate)
    socket.on("call-failed", handleCallFailed)

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      socket.off("connect", handleConnect)
      socket.off("message", handleMessage)
      socket.off("incoming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccepted)
      socket.off("call-rejected", handleCallRejected)
      socket.off("call-ended", handleCallEnded)
      socket.off("webrtc-offer", handleWebRTCOffer)
      socket.off("webrtc-answer", handleWebRTCAnswer)
      socket.off("webrtc-ice-candidate", handleWebRTCIceCandidate)
      socket.off("call-failed", handleCallFailed)
    }
  }, [user])

  useEffect(() => {
    const savedUser = localStorage.getItem("chatAppUser")
    if (!savedUser) {
      router.push("/")
      return
    }
    setUser(savedUser)
    fetchChatData()
    fetchMessages(savedUser, chatId)
  }, [router, chatId])

  // File handling functions
  const handleFileSelect = async (file: File, type: string) => {
    if (!file) return
    setSelectedFiles((prev) => [...prev, file])
    setShowAttachmentMenu(false)
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadAndSendFile = async (file: File, type: string) => {
    if (!user || !chatId) return
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", user)
      formData.append("chatId", chatId)
      formData.append("fileType", type)

      const response = await fetch("http://localhost:5000/api/chat/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      // Send message with file attachment
      if (socket) {
        socket.emit("sendMessage", {
          sender: user,
          recipient: chatId,
          content: `📎 ${result.fileName}`,
          fileUrl: result.fileUrl,
          fileName: result.fileName,
          fileType: result.fileType,
          fileSize: result.fileSize,
          timestamp: new Date().toISOString(),
        })
      }

      // Remove file from preview after successful upload
      setSelectedFiles((prev) => prev.filter((f) => f !== file))
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const sendSelectedFiles = async () => {
    if (selectedFiles.length === 0) return

    for (const file of selectedFiles) {
      const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : "document"
      await uploadAndSendFile(file, type)
    }

    setSelectedFiles([])
  }

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu)
  }

  const fetchMessages = async (userId: string, chatUserId: string) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}/${chatUserId}`)
      setSocketMessages(res.data)
    } catch (error) {
      console.error("❌ Error fetching messages:", error)
    }
  }

  const fetchChatData = async () => {
    try {
      const chatUser = await axiosInstance.get(`/get-user-by-id/${chatId}`)
      setChatUser(chatUser.data)
      setChatData(null)
    } catch (error) {
      console.error("❌ Error fetching chat data:", error)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: { resultIndex: any; results: string | any[] }) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript + interimTranscript)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onerror = (event: { error: any }) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        if (event.error === "not-allowed") {
          alert("Microphone access was denied. Please allow microphone access in your browser settings.")
        }
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const startListening = () => {
    if (recognition) {
      setTranscript("")
      recognition.start()
      setIsListening(true)
    } else {
      alert("Speech recognition is not supported in your browser")
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)

      // Auto-send the message after a short delay to ensure transcript is complete
      setTimeout(() => {
        if (transcript.trim() && socket) {
          socket.emit("sendMessage", {
            sender: user,
            recipient: chatId,
            content: transcript.trim(),
            timestamp: new Date().toISOString(),
          })
          setShowVoiceModal(false)
          setTranscript("")
        }
      }, 300)
    }
  }

  const handleVoiceModalOpen = () => {
    setShowVoiceModal(true)
    setTranscript("")
  }

  const handleVoiceModalClose = () => {
    setShowVoiceModal(false)
    stopListening()
    setTranscript("")
  }

  // WebRTC Functions
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

    peerConnectionRef.current = new RTCPeerConnection(configuration)

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("webrtc-ice-candidate", {
          to: callState.remoteUserId || chatId,
          candidate: event.candidate,
        })
      }
    }

    peerConnectionRef.current.ontrack = (event) => {
      console.log("📺 Received remote stream")
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    peerConnectionRef.current.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", peerConnectionRef.current?.connectionState)
    }

    return peerConnectionRef.current
  }

  const startCall = async (callType: "audio" | "video") => {
    try {
      console.log(`📞 Starting ${callType} call to:`, chatId)

      // Check available devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasAudio = devices.some(d => d.kind === "audioinput")
      const hasVideo = devices.some(d => d.kind === "videoinput")

      if (callType === "audio" && !hasAudio) {
        alert("No microphone found. Please connect a microphone and try again.")
        return
      }
      if (callType === "video" && !hasVideo) {
        alert("No camera found. Please connect a camera and try again.")
        return
      }

      setCallState({
        isInCall: false,
        isInitiating: true,
        isReceiving: false,
        callType,
        remoteUserId: chatId,
      })

      // Get user media
      const constraints = {
        audio: hasAudio,
        video: callType === "video" && hasVideo,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Initialize peer connection
      const peerConnection = initializePeerConnection()

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      // Emit call initiation
      if (socket) {
        socket.emit("initiate-call", {
          to: chatId,
          from: user,
          callType,
        })
      }
    } catch (error: any) {
      console.error("❌ Error starting call:", error)
      if (error.name === "NotFoundError") {
        alert("Required device not found. Please check your camera/microphone.")
      } else if (error.name === "NotAllowedError") {
        alert("Permission denied. Please allow access to your camera/microphone.")
      } else {
        alert(error.message || "Failed to start call. Please check your camera/microphone permissions.")
      }
      endCall()
    }
  }

  const acceptCall = async () => {
    try {
      console.log("✅ Accepting call")

      const constraints = {
        audio: true,
        video: callState.callType === "video",
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      const peerConnection = initializePeerConnection()

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      setCallState((prev) => ({
        ...prev,
        isReceiving: false,
        isInCall: true,
      }))

      if (socket) {
        socket.emit("accept-call", {
          to: callState.remoteUserId,
          from: user,
        })
      }
    } catch (error) {
      console.error("❌ Error accepting call:", error)
      alert("Failed to accept call. Please check your camera/microphone permissions.")
      rejectCall()
    }
  }

  const rejectCall = () => {
    console.log("❌ Rejecting call")
    if (socket) {
      socket.emit("reject-call", {
        to: callState.remoteUserId,
        from: user,
      })
    }
    endCall()
  }

  const endCall = () => {
    console.log("📞 Ending call")

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    // Emit call end if we're in a call
    if ((callState.isInCall || callState.isInitiating) && socket) {
      socket.emit("end-call", {
        to: callState.remoteUserId || chatId,
        from: user,
      })
    }

    // Reset call state
    setCallState({
      isInCall: false,
      isInitiating: false,
      isReceiving: false,
      callType: null,
      remoteUserId: null,
    })
  }

  const createOffer = async () => {
    if (!peerConnectionRef.current || !socket) return

    try {
      console.log("📡 Creating WebRTC offer")
      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)

      socket.emit("webrtc-offer", {
        to: callState.remoteUserId || chatId,
        offer,
      })
    } catch (error) {
      console.error("❌ Error creating offer:", error)
    }
  }

  const handleOffer = async (offer: RTCSessionDescriptionInit, from: string) => {
    if (!peerConnectionRef.current || !socket) return

    try {
      console.log("📡 Handling WebRTC offer from:", from)
      await peerConnectionRef.current.setRemoteDescription(offer)
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)

      socket.emit("webrtc-answer", {
        to: from,
        answer,
      })
    } catch (error) {
      console.error("❌ Error handling offer:", error)
    }
  }

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return

    try {
      console.log("📡 Handling WebRTC answer")
      await peerConnectionRef.current.setRemoteDescription(answer)
    } catch (error) {
      console.error("❌ Error handling answer:", error)
    }
  }

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return

    try {
      console.log("🧊 Adding ICE candidate")
      await peerConnectionRef.current.addIceCandidate(candidate)
    } catch (error) {
      console.error("❌ Error handling ICE candidate:", error)
    }
  }

  const handleMicClick = () => {
    handleVoiceModalOpen()
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [socketMessages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || !socket) return

    setIsTyping(true)

    try {
      socket.emit("sendMessage", {
        sender: user,
        recipient: chatId,
        content: input,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.log("Error sending message:", error)
    }

    // Clear input
    handleInputChange({ target: { value: "" } } as any)
    setIsTyping(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (!user || !chatUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header - Fixed Top */}
      <header className="bg-gray-100 border-b border-gray-200 p-4 fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/chat">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="relative">
            <Avatar className="w-12 h-12 bg-slate-500">
              <AvatarFallback className="text-lg bg-pink-500">
                {chatUser?.username
                  ?.split(" ")
                  .map((word: string) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {chatUser?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="font-medium text-gray-900">{chatUser.username}</h2>
            <p className="text-sm text-gray-500">{chatUser?.isOnline ? "online" : "last seen recently"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startCall("audio")}
              disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
              title="Voice call"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startCall("video")}
              disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
              title="Video call"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ paddingTop: 140, paddingBottom: 90 }}>
        {socketMessages?.length === 0 && (
          <div className="text-center py-12">
            <Avatar className="w-20 h-20 mx-auto mb-4 bg-slate-500">
              <AvatarFallback className="text-2xl bg-pink-500">
                {chatUser?.username
                  ?.split(" ")
                  .map((word: string) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{chatUser.username}</h3>
            <p className="text-gray-500">Start a conversation</p>
          </div>
        )}


        {socketMessages?.map((message, index) => (
          <div
            key={message._id || index}
            className={`flex ${message?.sender === user ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg rounded-lg px-3 py-2 relative ${message.sender === user ? "bg-green-500 text-white" : "bg-white border border-gray-200 text-gray-900"
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className={`text-xs mt-1 ${message.sender === user ? "text-green-100" : "text-gray-500"}`}>
                {message.timestamp ? formatTime(new Date(message.timestamp)) : formatTime(new Date())}
              </div>
              <div
                className={`absolute top-0 w-0 h-0 ${message.sender === user
                    ? "right-[-8px] border-l-[8px] border-l-green-500 border-t-[8px] border-t-transparent"
                    : "left-[-8px] border-r-[8px] border-r-white border-t-[8px] border-t-transparent"
                  }`}
              />
            </div>
          </div>
        ))}
        {/* {socketMessages?.map((message, index) => (
          <MessageItem key={message._id || index} message={message} currentUser={user} />
        ))} */}

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

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="bg-gray-50 p-2 border-t fixed bottom-16 left-0 right-0 z-10 max-h-32 overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              type={file.type.startsWith("image/") ? "image" : "document"}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}
        </div>
      )}

      {/* Message Input - Fixed Bottom */}
      <div className="bg-gray-100 p-4 fixed bottom-0 left-0 right-0 z-20">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm">
            <Smile className="w-5 h-5" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleAttachmentClick}>
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message"
            disabled={isLoading}
            className="flex-1 bg-white"
          />

          {/* {input.trim() ? (
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700"> */}
          {input.trim() || selectedFiles.length > 0 ? (

            <Button

              type={input.trim() ? "submit" : "button"}

              onClick={input.trim() ? undefined : sendSelectedFiles}

              className="bg-green-600 hover:bg-green-700"

              disabled={isUploading}

            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="sm" onClick={handleMicClick}>
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>
      </div>

      {/* Attachment Menu */}
      <AttachmentMenu
        isOpen={showAttachmentMenu}
        onClose={() => setShowAttachmentMenu(false)}
        onFileSelect={handleFileSelect}
      />

      {/* Video Call Modal */}
      <VideoCallModal
        callState={callState}
        chatUser={chatUser}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        onAcceptCall={acceptCall}
        onRejectCall={rejectCall}
        onEndCall={endCall}
      />

      {/* Voice Modal */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={handleVoiceModalClose}
        isListening={isListening}
        transcript={transcript}
        onStartListening={startListening}
        onStopListening={stopListening}
      />
    </div>
  )

}
