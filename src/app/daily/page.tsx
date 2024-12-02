"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { format } from "date-fns"

import {
  Smile,
  Frown,
  Sun,
  Moon,
  Heart,
  Brain,
  Coffee,
  Music,
  BookOpen,
  Users,
  Home,
  Briefcase,
  Loader2,
  CheckCircle2,
  History,
  Pencil,
} from "lucide-react"
import { Sidebar } from "@/components/common/sidebar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { isToday, isFuture } from "date-fns"
import { cn } from "@/lib/utils"

interface MoodEntry {
  id: string
  mood: number
  emotions: string[]
  activities: string[]
  energy: number
  sleep: number
  notes: string | null
  aiInsights: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

const emotions = [
  { label: "Happy", icon: "😊" },
  { label: "Peaceful", icon: "😌" },
  { label: "Excited", icon: "🤩" },
  { label: "Grateful", icon: "🙏" },
  { label: "Anxious", icon: "😰" },
  { label: "Sad", icon: "😔" },
  { label: "Frustrated", icon: "😤" },
  { label: "Tired", icon: "😴" },
]

const activities = [
  { label: "Work", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Exercise", icon: <Heart className="w-4 h-4" /> },
  { label: "Family", icon: <Home className="w-4 h-4" /> },
  { label: "Friends", icon: <Users className="w-4 h-4" /> },
  { label: "Reading", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Music", icon: <Music className="w-4 h-4" /> },
  { label: "Coffee", icon: <Coffee className="w-4 h-4" /> },
  { label: "Learning", icon: <Brain className="w-4 h-4" /> },
]

export default function DailyMoodPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [formData, setFormData] = useState({
    mood: 5,
    emotions: [] as string[],
    activities: [] as string[],
    energy: 3,
    sleep: 7,
    notes: "",
  })
  
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false)

  
 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isEditMode, setIsEditMode] = useState(false)
  const [latestEntry, setLatestEntry] = useState<MoodEntry | null>(null)

  useEffect(() => {
    fetchMoodHistory()
  }, [])

  const fetchMoodHistory = async () => {
    try {
      const response = await fetch('/api/mood')
      if (response.ok) {
        const data = await response.json()
        setMoodHistory(data)

        // Check if there's an entry for today
        const today = new Date().toISOString().split('T')[0]
        const todayEntry = data.find((entry: MoodEntry) =>
          entry.createdAt.split('T')[0] === today
        )
        setHasSubmittedToday(!!todayEntry)
      }
    } catch (error) {
      console.error('Error fetching mood history:', error)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isFuture(date)) {
      setSelectedDate(date)
      setShowInsights(false)
      const existingEntry = moodHistory.find(
        entry => format(new Date(entry.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      
      if (existingEntry) {
        setIsEditMode(true)
        setFormData({
          mood: existingEntry.mood,
          emotions: existingEntry.emotions,
          activities: existingEntry.activities,
          energy: existingEntry.energy,
          sleep: existingEntry.sleep,
          notes: existingEntry.notes || "",
        })
      } else {
        setIsEditMode(false)
        setFormData({
          mood: 5,
          emotions: [],
          activities: [],
          energy: 3,
          sleep: 7,
          notes: "",
        })
      }
      setStep(1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/mood', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          mood: formData.mood,
          emotions: formData.emotions,
          activities: formData.activities,
          energy: formData.energy,
          sleep: formData.sleep,
          notes: formData.notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit mood entry')
      }

      setLatestEntry(data.data)
      setShowInsights(true)
      await fetchMoodHistory()
      setHasSubmittedToday(isToday(selectedDate))
      setIsEditMode(false)
    } catch (error) {
      console.error('Error submitting mood entry:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit mood entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setShowInsights(false)
    setStep(1)
    setLatestEntry(null)
    setFormData({
      mood: 5,
      emotions: [],
      activities: [],
      energy: 3,
      sleep: 7,
      notes: "",
    })
  }

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const renderHistoryCard = (entry: MoodEntry) => (
    <Card key={entry.id} className="bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-600">
            {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {entry.mood <= 3 ? "😔" : entry.mood <= 7 ? "😊" : "🤩"}
            </span>
            <span className="text-sm text-slate-500">{entry.mood}/10</span>
          </div>
        </div>

        {entry.emotions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {entry.emotions.map((emotion) => (
              <span key={emotion} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                {emotion}
              </span>
            ))}
          </div>
        )}

        {entry.activities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {entry.activities.map((activity) => (
              <span key={activity} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                {activity}
              </span>
            ))}
          </div>
        )}

        {entry.notes && (
          <p className="text-sm text-slate-600 mt-2">{entry.notes}</p>
        )}

        {entry.aiInsights && (
          <div className="mt-3 bg-indigo-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-indigo-800 mb-1">AI Insights</p>
            <p className="text-sm text-indigo-700">{entry.aiInsights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="flex bg-slate-50 h-screen">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
  
      <main className="flex-1 overflow-auto">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-slate-900">
                {isEditMode ? 'Edit Mood Entry' : 'Daily Check-in'}
              </h1>
              
              {/* Date Selection */}
              <div className="flex items-center justify-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => isFuture(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Entry Status */}
              {moodHistory.some(entry => 
                format(new Date(entry.createdAt), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
              ) && (
                <div className="text-sm text-slate-600 bg-slate-100 p-2 rounded-lg">
                  {isEditMode ? 
                    "You're editing an existing entry" : 
                    "You've already submitted an entry for this date"
                  }
                </div>
              )}
            </div>

            {/* Only show the "Today's Reflection Complete" message if it's today's date */}
            {hasSubmittedToday && isToday(selectedDate) ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-green-800 mb-2">Today&apos;s Reflection Complete!</h2>
                <p className="text-green-600 mb-4">
                  Great job on maintaining your daily reflection practice.
                </p>
                <Button
                  onClick={() => {
                    // Find today's entry
                    const todayEntry = moodHistory.find(entry => 
                      format(new Date(entry.createdAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    );
                    
                    if (todayEntry) {
                      setIsEditMode(true);
                      setFormData({
                        mood: todayEntry.mood,
                        emotions: todayEntry.emotions,
                        activities: todayEntry.activities,
                        energy: todayEntry.energy,
                        sleep: todayEntry.sleep,
                        notes: todayEntry.notes || "",
                      });
                      setShowInsights(false);
                      setStep(1);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Today&apos;s Entry
                </Button>
              </div>
            ) : (
              // Show the mood entry form
              <>
                {!showInsights ? (
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>Step {step} of 4</CardTitle>
                      <CardDescription>
                        {step === 1 && "How are you feeling?"}
                        {step === 2 && "What emotions are you experiencing?"}
                        {step === 3 && "What activities did you do?"}
                        {step === 4 && "Additional details"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {step === 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <Frown className="w-6 h-6 text-slate-400" />
                            <Smile className="w-6 h-6 text-slate-400" />
                          </div>
                          <Slider
                            value={[formData.mood]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={(value) => setFormData({ ...formData, mood: value[0] })}
                            className="w-full"
                          />
                          <div className="text-center">
                            <span className="text-2xl">
                              {formData.mood <= 3 ? "😔" : formData.mood <= 7 ? "😊" : "🤩"}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                        >
                          {emotions.map((emotion) => (
                            <button
                              key={emotion.label}
                              onClick={() => {
                                const newEmotions = formData.emotions.includes(emotion.label)
                                  ? formData.emotions.filter((e) => e !== emotion.label)
                                  : [...formData.emotions, emotion.label]
                                setFormData({ ...formData, emotions: newEmotions })
                              }}
                              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-colors
                                ${formData.emotions.includes(emotion.label)
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                              <span className="text-2xl">{emotion.icon}</span>
                              <span className="text-sm font-medium">{emotion.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                        >
                          {activities.map((activity) => (
                            <button
                              key={activity.label}
                              onClick={() => {
                                const newActivities = formData.activities.includes(activity.label)
                                  ? formData.activities.filter((a) => a !== activity.label)
                                  : [...formData.activities, activity.label]
                                setFormData({ ...formData, activities: newActivities })
                              }}
                              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-colors
                                ${formData.activities.includes(activity.label)
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                              {activity.icon}
                              <span className="text-sm font-medium">{activity.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                              Energy Level (1-10)
                            </label>
                            <div className="flex justify-between items-center">
                              <Moon className="w-5 h-5 text-slate-400" />
                              <Slider
                                value={[formData.energy]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={(value) => setFormData({ ...formData, energy: value[0] })}
                                className="mx-4"
                              />
                              <Sun className="w-5 h-5 text-slate-400" />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                              Hours of Sleep
                            </label>
                            <Slider
                              value={[formData.sleep]}
                              min={0}
                              max={12}
                              step={0.5}
                              onValueChange={(value) => setFormData({ ...formData, sleep: value[0] })}
                            />
                            <div className="text-center text-sm text-slate-600">
                              {formData.sleep} hours
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                              Additional Notes
                            </label>
                            <textarea
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              className="w-full h-32 p-3 border border-slate-200 rounded-lg"
                              placeholder="Any thoughts you'd like to share..."
                            />
                          </div>
                        </motion.div>
                      )}

                      <div className="flex justify-between mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setStep(step - 1)}
                          disabled={step === 1}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() => {
                            if (step < 4) setStep(step + 1)
                            else handleSubmit()
                          }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : step === 4 ? (
                            "Complete"
                          ) : (
                            "Next"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // Show insights after submission
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Insights</CardTitle>
                        <CardDescription>AI-generated analysis of your mood entry</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {latestEntry?.aiInsights && (
                          <div className="bg-indigo-50 p-6 rounded-xl">
                            <p className="text-indigo-700 leading-relaxed whitespace-pre-wrap">
                              {latestEntry.aiInsights.replace(/\*\*/g, '')}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-4 mt-4">
                          <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => {
                              setShowInsights(false)
                              setStep(1)
                            }}
                          >
                            Edit Entry
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => {
                              resetForm()
                              fetchMoodHistory()
                            }}
                          >
                            New Entry
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}

            {/* History Section */}
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-800">Previous Reflections</h2>
              </div>
              <div className="grid gap-4">
                {moodHistory.map(renderHistoryCard)}
              </div>
              {moodHistory.length === 0 && (
                <Card className="bg-slate-50 border-dashed border-2">
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-600">No previous entries yet. Start your reflection journey today!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
