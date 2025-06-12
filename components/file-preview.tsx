"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilePreviewProps {
  file: File | null
  type: string
  onRemove: () => void
}

export function FilePreview({ file, type, onRemove }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null)

  // Generate preview for image files
  useEffect(() => {
    if (file && type === "image" && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [file, type])

  // Return null if no file
  if (!file) {
    return null
  }

  return (
    <div className="relative bg-gray-100 p-2 rounded-md mb-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-center">
        {type === "image" && preview ? (
          <div className="h-20 w-20 overflow-hidden rounded-md mr-3">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
            <span className="text-xs uppercase font-medium">
              {file.name ? file.name.split(".").pop() || "FILE" : "FILE"}
            </span>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium truncate">{file.name || "Unknown file"}</p>
          <p className="text-xs text-gray-500">{file.size ? (file.size / 1024).toFixed(1) + " KB" : "Unknown size"}</p>
        </div>
      </div>
    </div>
  )
}
