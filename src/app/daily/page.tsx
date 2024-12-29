"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

import {
  Loader2,
} from "lucide-react"
import { Sidebar } from "@/components/common/sidebar"
import Daily from "@/components/Daliy"


export default function DailyMoodPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }
  return (
    <div className="flex bg-slate-50 h-screen">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1">
        <Daily />
      </div>
    </div>
  )
} 
