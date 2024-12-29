"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/common/sidebar"
import Journal from "@/components/Journal"
import { Loader2 } from "lucide-react"


export default function JournalPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {

  }, [status])

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-y-auto">
        <Journal />
      </main>

    </div>
  )
}
