import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/authOption"
import { startOfMonth, endOfMonth } from "date-fns"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const url = new URL(req.url)
    const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(url.searchParams.get('month') || new Date().getMonth().toString())

    // Calculate start and end dates using date-fns
    const startDate = startOfMonth(new Date(year, month))
    const endDate = endOfMonth(new Date(year, month))

    // Query database
    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        mood: true,
        createdAt: true,
        emotions: true,
        activities: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Transform the data for frontend
    const transformedEntries = entries.map(entry => ({
      id: entry.id,
      date: entry.createdAt.toISOString(),
      mood: entry.mood,
      emotions: entry.emotions,
      activities: entry.activities,
    }))

    return NextResponse.json(transformedEntries)
  } catch (error) {
    console.error("Error fetching calendar data:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch calendar data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 