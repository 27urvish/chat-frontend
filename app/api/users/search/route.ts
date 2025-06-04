import { type NextRequest, NextResponse } from "next/server"

// Mock users data for search
const mockUsers = [
  {
    id: "alice-johnson",
    name: "Alice Johnson",
    phone: "+1 234 567 8901",
    avatar: "👩‍💼",
    isOnline: true,
  },
  {
    id: "bob-wilson",
    name: "Bob Wilson",
    phone: "+1 234 567 8902",
    avatar: "👨‍💻",
    isOnline: false,
  },
  {
    id: "carol-brown",
    name: "Carol Brown",
    phone: "+1 234 567 8903",
    avatar: "👩‍🎨",
    isOnline: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    const filteredUsers = mockUsers.filter(
      (user) => user.name.toLowerCase().includes(query.toLowerCase()) || user.phone.includes(query),
    )

    return NextResponse.json({
      success: true,
      users: filteredUsers,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to search users" }, { status: 500 })
  }
}
