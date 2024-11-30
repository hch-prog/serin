import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/authOption"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { date, mood, emotions, activities, energy, sleep, notes } = body

    // Validate required fields
    if (
      typeof mood !== 'number' || 
      !Array.isArray(emotions) || 
      !Array.isArray(activities) || 
      typeof energy !== 'number' || 
      typeof sleep !== 'number'
    ) {
      return NextResponse.json({ 
        error: "Invalid data format",
        details: "All fields must be properly formatted" 
      }, { status: 400 })
    }

    // Generate AI insights
    let aiInsights = null
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const prompt = `As an empathetic AI counselor, analyze this mood diary entry and provide personalized insights. Consider:

      Mood Rating: ${mood}/10
      Emotions: ${emotions.join(", ")}
      Activities: ${activities.join(", ")}
      Energy Level: ${energy}/5
      Sleep: ${sleep} hours
      Additional Notes: ${notes || "None provided"}

      Please provide a brief analysis in simple text format (no markdown):
      1. A compassionate observation about their current state
      2. Potential patterns or connections between activities and mood
      3. One or two gentle, actionable suggestions for well-being
      
      Keep the response warm, supportive, and concise (3-4 sentences). Do not use any special formatting characters like asterisks or bold markers.`
      
      const result = await model.generateContent(prompt)
      aiInsights = result.response.text()
    } catch (error) {
      console.error("AI generation error:", error)
      // Continue without AI insights if generation fails
    }

    // Create the mood entry with the specific date
    const entry = await prisma.moodEntry.create({
      data: {
        mood,
        emotions,
        activities,
        energy,
        sleep,
        notes: notes || null,
        aiInsights,
        userId: session.user.id,
        createdAt: new Date(date),
      },
    })

    return NextResponse.json({
      success: true,
      data: entry,
    })

  } catch (error) {
    console.error("Error processing mood entry:", error)
    return NextResponse.json({ 
      error: "Failed to process entry",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30, // Limit to last 30 entries
      select: {
        id: true,
        mood: true,
        emotions: true,
        activities: true,
        energy: true,
        sleep: true,
        notes: true,
        aiInsights: true,
        createdAt: true,
      },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching mood entries:", error)
    return NextResponse.json({ 
      error: "Failed to fetch entries",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { date, mood, emotions, activities, energy, sleep, notes } = body

    // Find existing entry for the date
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
        },
      },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Generate new AI insights for the updated entry
    let aiInsights = null
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const prompt = `As an empathetic AI counselor, analyze this mood diary entry and provide personalized insights. Consider:

      Mood Rating: ${mood}/10
      Emotions: ${emotions.join(", ")}
      Activities: ${activities.join(", ")}
      Energy Level: ${energy}/5
      Sleep: ${sleep} hours
      Additional Notes: ${notes || "None provided"}

      Please provide a brief analysis in simple text format (no markdown):
      1. A compassionate observation about their current state
      2. Potential patterns or connections between activities and mood
      3. One or two gentle, actionable suggestions for well-being
      
      Keep the response warm, supportive, and concise (3-4 sentences). Do not use any special formatting characters like asterisks or bold markers.`
      
      const result = await model.generateContent(prompt)
      aiInsights = result.response.text()
    } catch (error) {
      console.error("AI generation error:", error)
    }

    // Update the entry
    const updatedEntry = await prisma.moodEntry.update({
      where: { id: existingEntry.id },
      data: {
        mood,
        emotions,
        activities,
        energy,
        sleep,
        notes: notes || null,
        aiInsights,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedEntry,
    })
  } catch (error) {
    console.error("Error updating mood entry:", error)
    return NextResponse.json({ 
      error: "Failed to update entry",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 