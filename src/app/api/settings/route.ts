import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/authOption"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    })

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          monthlyGoal: 10,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
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

    const body = await req.json()
    const { monthlyGoal } = body

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: { monthlyGoal },
      create: {
        userId: session.user.id,
        monthlyGoal,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
} 