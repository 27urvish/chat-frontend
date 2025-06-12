import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const chatId = formData.get("chatId") as string
    const fileType = formData.get("fileType") as string

    if (!file || !userId || !chatId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const backendFormData = new FormData()
    backendFormData.append("file", file)
    backendFormData.append("userId", userId)
    backendFormData.append("chatId", chatId)
    backendFormData.append("fileType", fileType)

    // Forward to your backend server
    const backendResponse = await fetch("http://localhost:5000/chat/api/chat/upload", {
      method: "POST",
      body: backendFormData,
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("Backend upload error:", errorText)
      return NextResponse.json({ error: "Backend upload failed" }, { status: 500 })
    }

    const result = await backendResponse.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
