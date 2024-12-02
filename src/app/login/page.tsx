"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Chrome,
  Loader2,
  Brain,
  Shield,
  Sparkles,
  Heart,
  BarChart,
  Lock,
} from "lucide-react"
import { Suspense } from 'react'

const features = [
  {
    icon: <Brain className="w-5 h-5 text-purple-300" />,
    title: "AI-Powered Insights",
    desc: "Get personalized mood analysis"
  },
  {
    icon: <Shield className="w-5 h-5 text-blue-300" />,
    title: "Private & Secure",
    desc: "End-to-end encryption"
  },
  {
    icon: <BarChart className="w-5 h-5 text-green-300" />,
    title: "Track Progress",
    desc: "Visual mood patterns"
  },
  {
    icon: <Heart className="w-5 h-5 text-pink-300" />,
    title: "Daily Reflection",
    desc: "Build mindful habits"
  }
];

const benefits = [
  "🎯 Set and track personal goals",
  "📊 Detailed mood analytics",
  "🤖 AI-powered journaling assistant",
  "📱 Access from any device",
];

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
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Welcome */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Welcome to Sereni
            </h1>
            <p className="text-slate-600">
              Your personal space for mindfulness and growth
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-2"
            >
              <Lock className="w-5 h-5 flex-shrink-0" />
              <p>
                {error === "OAuthSignin"
                  ? "Could not sign in with Google. Please try again."
                  : "An error occurred during sign in."}
              </p>
            </motion.div>
          )}

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Button
              className="w-full h-14 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-3 text-lg">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Chrome className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </>
                )}
              </div>
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure login</span>
              </div>

            </div>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-t border-slate-200 pt-8"
          >
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-sm text-slate-600"
                >
                  {benefit}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Terms */}
          <p className="text-sm text-center text-slate-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:underline">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-12">
          {/* Features Grid */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-md"
            >
              <h2 className="text-3xl font-bold">Transform Your Journey</h2>
              <p className="text-slate-300 mt-2">
                Join thousands of users discovering deeper self-awareness through AI-powered mood tracking
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="bg-white/10 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-300">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between text-sm border-t border-white/10 pt-8"
          >
            <div>
              <div className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                10k+
              </div>
              <div className="text-slate-400">Active Users</div>
            </div>
            <div>
              <div className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                1M+
              </div>
              <div className="text-slate-400">Journal Entries</div>
            </div>
            <div>
              <div className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-400">
                4.9
              </div>
              <div className="text-slate-400">User Rating</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

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