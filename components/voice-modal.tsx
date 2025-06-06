"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, X } from "lucide-react"

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
  isListening: boolean
  transcript: string
  onStartListening: () => void
  onStopListening: () => void
}

export default function VoiceModal({
  isOpen,
  onClose,
  isListening,
  transcript,
  onStartListening,
  onStopListening,
}: VoiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
        <DialogHeader className="bg-gradient-to-r from-indigo-200 to-cyan-200 px-8 py-5">
          <DialogTitle className="flex items-center gap-3 text-xl font-extrabold text-indigo-800">
            <Mic className="w-6 h-6 text-cyan-500 animate-bounce" />
            Voice to Text
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-8 py-8">
          {/* Microphone Visualization */}
          <div className="flex justify-center py-2">
            <div className="relative flex items-center justify-center">
              {/* Animated rings */}
              <span
                className={`absolute w-36 h-36 rounded-full border-4 ${
                  isListening
                    ? "border-cyan-300 animate-[ping_1.5s_ease-in-out_infinite]"
                    : "border-gray-200"
                }`}
                style={{ zIndex: 1 }}
              ></span>
              <span
                className={`absolute w-28 h-28 rounded-full border-4 ${
                  isListening
                    ? "border-indigo-300 animate-[ping_2s_ease-in-out_infinite]"
                    : "border-gray-100"
                }`}
                style={{ zIndex: 2 }}
              ></span>
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-colors duration-300 ${
                  isListening
                    ? "bg-gradient-to-br from-cyan-200 to-indigo-200 border-4 border-cyan-400 animate-[pulse_1.2s_infinite]"
                    : "bg-gray-100 border-4 border-gray-300"
                }`}
                style={{ zIndex: 3 }}
              >
                <Mic
                  className={`w-14 h-14 drop-shadow-lg transition-colors duration-300 ${
                    isListening ? "text-cyan-600 animate-pulse" : "text-gray-400"
                  }`}
                />
              </div>
              {/* Sparkle effect */}
              {isListening && (
                <span className="absolute right-2 top-2 w-4 h-4 bg-yellow-300 rounded-full opacity-80 animate-ping"></span>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center">
            <p
              className={`text-base font-semibold transition-colors duration-300 ${
                isListening ? "text-cyan-700" : "text-indigo-700"
              }`}
            >
              {isListening ? "Listening... Speak now" : "Tap the mic to start recording"}
            </p>
            {isListening && (
              <p className="text-xs text-indigo-500 mt-1 animate-fade-in">
                Message will be sent automatically when you stop recording
              </p>
            )}
          </div>

          {/* Transcript Display */}
          <div className="bg-white/80 rounded-xl p-5 min-h-[80px] border border-cyan-100 shadow-inner transition-all duration-300">
            <p className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {transcript ? (
                <span className="animate-fade-in">{transcript}</span>
              ) : (
                <span className="text-gray-400">Your speech will appear here...</span>
              )}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isListening ? (
              <Button
                onClick={onStartListening}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white px-8 py-2 rounded-full shadow-lg text-base font-semibold transition-all duration-300"
              >
                <Mic className="w-5 h-5 mr-2 animate-bounce" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={onStopListening}
                variant="destructive"
                className="px-8 py-2 rounded-full shadow-lg text-base font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
              >
                <MicOff className="w-5 h-5 mr-2 animate-pulse" />
                Stop & Send
              </Button>
            )}
          </div>

          {/* Cancel Button */}
          {!isListening && (
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-full py-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Dialog>
  )
}