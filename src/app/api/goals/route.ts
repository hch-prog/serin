import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/authOption"

// Helper function for consistent responses
const createResponse = (data: Record<string, unknown>, status = 200) => {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return createResponse({ error: "Unauthorized" }, 401)
    }

    const url = new URL(req.url)
    const category = url.searchParams.get('category')
    const status = url.searchParams.get('status')

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
        ...(category && { category }),
        ...(status && { status }),
      },
      include: {
        milestones: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return createResponse({ data: goals })
  } catch (error) {
    console.error("Error in goals API:", error)
    return createResponse({ error: "Failed to fetch goals" }, 500)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return createResponse({ error: "Unauthorized" }, 401)
    }

    const body = await req.json()
    const { title, description, category, priority, dueDate, milestones } = body

    if (!title?.trim()) {
      return createResponse({ error: "Title is required" }, 400)
    }

    const goal = await prisma.goal.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category,
        status: "In Progress",
        priority,
        progress: 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.user.id,
        milestones: {
          create: milestones?.map((m: { title: string, dueDate: string | null }) => ({
            title: m.title.trim(),
            dueDate: m.dueDate ? new Date(m.dueDate) : null,
            isCompleted: false,
          })) || [],
        },
      },
      include: {
        milestones: true,
      },
    })

    return createResponse({ data: goal }, 201)
  } catch (error) {
    console.error("Error creating goal:", error)
    return createResponse({ error: "Failed to create goal" }, 500)
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return createResponse({ error: "Unauthorized" }, 401)
    }

    const url = new URL(req.url)
    const goalId = url.searchParams.get('id')
    if (!goalId) {
      return createResponse({ error: "Goal ID required" }, 400)
    }

    // Verify ownership
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return createResponse({ error: "Goal not found" }, 404)
    }

    const body = await req.json()
    const { title, description, category, status, priority, dueDate, progress } = body

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title: title?.trim(),
        description: description?.trim(),
        category,
        status,
        priority,
        progress,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        milestones: true,
      },
    })

    return createResponse({ data: goal })
  } catch (error) {
    console.error("Error updating goal:", error)
    return createResponse({ error: "Failed to update goal" }, 500)
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return createResponse({ error: "Unauthorized" }, 401)
    }

    const url = new URL(req.url)
    const goalId = url.searchParams.get('id')
    if (!goalId) {
      return createResponse({ error: "Goal ID required" }, 400)
    }

    // Verify ownership
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return createResponse({ error: "Goal not found" }, 404)
    }

    await prisma.goal.delete({
      where: { id: goalId },
    })

    return createResponse({ success: true })
  } catch (error) {
    console.error("Error deleting goal:", error)
    return createResponse({ error: "Failed to delete goal" }, 500)
  }
} 