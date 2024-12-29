'use client'

import { ReactNode } from 'react';
import { useState } from 'react';
import {
  BarChart, Brain, Feather, Lightbulb,
  PenTool, Shield, Sparkles, TrendingUp, Users,
  LucideIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import Image from "next/image";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: string;
}

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Gain deeper understanding of your thoughts and emotions with our advanced AI analysis."
  },
  {
    icon: Sparkles,
    title: "Personalized Prompts",
    description: "Receive tailored journaling prompts to inspire reflection and growth."
  },
  {
    icon: TrendingUp,
    title: "Mood Tracking",
    description: "Visualize your emotional journey and identify patterns to improve your mental well-being."
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your thoughts are yours alone. We ensure top-notch security and privacy for your journal entries."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with like-minded individuals on your journey to better mental health."
  },
  {
    icon: Feather,
    title: "Intuitive Interface",
    description: "Enjoy a seamless and beautiful journaling experience across all your devices."
  }
];

const STEPS: Step[] = [
  {
    icon: PenTool,
    title: "Write",
    description: "Jot down your thoughts, feelings, and experiences in our intuitive journaling interface."
  },
  {
    icon: Brain,
    title: "Analyze",
    description: "Our AI processes your entries, identifying patterns and insights in your writing."
  },
  {
    icon: BarChart,
    title: "Visualize",
    description: "See your emotional journey and personal growth through interactive charts and graphs."
  },
  {
    icon: Lightbulb,
    title: "Grow",
    description: "Receive personalized suggestions and prompts to foster self-reflection and improvement."
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Alex Johnson",
    role: "Entrepreneur",
    quote: "Serin has transformed my daily reflection practice. The AI insights are truly game-changing.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  },
  {
    name: "Samantha Lee",
    role: "Therapist",
    quote: "I recommend Serin to all my clients. It's an invaluable tool for self-discovery and growth.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
  },
  {
    name: "Michael Chen",
    role: "Student",
    quote: "As a busy student, Serin helps me stay grounded and understand my emotions better.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
  }
];


const Section = ({ id = "", className = "", children }: SectionProps) => (
  <section
    id={id}
    className={`w-full py-12 md:py-24 lg:py-32 scroll-mt-16 ${className}`}
  >
    <div className="container px-4 md:px-6">{children}</div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <Card className="group hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="rounded-full bg-purple-100 p-3 mb-4 group-hover:bg-purple-200 transition-colors duration-300">
        <Icon className="h-8 w-8 text-purple-600" />
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default function Main() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <main className="flex-1">
      <Section className="bg-gradient-to-r from-purple-50 via-white to-blue-50">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Elevate Your Mind with AI-Powered Journaling
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Serin: Your intelligent companion for mental wellness and self-discovery.
              Unlock the power of your thoughts with our free AI-enhanced journaling platform.
            </p>
          </div>
          <div className="space-x-4">
            <Button
              onClick={() => window.location.href = "/login"}
              className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              size="lg"
            >
              Start Your Journey Toady
            </Button>

          </div>
        </div>
      </Section>

      <Section id="features">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Empowering Features
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </Section>

      <Section id="how-it-works" className="bg-purple-50">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          How Serin Works
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative">
              <div className="rounded-full bg-purple-100 p-3 mb-4 hover:bg-purple-200 transition-colors">
                <step.icon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">

                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section id="ai-integration">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Harness the Power of AI
            </h2>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Serin&apos;s advanced AI technology transforms your journaling experience,
              providing deep insights and personalized guidance for your mental wellness journey.
            </p>
            <ul className="space-y-2">
              {[
                "Emotion analysis to track your mood over time",
                "Personalized journaling prompts based on your entries",
                "Identification of recurring themes and patterns in your writing",
                "Customized recommendations for self-improvement and reflection"
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 group">
                  <Sparkles className="h-5 w-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
                  <span className="group-hover:text-purple-700 transition-colors">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Explore AI Features
            </Button>
          </div>
          <div className="lg:order-first">
            <div className="relative group">
              <Image
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
                alt="AI Integration Illustration"
                width={600}
                height={400}
                className="mx-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105 object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="testimonials" className="bg-purple-50">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="rounded-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-full bg-purple-600/10 group-hover:bg-purple-600/0 transition-colors" />
                </div>
                <p className="text-gray-500 mb-4 italic">&apos;{testimonial.quote}&apos;</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="cta" className="bg-gradient-to-b from-white to-purple-50">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Start Your Journey to Better Mental Health
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of users who have transformed their lives with Serin.
              Your first step towards a healthier mind is just a click away.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                className="max-w-lg flex-1"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <Button
                className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                type="submit"
              >
                Get Started
              </Button>
            </form>
            <p className="text-xs text-gray-500">
              Start your journey today. It&apos;s free!
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}