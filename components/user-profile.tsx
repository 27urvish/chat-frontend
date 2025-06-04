"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Edit2, Check, X } from "lucide-react"

interface UserProfileProps {
  user: string
  onBack: () => void
  onLogout: () => void
}

export function UserProfile({ user, onBack, onLogout }: UserProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [name, setName] = useState(user)
  const [about, setAbout] = useState("Hey there! I am using WhatsApp.")

  const handleSaveName = () => {
    setIsEditingName(false)
    // Save to backend
  }

  const handleSaveAbout = () => {
    setIsEditingAbout(false)
    // Save to backend
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-green-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-medium">Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Avatar Section */}
        <div className="bg-gray-50 p-8 text-center">
          <div className="relative inline-block">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarFallback className="text-4xl bg-gray-600 text-white">
                {user.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-green-600 hover:bg-green-700"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-green-600 text-sm font-medium">Name</Label>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="flex-1" autoFocus />
                  <Button size="sm" onClick={handleSaveName}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-gray-900">{name}</span>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingName(true)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">
              This is not your username or pin. This name will be visible to your WhatsApp contacts.
            </p>
          </div>

          {/* About */}
          <div className="space-y-2">
            <Label className="text-green-600 text-sm font-medium">About</Label>
            <div className="flex items-center gap-2">
              {isEditingAbout ? (
                <>
                  <Input value={about} onChange={(e) => setAbout(e.target.value)} className="flex-1" autoFocus />
                  <Button size="sm" onClick={handleSaveAbout}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingAbout(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-gray-900">{about}</span>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingAbout(true)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-green-600 text-sm font-medium">Phone</Label>
            <span className="text-gray-900">+1 234 567 8900</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="destructive" onClick={onLogout} className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
