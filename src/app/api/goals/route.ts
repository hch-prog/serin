import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/authOption"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    return NextResponse.json(goals)
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json(
      { error: "Failed to fetch goals" },
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
    const { title, description, category, priority, dueDate, milestones } = body

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        category,
        status: "In Progress",
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.user.id,
        milestones: {
          create: milestones?.map((m: { title: string, dueDate: string | null }) => ({
            title: m.title,
            dueDate: m.dueDate ? new Date(m.dueDate) : null,
          })),
        },
      },
      include: {
        milestones: true,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const goalId = url.searchParams.get('id')
    if (!goalId) {
      return NextResponse.json({ error: "Goal ID required" }, { status: 400 })
    }

    const body = await req.json()
    const { title, description, category, status, priority, dueDate, progress } = body

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title,
        description,
        category,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        progress,
      },
      include: {
        milestones: true,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json(
      { error: "Failed to update goal" },
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
    const goalId = url.searchParams.get('id')
    if (!goalId) {
      return NextResponse.json({ error: "Goal ID required" }, { status: 400 })
    }

    await prisma.goal.delete({
      where: { id: goalId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting goal:", error)
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    )
  }
} 