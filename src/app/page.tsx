"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Shield,
  Brain,
  Star,
} from "lucide-react";
import Image from 'next/image';

const features = [
  {
    title: "5-Minute Daily Mood Tracker",
    description: "Quick and effective mood tracking to build self-awareness",
    icon: <Calendar className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "AI-Powered Insights",
    description: "Personalized patterns and recommendations for your well-being journey",
    icon: <Brain className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Comprehensive Analytics",
    description: "Visualize your progress and identify mood patterns over time",
    icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Privacy-First Journaling",
    description: "Secure and private space for your thoughts and reflections",
    icon: <Shield className="w-6 h-6 text-indigo-600" />,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Daily Practitioner",
    initials: "SJ",
    content: "Sereni has transformed my daily mindfulness practice. The AI insights feel like having a personal meditation guide.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Wellness Coach",
    initials: "MC",
    content: "As a wellness coach, I recommend Sereni to all my clients. The analytics help track progress effectively.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Mindfulness Expert",
    initials: "EW",
    content: "The privacy-first approach and comprehensive features make Sereni stand out in the digital wellness space.",
    rating: 5
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};


const Hero = () => (
  <section className="relative flex items-center min-h-screen">
    {/* Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="-top-40 -right-40 absolute bg-indigo-100/50 blur-3xl rounded-full w-[500px] h-[500px]" />
      <div className="-bottom-40 -left-40 absolute bg-purple-100/50 blur-3xl rounded-full w-[500px] h-[500px]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
    </div>

    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="items-center gap-12 grid lg:grid-cols-2">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="max-w-xl"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center space-x-2 mb-6"
          >
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((i) => (
                <div key={`user-${i}`} className="flex justify-center items-center border-2 border-white bg-indigo-100 rounded-full w-8 h-8">
                  <span className="font-medium text-indigo-600 text-xs">★</span>
                </div>
              ))}
            </div>
            <span className="text-slate-600 text-sm">
              Trusted by 10,000+ mindful practitioners
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mb-6 font-semibold text-6xl leading-tight"
          >
            Master Your Mind,{' '}
            <span className="bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent">
              One Journal Entry at a Time
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mb-8 text-lg text-slate-600"
          >
            Transform your daily reflections with AI-powered insights, mood tracking,
            and personalized guidance. Your journey to mindfulness starts here.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex sm:flex-row flex-col gap-4"
          >
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-slate-900 hover:bg-slate-800 shadow-xl hover:shadow-2xl px-8 py-6 rounded-full text-lg text-white transform transition-all hover:-translate-y-1 duration-200"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 hover:border-slate-300 px-8 py-6 rounded-full text-lg group"
            >
              Watch Demo
              <motion.span
                className="group-hover:bg-slate-200 bg-slate-100 ml-2 p-2 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                ▶
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Content - Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:block relative hidden"
        >
          <InteractiveDemo />
        </motion.div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="relative py-32">
    <div className="absolute inset-0">
      <div className="right-0 absolute inset-y-0 bg-slate-50 w-1/2" />
    </div>

    <motion.div
      className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="items-center gap-16 grid lg:grid-cols-2">
        <div>
          <motion.span
            className="inline-block mb-6 font-medium text-indigo-600 text-sm"
            variants={fadeInUp}
          >
            Features that matter
          </motion.span>
          <motion.h2
            className="mb-8 font-medium text-4xl text-slate-900 tracking-tight"
            variants={fadeInUp}
          >
            Everything you need for meaningful self-reflection
          </motion.h2>
          <motion.p
            className="mb-10 text-lg text-slate-600"
            variants={fadeInUp}
          >
            We&apos;ve refined every feature to make your journaling experience
            seamless and insightful, helping you build a sustainable practice.
          </motion.p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex gap-4"
                variants={fadeInUp}
              >
                <div className="flex flex-shrink-0 justify-center items-center bg-white shadow-md rounded-xl w-12 h-12">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:pl-16">
          <div className="relative">
            <div className="absolute -inset-4">
              <div className="opacity-30 blur-lg mx-auto w-full h-full filter"
                style={{
                  background: "linear-gradient(90deg, #94a3b8 -0.55%, #6366f1 22.86%, #8b5cf6 48.36%, #6366f1 73.33%, #94a3b8 99.34%)"
                }}
              />
            </div>

            <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden">
              {/* Your demo UI here */}
              <Image
                src="/demo-screenshot.png"
                alt="App interface"
                width={800}
                height={600}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <AIChatPreview />
        <Stats />
        <MoodInsights />
        <Testimonials />
        <Partners />
      </main>
    </div>
  );
};

// Add these new components after your existing ones

// 1. How It Works Section
const HowItWorks = () => (
  <section className="bg-white py-24">
    <motion.div
      className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="mb-16 text-center">
        <motion.h2
          variants={fadeInUp}
          className="mb-4 font-semibold text-3xl"
        >
          Your Journey to Mindfulness
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-slate-600"
        >
          Simple steps to transform your daily practice
        </motion.p>
      </div>

      <div className="gap-8 grid md:grid-cols-3">
        {[
          {
            step: "01",
            title: "Daily Check-in",
            description: "Take 5 minutes to reflect on your day and track your mood"
          },
          {
            step: "02",
            title: "AI Analysis",
            description: "Receive personalized insights and patterns from your entries"
          },
          {
            step: "03",
            title: "Growth Tracking",
            description: "Watch your mindfulness journey evolve over time"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="relative bg-slate-50 p-6 rounded-2xl"
          >
            <div className="-top-4 -right-4 absolute flex justify-center items-center bg-indigo-600 rounded-full w-16 h-16 font-semibold text-white">
              {item.step}
            </div>
            <h3 className="mb-3 font-semibold text-xl">{item.title}</h3>
            <p className="text-slate-600">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

// 2. Stats Section
const Stats = () => (
  <section className="bg-slate-900 py-24 text-white">
    <motion.div
      className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="gap-8 grid md:grid-cols-4 text-center">
        {[
          { number: "10K+", label: "Active Users" },
          { number: "1M+", label: "Journal Entries" },
          { number: "89%", label: "User Satisfaction" },
          { number: "4.9", label: "App Store Rating" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="p-6"
          >
            <div className="bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 font-bold text-4xl text-transparent">
              {stat.number}
            </div>
            <div className="text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

// 3. Integration Partners
const Partners = () => (
  <section className="bg-white py-24">
    <motion.div
      className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="mb-16 text-center">
        <motion.h2
          variants={fadeInUp}
          className="mb-4 font-semibold text-3xl"
        >
          Integrated with Your Favorite Tools
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-slate-600"
        >
          Seamlessly connect with your existing wellness apps
        </motion.p>
      </div>

      <motion.div
        variants={fadeInUp}
        className="gap-8 grid grid-cols-2 md:grid-cols-4"
      >
        {[1, 2, 3, 4].map((partner) => (
          <div
            key={partner}
            className="flex justify-center items-center bg-slate-50 rounded-xl h-24"
          >
            <div className="text-slate-400">Partner Logo</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

const InteractiveDemo = () => (
  <div className="relative bg-white shadow-xl p-6 rounded-2xl">
    <div className="space-y-4">
      <div className="bg-slate-100 rounded w-3/4 h-4" />
      <div className="bg-slate-100 rounded w-1/2 h-4" />
      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={`mood-${n}`} className="bg-indigo-50 rounded-full w-8 h-8" />
        ))}
      </div>
    </div>
  </div>
);

const Testimonials = () => (
  <section className="bg-slate-50 py-24">
    <motion.div
      className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="mb-16 text-center">
        <motion.h2 variants={fadeInUp} className="mb-4 font-semibold text-3xl">
          What Our Users Say
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-slate-600">
          Join thousands of satisfied users on their mindfulness journey
        </motion.p>
      </div>

      <div className="gap-8 grid md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            variants={fadeInUp}
            className="bg-white shadow-lg p-6 rounded-xl"
          >
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center bg-indigo-100 rounded-full w-12 h-12">
                <span className="font-medium text-indigo-600">{testimonial.initials}</span>
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-slate-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-slate-600">&ldquo;{testimonial.content}&rdquo;</p>
            <div className="flex mt-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={`star-${testimonial.id}-${i}`} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

const AIChatPreview = () => {
  const chatMessages = [
    { type: 'user', text: "Today was quite challenging at work..." },
    { type: 'ai', text: "I notice you've been mentioning work stress lately. Would you like to explore what's causing these feelings?" },
    { type: 'user', text: "Yes, I think it's about the new project..." },
    { type: 'ai', text: "I understand. Let's break this down together. What aspect of the new project feels most overwhelming?" }
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24">
      <motion.div
        className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="mb-16 text-center">
          <motion.h2 variants={fadeInUp} className="mb-4 font-semibold text-3xl">
            AI-Powered Conversation
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-600">
            Experience meaningful dialogue that helps you grow
          </motion.p>
        </div>

        <motion.div
          variants={fadeInUp}
          className="bg-white shadow-xl mx-auto rounded-2xl max-w-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center bg-slate-900 p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-red-500 rounded-full w-3 h-3" />
              <div className="bg-yellow-500 rounded-full w-3 h-3" />
              <div className="bg-green-500 rounded-full w-3 h-3" />
            </div>
            <span className="text-slate-400 text-sm">AI Journal Assistant</span>
          </div>

          <div className="space-y-4 p-6 max-h-[400px] overflow-y-auto">
            {chatMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${message.type === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-slate-200 p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Share your thoughts..."
                className="flex-1 border-slate-200 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Send
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const MoodInsights = () => {
  const moodCategories = [
    { name: 'Joy', percentage: 45, color: 'bg-yellow-400' },
    { name: 'Calm', percentage: 30, color: 'bg-blue-400' },
    { name: 'Energy', percentage: 65, color: 'bg-green-400' },
    { name: 'Focus', percentage: 80, color: 'bg-purple-400' },
    { name: 'Creativity', percentage: 55, color: 'bg-pink-400' },
  ];

  return (
    <section className="bg-white py-24">
      <motion.div
        className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="items-center gap-12 grid lg:grid-cols-2">
          <div>
            <motion.span variants={fadeInUp} className="font-medium text-indigo-600 text-sm">
              Personalized Analytics
            </motion.span>
            <motion.h2 variants={fadeInUp} className="mt-4 mb-6 font-semibold text-3xl">
              Understand Your Emotional Patterns
            </motion.h2>
            <motion.p variants={fadeInUp} className="mb-8 text-slate-600">
              Our advanced AI analyzes your journal entries to provide deep insights into your emotional well-being and personal growth journey.
            </motion.p>

            <div className="space-y-6">
              {moodCategories.map((mood, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{mood.name}</span>
                    <span className="text-slate-500">{mood.percentage}%</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full ${mood.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${mood.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp} className="mt-8">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                View Full Analysis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={fadeInUp}
            className="lg:block relative hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10 blur-2xl rounded-full" />
            <div className="relative bg-white shadow-xl p-8 rounded-2xl">
              <div className="bg-slate-50 p-6 rounded-xl aspect-square">
                {/* Add a circular visualization or any other mood-related graphics */}
                <div className="flex justify-center items-center border-8 border-indigo-100 rounded-full w-full h-full">
                  <div className="text-center">
                    <div className="font-bold text-4xl text-indigo-600">87%</div>
                    <div className="text-slate-600">Positive Growth</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;