import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/authOption"
import { Prisma } from '@prisma/client'


export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const sort = url.searchParams.get('sort') || 'newest'

    const where: Prisma.JournalEntryWhereInput = {
      userId: session.user.id,
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } }
        ]
      })
    }

    const orderBy = {
      [sort === 'oldest' ? 'createdAt' : 'updatedAt']: sort === 'oldest' ? 'asc' : 'desc'
    }

    const entries = await prisma.journalEntry.findMany({
      where,
      orderBy,
      take: 50,
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching journal entries:", error)
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, mood, tags, category, isFavorite, weather } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const entry = await prisma.journalEntry.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        mood: mood || null,
        weather: weather || null,
        tags: Array.isArray(tags) ? tags : [],
        category: category || 'Personal',
        isFavorite: Boolean(isFavorite),
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: entry,
    })

  } catch (error) {
    console.error("Error creating journal entry:", error)
    return NextResponse.json({
      error: "Failed to create entry",
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

    const url = new URL(req.url)
    const entryId = url.searchParams.get('id')
    if (!entryId) {
      return NextResponse.json({ error: "Entry ID required" }, { status: 400 })
    }

    const body = await req.json()
    const { title, content, mood, tags, category, isFavorite, imageUrl } = body

    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId: session.user.id,
      },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        title,
        content,
        mood,
        tags,
        category,
        isFavorite,
        imageUrl,
      },
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error("Error updating journal entry:", error)
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const entryId = url.searchParams.get('id')
    if (!entryId) {
      return NextResponse.json({ error: "Entry ID required" }, { status: 400 })
    }

    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId: session.user.id,
      },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    await prisma.journalEntry.delete({
      where: { id: entryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting journal entry:", error)
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    )
  }
} 