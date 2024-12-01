"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Chrome, Loader2 } from "lucide-react"

import { Suspense } from 'react'

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const error = searchParams.get("error")

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { 
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Section - Login */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-slate-900">MoodTracker</h1>
            <p className="text-slate-600 mt-2">Welcome back! Please sign in to continue.</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-lg"
            >
              {error === "OAuthSignin" 
                ? "Could not sign in with Google. Please try again." 
                : "An error occurred during sign in."}
            </motion.div>
          )}

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button 
              className="w-full h-12 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-800"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5" />
                )}
                <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
              </div>
            </Button>

            {/* Terms */}
            <p className="mt-4 text-sm text-center text-slate-600">
              By continuing, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Feature Showcase */}
      <div className="w-1/2 bg-slate-900 text-white p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')]" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-30" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between">
          {/* Feature Highlights */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md"
            >
              <h2 className="text-3xl font-bold mb-4">Track Your Mood Journey</h2>
              <p className="text-slate-300">
                Join thousands of users who are improving their mental well-being through daily reflection and mood tracking.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { title: "Daily Insights", desc: "Track your emotional patterns" },
                { title: "AI Analysis", desc: "Get personalized recommendations" },
                { title: "Progress Tracking", desc: "Visualize your journey" },
                { title: "Private & Secure", desc: "Your data stays protected" },
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-300">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-8 text-sm"
          >
            <div>
              <div className="font-bold text-2xl">10k+</div>
              <div className="text-slate-300">Active Users</div>
            </div>
            <div>
              <div className="font-bold text-2xl">1M+</div>
              <div className="text-slate-300">Mood Entries</div>
            </div>
            <div>
              <div className="font-bold text-2xl">4.9</div>
              <div className="text-slate-300">User Rating</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
} 