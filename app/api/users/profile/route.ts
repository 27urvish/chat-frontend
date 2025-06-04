import { type NextRequest, NextResponse } from "next/server"

// Mock user data - in a real app, this would come from a database
const mockUserProfiles: Record<string, any> = {
  "demo-user": {
    id: "demo-user",
    name: "Demo User",
    about: "Hey there! I am using WhatsApp.",
    phone: "+1 234 567 8900",
    avatar: null,
    lastSeen: new Date().toISOString(),
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "demo-user"

    const profile = mockUserProfiles[userId]

    if (!profile) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, about, phone } = await request.json()

    if (!mockUserProfiles[userId]) {
      mockUserProfiles[userId] = {
        id: userId,
        name: userId,
        about: "Hey there! I am using WhatsApp.",
        phone: "+1 234 567 8900",
        avatar: null,
        lastSeen: new Date().toISOString(),
      }
    }

    // Update profile
    if (name !== undefined) mockUserProfiles[userId].name = name
    if (about !== undefined) mockUserProfiles[userId].about = about
    if (phone !== undefined) mockUserProfiles[userId].phone = phone

    return NextResponse.json({
      success: true,
      profile: mockUserProfiles[userId],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
  }
}
