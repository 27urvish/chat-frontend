import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { NextRequest } from "next/server"

export const maxDuration = 30

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const { messages } = await req.json()
    const chatId = params.chatId

    // Different system prompts based on chat type
    let systemPrompt = "You are a helpful and friendly AI assistant."

    if (chatId === "ai-assistant") {
      systemPrompt =
        "You are a helpful AI assistant in a WhatsApp-like chat. Keep responses conversational and friendly."
    } else if (chatId === "john-doe") {
      systemPrompt =
        "You are John Doe, a friendly colleague. Respond as if you're a real person having a casual conversation."
    } else if (chatId === "jane-smith") {
      systemPrompt = "You are Jane Smith, a helpful team member. Respond professionally but warmly."
    }

    const result = streamText({
      model: openai("gpt-4-turbo"),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
