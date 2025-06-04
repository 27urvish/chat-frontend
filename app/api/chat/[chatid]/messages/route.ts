import { type NextRequest, NextResponse } from "next/server"

// Mock message data - in a real app, this would come from a database
const mockMessages: Record<string, any[]> = {
  "ai-assistant": [
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ],
  "john-doe": [
    {
      id: "1",
      content: "Hey! How's your day going?",
      role: "user",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      content: "Pretty good! Just working on some projects. How about you?",
      role: "assistant",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const chatId = params.chatId
    const messages = mockMessages[chatId] || []

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const { content, role = "user" } = await request.json()
    const chatId = params.chatId

    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      role,
      timestamp: new Date().toISOString(),
    }

    // Initialize chat messages if not exists
    if (!mockMessages[chatId]) {
      mockMessages[chatId] = []
    }

    mockMessages[chatId].push(newMessage)

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
