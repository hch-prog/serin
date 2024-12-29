"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/common/sidebar"
import Goals from "@/components/Goals"
import { Loader2 } from "lucide-react"

export default function GoalsPage() {
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        },
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (status === "loading" || isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar isCollapsed={false} onToggle={() => { }} />
            <main className="flex-1 overflow-y-auto">
                <Goals />
            </main>
        </div>
    )
} 