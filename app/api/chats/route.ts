import { NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
const mockChats = [
  {
    id: "ai-assistant",
    name: "AI Assistant",
    lastMessage: "Hello! How can I help you today?",
    timestamp: "10:30 AM",
    avatar: "🤖",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "john-doe",
    name: "John Doe",
    lastMessage: "Hey, how are you doing?",
    timestamp: "Yesterday",
    avatar: "👨",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    lastMessage: "Thanks for the help!",
    timestamp: "Monday",
    avatar: "👩",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "team-group",
    name: "Team Group",
    lastMessage: "Meeting at 3 PM today",
    timestamp: "2:15 PM",
    avatar: "👥",
    unreadCount: 5,
    isOnline: true,
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      chats: mockChats,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch chats" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, type = "individual" } = await request.json()

    const newChat = {
      id: `chat-${Date.now()}`,
      name,
      lastMessage: "",
      timestamp: "now",
      avatar: type === "group" ? "👥" : "👤",
      unreadCount: 0,
      isOnline: false,
    }

    // In a real app, save to database
    mockChats.push(newChat)

    return NextResponse.json({
      success: true,
      chat: newChat,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create chat" }, { status: 500 })
  }
}
