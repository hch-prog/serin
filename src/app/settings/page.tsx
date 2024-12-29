"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AppLayout } from "@/components/common/app-layout"
import { Sidebar } from "@/components/common/sidebar"
import Settings from "@/components/Settings"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
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
    <AppLayout>
      <div className="flex h-screen bg-slate-50">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 overflow-auto">
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <Settings />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 