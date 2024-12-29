"use client"

import LoginContent from "@/components/LoginContent"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"


export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
} 