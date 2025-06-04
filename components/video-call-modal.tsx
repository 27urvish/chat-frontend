"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Maximize2, Minimize2 } from "lucide-react"

interface CallState {
  isInCall: boolean
  isInitiating: boolean
  isReceiving: boolean
  callType: "audio" | "video" | null
  remoteUserId: string | null
}

interface VideoCallModalProps {
  callState: CallState
  chatUser: any
  localVideoRef: React.RefObject<HTMLVideoElement>
  remoteVideoRef: React.RefObject<HTMLVideoElement>
  onAcceptCall: () => void
  onRejectCall: () => void
  onEndCall: () => void
}

export default function VideoCallModal({
  callState,
  chatUser,
  localVideoRef,
  remoteVideoRef,
  onAcceptCall,
  onRejectCall,
  onEndCall,
}: VideoCallModalProps) {
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  if (!callState.isInCall && !callState.isInitiating && !callState.isReceiving) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div
        className={`relative w-full h-full ${isFullscreen ? "" : "max-w-4xl max-h-3xl"} bg-gray-900 rounded-lg overflow-hidden`}
      >
        {/* Incoming Call Screen */}
        {callState.isReceiving && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 text-white">
            <div className="text-center mb-8">
              <Avatar className="w-32 h-32 mx-auto mb-4 bg-slate-500">
                <AvatarFallback className="text-4xl bg-pink-500">
                  {chatUser?.username
                    ?.split(" ")
                    .map((word: any[]) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">{chatUser.username}</h2>
              <p className="text-lg opacity-90">Incoming {callState.callType} call...</p>
            </div>

            <div className="flex gap-8">
              <Button
                onClick={onRejectCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              <Button
                onClick={onAcceptCall}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
              >
                <Phone className="w-8 h-8" />
              </Button>
            </div>
          </div>
        )}

        {/* Calling Screen */}
        {callState.isInitiating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 text-white">
            <div className="text-center mb-8">
              <Avatar className="w-32 h-32 mx-auto mb-4 bg-slate-500">
                <AvatarFallback className="text-4xl bg-pink-500">
                  {chatUser?.username
                    ?.split(" ")
                    .map((word: any[]) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">{chatUser.username}</h2>
              <p className="text-lg opacity-90">Calling...</p>
            </div>

            <Button
              onClick={onEndCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
            >
              <PhoneOff className="w-8 h-8" />
            </Button>
          </div>
        )}

        {/* Active Call Screen */}
        {callState.isInCall && (
          <>
            {/* Remote Video */}
            <div className="relative w-full h-full">
              {callState.callType === "video" ? (
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Avatar className="w-32 h-32 mx-auto mb-4 bg-slate-500">
                      <AvatarFallback className="text-4xl bg-pink-500">
                        {chatUser?.username
                          ?.split(" ")
                          .map((word: any[]) => word[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-semibold">{chatUser.username}</h2>
                  </div>
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            {callState.callType === "video" && (
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>
            )}

            {/* Call Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
              {callState.callType === "video" && (
                <Button
                  onClick={toggleVideo}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isVideoEnabled ? "bg-gray-600 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
              )}

              <Button
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isAudioEnabled ? "bg-gray-600 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>

              <Button
                onClick={onEndCall}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>

              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
              >
                {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
              </Button>
            </div>

            {/* Call Info */}
            <div className="absolute top-4 left-4 text-white">
              <p className="text-sm opacity-75">
                {callState.callType === "video" ? "Video Call" : "Voice Call"} with {chatUser.username}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
