"use client"

import type React from "react"

import { useRef } from "react"
import { FileText, ImageIcon, Camera, Headphones, Contact, BarChart2, Sticker, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AttachmentMenuProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect: (file: File, type: string) => void
}

export function AttachmentMenu({ isOpen, onClose, onFileSelect }: AttachmentMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>
  const imageInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>
  const audioInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>

  if (!isOpen) return null

  const handleFileSelect = (type: string, inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file, type)
      onClose()
    }
  }

  return (
    <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-xl shadow-lg z-30 p-4 animate-slide-up">
      <div className="absolute top-2 right-2">
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 pt-2">
        <div className="flex flex-col items-center" onClick={() => handleFileSelect("document", fileInputRef)}>
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-1">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xs text-gray-600">Document</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, "document")}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        <div className="flex flex-col items-center" onClick={() => handleFileSelect("image", imageInputRef)}>
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-1">
            <ImageIcon className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xs text-gray-600">Photos & videos</span>
          <input
            type="file"
            ref={imageInputRef}
            onChange={(e) => handleFileChange(e, "image")}
            className="hidden"
            accept="image/*,video/*"
            multiple
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-1">
            <Camera className="h-6 w-6 text-red-600" />
          </div>
          <span className="text-xs text-gray-600">Camera</span>
        </div>

        <div className="flex flex-col items-center" onClick={() => handleFileSelect("audio", audioInputRef)}>
          <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-1">
            <Headphones className="h-6 w-6 text-orange-600" />
          </div>
          <span className="text-xs text-gray-600">Audio</span>
          <input
            type="file"
            ref={audioInputRef}
            onChange={(e) => handleFileChange(e, "audio")}
            className="hidden"
            accept="audio/*"
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-1">
            <Contact className="h-6 w-6 text-cyan-600" />
          </div>
          <span className="text-xs text-gray-600">Contact</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-1">
            <BarChart2 className="h-6 w-6 text-yellow-600" />
          </div>
          <span className="text-xs text-gray-600">Poll</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-1">
            <Sticker className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-xs text-gray-600">New sticker</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-1">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-xs text-gray-600">Event</span>
        </div>
      </div>
    </div>
  )
}
