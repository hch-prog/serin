"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Shield,
  Brain,
  Star,
  Sparkles,
  Moon,
  Sun,
  CloudRain,
  Zap,
  CheckCircle,
  MessageSquare,
  Lock,
  Users,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};


// Hero Section
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center py-20">
      {/* Enhanced Background */}
      <motion.div 
        className="absolute inset-0 overflow-hidden -z-10"
        style={{ opacity }}
      >
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 max-w-2xl"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-indigo-50 rounded-full">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-indigo-600 font-medium">AI-Powered Journaling</span>
                </div>
                <div className="px-3 py-1 bg-green-50 rounded-full">
                  <span className="text-sm text-green-600 font-medium">✨ New: AI Insights</span>
                </div>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeInUp} className="space-y-4 mb-8">
              <h1 className="text-6xl sm:text-7xl font-bold leading-tight">
                Master Your Mind,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                  One Journal Entry at a Time
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Transform your daily reflections with AI-powered insights, mood tracking, 
                and personalized guidance. Your journey to mindfulness starts here.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 
                  text-white px-8 py-6 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200
                  flex items-center justify-center gap-2 group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 hover:border-slate-300 px-8 py-6 rounded-xl text-lg
                  flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10">Watch Demo</span>
                <motion.span 
                  className="bg-slate-100 p-2 rounded-full relative z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  ▶
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-slate-50"
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp}>
              <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-600">AI-Powered Analysis</span>
                  </div>
                  <div className="text-xs text-slate-400">Personalized Insights Daily</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-slate-600">4.9/5 User Rating</span>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-600">10k+ Active Users</span>
                  </div>
                  <div className="flex -space-x-1">
                    {[
                      "https://randomuser.me/api/portraits/women/1.jpg",
                      "https://randomuser.me/api/portraits/men/2.jpg", 
                      "https://randomuser.me/api/portraits/women/3.jpg",
                      "https://randomuser.me/api/portraits/men/4.jpg"
                    ].map((src, i) => (
                      <img 
                        key={i}
                        src={src}
                        alt="User avatar"
                        className="w-6 h-6 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 relative"
          >
            <MoodTracker />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// MoodTracker component
const MoodTracker = () => {
  const moods = [
    { emoji: "😊", label: "Happy", color: "bg-green-100" },
    { emoji: "😌", label: "Calm", color: "bg-blue-100" },
    { emoji: "😐", label: "Neutral", color: "bg-yellow-100" },
    { emoji: "😔", label: "Sad", color: "bg-purple-100" },
    { emoji: "😣", label: "Stressed", color: "bg-red-100" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">How are you feeling?</h3>
          <div className="flex gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <Moon className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {moods.map((mood) => (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${mood.color} p-4 rounded-xl flex flex-col items-center gap-2`}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Energy Level</span>
            <span>8/10</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-slate-50 p-3 rounded-lg flex items-center gap-2"
          >
            <CloudRain className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Rainy Day</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-slate-50 p-3 rounded-lg flex items-center gap-2"
          >
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">Productive</span>
          </motion.div>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">AI Analysis</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 text-indigo-600 cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              <span>Analyzing...</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-indigo-600 mt-1" />
              <div className="text-sm text-slate-600">
                Your mood patterns suggest higher energy levels in the morning. Consider scheduling important tasks during these peak hours.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations and patterns analysis from our advanced AI",
      color: "from-blue-600 to-indigo-600",
      bgLight: "bg-blue-50",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Mood Analytics",
      description: "Visualize your emotional patterns with beautiful, interactive charts",
      color: "from-purple-600 to-pink-600",
      bgLight: "bg-purple-50",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Daily Tracking",
      description: "Build a consistent journaling habit with daily reminders and streaks",
      color: "from-green-600 to-emerald-600",
      bgLight: "bg-green-50",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Private & Secure",
      description: "Your thoughts are encrypted and protected with bank-grade security",
      color: "from-orange-600 to-red-600",
      bgLight: "bg-orange-50",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-indigo-600" />
            <span className="text-indigo-600 font-semibold">Features</span>
            <div className="h-px w-8 bg-indigo-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Everything you need for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              meaningful self-reflection
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 text-lg"
          >
            Powerful features to help you track, understand, and improve your emotional well-being
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 h-full
                hover:shadow-xl transition-shadow duration-200 relative group">
                {/* Feature Icon */}
                <div className={`${feature.bgLight} w-12 h-12 rounded-lg flex items-center justify-center mb-6
                  group-hover:scale-110 transition-transform duration-200`}>
                  <div className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Feature Content */}
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-5
                    transition-opacity duration-200"
                  style={{
                    background: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Advanced AI Analysis</h3>
              <p className="text-slate-600">
                Our AI doesn&apos;t just track your moods - it understands them. Get personalized insights,
                pattern recognition, and actionable recommendations based on your journal entries.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  "Pattern Recognition",
                  "Sentiment Analysis",
                  "Personalized Tips",
                  "Trigger Identification"
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full"
                  >
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-indigo-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <Brain className="w-6 h-6 text-indigo-600 mt-1" />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-2 bg-indigo-200/50 rounded-full w-3/4" />
                      <div className="h-2 bg-indigo-200/50 rounded-full w-1/2" />
                    </div>
                    <div className="flex gap-2">
                      {[1,2,3].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-indigo-400"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Features />
      {/* Add other sections here */}
    </div>
  );
}