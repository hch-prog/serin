"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Smile,
  Frown,
  Meh,
  Brain,
  Target,
  Flame,
  ArrowRight,
  BookOpen,
  Music,
  Coffee,
  Sun,
  Moon,
  Cloud,
  Heart,
  Star,
} from "lucide-react";

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/common/sidebar";
import { startOfMonth, endOfMonth, isToday, isSameDay, format } from 'date-fns'
import { MoodEntry } from "@prisma/client";

// Enhanced mood tracking with timestamps and notes

const QuickMoodCard = ({ onMoodSubmit }: { onMoodSubmit: (data: { mood: number, activities: string[], note: string }) => void }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const moodOptions = [
    {
      emoji: "😊",
      label: "Happy",
      color: "bg-green-100 hover:bg-green-200 text-green-600",
      value: 5,
    },
    {
      emoji: "😌",
      label: "Calm",
      color: "bg-blue-100 hover:bg-blue-200 text-blue-600",
      value: 4,
    },
    {
      emoji: "😐",
      label: "Neutral",
      color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-600",
      value: 3,
    },
    {
      emoji: "😔",
      label: "Sad",
      color: "bg-purple-100 hover:bg-purple-200 text-purple-600",
      value: 2,
    },
    {
      emoji: "😣",
      label: "Stressed",
      color: "bg-red-100 hover:bg-red-200 text-red-600",
      value: 1,
    },
  ];

  const activityOptions = [
    { icon: <Sun className="w-4 h-4" />, label: "Work" },
    { icon: <Heart className="w-4 h-4" />, label: "Exercise" },
    { icon: <Star className="w-4 h-4" />, label: "Family" },
    { icon: <Music className="w-4 h-4" />, label: "Music" },
    { icon: <Coffee className="w-4 h-4" />, label: "Social" },
    { icon: <Moon className="w-4 h-4" />, label: "Sleep" },
    { icon: <Brain className="w-4 h-4" />, label: "Learning" },
    { icon: <Cloud className="w-4 h-4" />, label: "Nature" },
  ];

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onMoodSubmit({
        mood: selectedMood,
        activities,
        note,
      });

      // Reset form
      setSelectedMood(null);
      setActivities([]);
      setNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-medium text-lg">
          How are you feeling?
        </CardTitle>
        <CardDescription>Track your mood and activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="gap-3 grid grid-cols-5">
          {moodOptions.map((mood) => (
            <motion.button
              key={mood.value}
              className={`${mood.color
                } p-4 rounded-xl flex flex-col items-center gap-2
                ${selectedMood === mood.value ? "ring-2 ring-indigo-600" : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.value)}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="font-medium text-xs">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <div>
          <label className="block mb-2 font-medium text-slate-700 text-sm">
            Activities
          </label>
          <div className="flex flex-wrap gap-2">
            {activityOptions.map((activity) => (
              <button
                key={activity.label}
                onClick={() => {
                  setActivities((prev) =>
                    prev.includes(activity.label)
                      ? prev.filter((a) => a !== activity.label)
                      : [...prev, activity.label]
                  );
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors
                  ${activities.includes(activity.label)
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {activity.icon}
                {activity.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-slate-700 text-sm">
            Notes
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border-slate-200 p-3 border rounded-lg w-full text-sm"
            rows={3}
            placeholder="How are you feeling today? What's on your mind?"
          />
        </div>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 w-full"
          disabled={!selectedMood || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              Save Mood Entry
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
const MoodInsightsCard = ({ moodData }: { moodData: MoodEntry[] }) => {
  const getAverageMood = () => {
    const sum = moodData.reduce((acc: number, curr: { mood: number }) => acc + curr.mood, 0);
    return (sum / moodData.length).toFixed(1);
  };

  const getMostCommonActivity = () => {
    const activities = moodData.flatMap((entry) => entry.activities);
    return activities.reduce<Record<string, number>>((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-medium text-lg">Mood Insights</CardTitle>
        <CardDescription>Your emotional patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-indigo-700">
            Your average mood this week is {getAverageMood()}/10. Activities
            like
            {Object.entries(getMostCommonActivity())
              .sort(([, a], [, b]) => b - a)
              .slice(0, 2)
              .map(([activity]) => ` ${activity}`)
              .join(" and ")}
            seem to boost your mood the most.
          </p>
        </div>

        <div className="space-y-3">
          {moodData.slice(-3).map((entry, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg"
            >
              <div className="bg-white p-2 rounded-full">
                {entry.mood >= 7 ? (
                  <Smile className="w-4 h-4 text-green-500" />
                ) : entry.mood >= 5 ? (
                  <Meh className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Frown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-slate-700 text-sm">
                  {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                </p>
                <p className="text-slate-600 text-sm">Mood: {entry.mood}/10</p>
                <div className="flex gap-2 mt-2">
                  {entry.activities.map((activity, actIdx) => (
                    <span
                      key={actIdx}
                      className="bg-white px-2 py-1 rounded-full font-medium text-slate-600 text-xs"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ChartMouseEvent {
  activeTooltipIndex?: number;
  activeLabel?: string;
  activePayload?: Array<{
    value: number;
    payload: {
      day: string;
      mood: number;
    };
  }>;
}

const MoodTrendChart = ({ data }: { data: { day: string; mood: number }[] }) => {
  const [hoveredData, setHoveredData] = useState<{
    day: string;
    mood: number;
    activeIndex: number;
  } | null>(null);

  const CustomTooltip = () => {
    if (!hoveredData) return null;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-200">
        <p className="font-medium">{hoveredData.day}</p>
        <p className="text-slate-600">Mood: {hoveredData.mood}</p>
      </div>
    );
  };

  // Sort data chronologically
  const sortedData = [...data].sort((a, b) =>
    new Date(a.day).getTime() - new Date(b.day).getTime()
  );


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-medium text-lg">Mood Trends</CardTitle>
        <CardDescription>Your emotional journey over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}  // Use sortedData here
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onMouseMove={(e: ChartMouseEvent) => {
                if (e.activeTooltipIndex !== undefined && e.activePayload?.[0]) {
                  setHoveredData({
                    day: e.activeLabel || '',
                    mood: e.activePayload[0].value,
                    activeIndex: e.activeTooltipIndex,
                  });
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="day"
                stroke="#64748B"
                tick={{ fill: "#64748B" }}
              />
              <YAxis
                stroke="#64748B"
                domain={[0, 10]}
                tick={{ fill: "#64748B" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: "#4F46E5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

interface UserSettings {
  monthlyGoal: number
}



const calculateStreak = (entries: MoodEntry[]): number => {
  if (!entries.length) return 0;

  let streak = 0;
  const sortedEntries = entries.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const hasEntryToday = sortedEntries.some(entry =>
    isToday(new Date(entry.createdAt))
  );

  if (!hasEntryToday) return 0;

  const currentDate = new Date();
  let checkDate = currentDate;

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].createdAt);

    if (isSameDay(checkDate, entryDate)) {
      streak++;
      checkDate = new Date(checkDate.setDate(checkDate.getDate() - 1));
    } else {
      break;
    }
  }

  return streak;
};

const calculateMonthlyProgress = (
  entries: MoodEntry[],
  monthlyGoal: number
): number => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const entriesThisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= monthStart && entryDate <= monthEnd;
  });

  return Math.min(Math.round((entriesThisMonth.length / monthlyGoal) * 100), 100);
};

const Dashboard = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({ monthlyGoal: 10 })
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    currentStreak: 0,
    monthlyProgress: 0,
    totalEntries: 0,
    averageMood: 0,
    lastEntryDate: null as Date | null,
  })

  // Fetch all required data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch user settings
        const settingsResponse = await fetch('/api/settings')
        const settingsData = await settingsResponse.json()
        setSettings(settingsData)

        // Fetch mood entries
        const moodResponse = await fetch('/api/mood')
        const moodData = await moodResponse.json()
        setMoodEntries(moodData)

        // Calculate stats
        if (Array.isArray(moodData) && moodData.length > 0) {
          const streak = calculateStreak(moodData)
          const monthlyProgress = calculateMonthlyProgress(moodData, settingsData.monthlyGoal)
          const averageMood = moodData.reduce((acc, entry) => acc + entry.mood, 0) / moodData.length
          const lastEntry = new Date(moodData[0].createdAt)

          setStats({
            currentStreak: streak,
            monthlyProgress,
            totalEntries: moodData.length,
            averageMood: Number(averageMood.toFixed(1)),
            lastEntryDate: lastEntry,
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

  // Show loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Update the stats cards section
  const statsCards = [
    {
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      description: stats.currentStreak > 0
        ? "Keep the momentum going!"
        : "Start your streak today!",
    },
    {
      label: "Monthly Goal",
      value: `${stats.monthlyProgress}%`,
      icon: <Target className="w-5 h-5 text-indigo-500" />,
      description: `${settings.monthlyGoal} entries per month`,
    },
    {
      label: "Total Entries",
      value: stats.totalEntries,
      icon: <BookOpen className="w-5 h-5 text-green-500" />,
      description: stats.lastEntryDate
        ? `Last entry: ${format(stats.lastEntryDate, 'MMM d, yyyy')}`
        : "Start journaling today",
    },
    {
      label: "Average Mood",
      value: `${stats.averageMood}/10`,
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      description: "Your overall mood score",
    },
  ]

  return (
    <div className="flex bg-slate-50 h-screen">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-auto">
        <div className="space-y-8 p-8">
          <div>
            <h1 className="font-bold text-3xl text-slate-900">Welcome back!</h1>
            <p className="mt-2 text-slate-600">
              Track and understand your emotional well-being
            </p>
          </div>

          {/* Stats Grid */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-xl">{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Mood Entry and Insights */}
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
            <QuickMoodCard onMoodSubmit={async (data) => {
              try {
                const response = await fetch('/api/mood', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    mood: data.mood,
                    activities: data.activities,
                    notes: data.note,
                    date: new Date().toISOString(),
                  }),
                })

                if (!response.ok) throw new Error('Failed to save mood entry')

                // Refresh dashboard data after new entry
                //fetchDashboardData()
              } catch (error) {
                console.error('Error saving mood entry:', error)
              }
            }} />
            <MoodInsightsCard moodData={moodEntries} />
          </div>

          {/* Mood Trend Chart */}
          <MoodTrendChart data={moodEntries.map(entry => ({
            day: format(new Date(entry.createdAt), 'MMM d'),
            mood: entry.mood,
          }))} />
        </div>
      </main>
    </div>
  )
}

export default Dashboard;

