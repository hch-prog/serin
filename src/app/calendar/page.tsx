"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Zap,
  Heart,
  Brain,
  Coffee,
  Music,
  Users,
  Sparkles,
} from "lucide-react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO,
  subMonths,
  addMonths,
} from "date-fns"
import { Sidebar } from "@/components/common/sidebar"

interface MoodEntry {
  id: string
  date: string
  mood: number
  emotions: string[]
  activities: string[]
}

const moodEmojis = {
  1: { emoji: "😔", color: "bg-red-100 text-red-800 border-red-200" },
  2: { emoji: "😕", color: "bg-orange-100 text-orange-800 border-orange-200" },
  3: { emoji: "😐", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  4: { emoji: "🙂", color: "bg-blue-100 text-blue-800 border-blue-200" },
  5: { emoji: "😊", color: "bg-green-100 text-green-800 border-green-200" },
}

const getMoodColor = (mood: number) => {
  if (mood <= 2) return "from-red-500/20 to-red-500/10 border-red-200"
  if (mood <= 4) return "from-amber-500/20 to-amber-500/10 border-amber-200"
  if (mood <= 6) return "from-yellow-500/20 to-yellow-500/10 border-yellow-200"
  if (mood <= 8) return "from-blue-500/20 to-blue-500/10 border-blue-200"
  return "from-green-500/20 to-green-500/10 border-green-200"
}

const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 6) return <Moon className="w-5 h-5 text-indigo-400" />
  if (hour < 12) return <Sun className="w-5 h-5 text-amber-400" />
  if (hour < 18) return <Cloud className="w-5 h-5 text-blue-400" />
  return <Moon className="w-5 h-5 text-indigo-400" />
}

export default function CalendarPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [currentDate, setCurrentDate] = useState(new Date())
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null)

  useEffect(() => {
    fetchMoodEntries()
  }, [currentDate])

  const fetchMoodEntries = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(
        `/api/calendar?year=${currentDate.getFullYear()}&month=${currentDate.getMonth()}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch mood entries')
      }
      
      const data = await response.json()
      setMoodEntries(data)
    } catch (error) {
      console.error("Error fetching mood entries:", error)
      setError(error instanceof Error ? error.message : 'Failed to load calendar data')
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  const getMoodForDay = (date: Date) => {
    return moodEntries.find(entry => 
      isSameDay(parseISO(entry.date), date)
    )
  }

  const getDayClasses = (date: Date) => {
    const baseClasses = "min-h-[120px] rounded-xl border transition-all duration-200"
    const todayClasses = isToday(date) ? "ring-2 ring-indigo-500 ring-offset-2" : ""
    const monthClasses = isSameMonth(date, currentDate) ? "bg-white" : "bg-slate-50/50"
    
    return `${baseClasses} ${todayClasses} ${monthClasses} p-2 relative hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`
  }

  const renderMoodDetails = (moodEntry: MoodEntry) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-2 p-2 rounded-lg ${getMoodColor(moodEntry.mood)} bg-gradient-to-br border`}
    >
      <div className="text-sm font-medium flex items-center gap-2">
        <span className="text-lg">{moodEmojis[moodEntry.mood as keyof typeof moodEmojis]?.emoji}</span>
        <span>{moodEntry.mood}/10</span>
      </div>
      {moodEntry.emotions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {moodEntry.emotions.slice(0, 2).map((emotion, idx) => (
            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm">
              {emotion}
            </span>
          ))}
          {moodEntry.emotions.length > 2 && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm">
              +{moodEntry.emotions.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )

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
      
      <div className="flex-1 overflow-auto">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    Mood Calendar
                    {getTimeOfDay()}
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Track your emotional journey through time
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="hover:bg-slate-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                    {format(currentDate, "MMMM yyyy")}
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="hover:bg-slate-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : error ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <CloudRain className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-500 font-medium">{error}</p>
                      <Button 
                        variant="outline" 
                        onClick={fetchMoodEntries}
                        className="mt-4"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="text-center font-medium text-sm py-2 text-indigo-600"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-4">
                      {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, index) => (
                        <div 
                          key={`empty-${index}`} 
                          className="min-h-[120px] rounded-xl border border-dashed border-slate-200 bg-slate-50/30" 
                        />
                      ))}
                      
                      {getDaysInMonth().map((date) => {
                        const moodEntry = getMoodForDay(date)
                        return (
                          <motion.div
                            key={date.toISOString()}
                            layoutId={date.toISOString()}
                            className={getDayClasses(date)}
                            onClick={() => moodEntry && setSelectedEntry(moodEntry)}
                          >
                            <span className={`
                              inline-block px-2 py-1 rounded-full text-sm font-medium
                              ${isToday(date) 
                                ? "bg-indigo-100 text-indigo-700" 
                                : "text-slate-600"}
                            `}>
                              {format(date, "d")}
                            </span>
                            {moodEntry && renderMoodDetails(moodEntry)}
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Mood Legend */}
                    <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                      {Object.entries(moodEmojis).map(([score, { emoji, color }]) => (
                        <div key={score} className={`px-3 py-1.5 rounded-full ${color} flex items-center gap-2`}>
                          <span>{emoji}</span>
                          <span className="text-sm font-medium">Level {score}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Monthly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {[
                { 
                  icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
                  label: "Average Mood",
                  value: "7.5",
                  trend: "+0.5 from last month"
                },
                {
                  icon: <Zap className="w-5 h-5 text-purple-500" />,
                  label: "Most Productive Day",
                  value: "Wednesdays",
                  trend: "Based on activities"
                },
                {
                  icon: <Heart className="w-5 h-5 text-red-500" />,
                  label: "Top Activity",
                  value: "Exercise",
                  trend: "15 times this month"
                },
                {
                  icon: <Brain className="w-5 h-5 text-blue-500" />,
                  label: "Mindful Minutes",
                  value: "345",
                  trend: "Meditation & reflection"
                }
              ].map((stat, index) => (
                <Card key={index} className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{stat.trend}</p>
                      </div>
                      <div className="bg-slate-100 p-3 rounded-xl">{stat.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for detailed view */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal content here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
