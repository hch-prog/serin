"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import {
    Target,
    Plus,
    Clock,
    MoreVertical,
    ChevronRight,
    Loader2,
    X,
} from "lucide-react"
import { Sidebar } from "@/components/common/sidebar"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface Goal {
    id: string
    title: string
    description: string | null
    category: string
    status: string
    priority: string
    dueDate: string | null
    progress: number
    milestones: Milestone[]
    createdAt: string
    updatedAt: string
}

interface Milestone {
    id: string
    title: string
    isCompleted: boolean
    dueDate: string | null
}

const categories = [
    { name: "Personal", color: "bg-blue-100 text-blue-800" },
    { name: "Health", color: "bg-green-100 text-green-800" },
    { name: "Career", color: "bg-purple-100 text-purple-800" },
    { name: "Financial", color: "bg-yellow-100 text-yellow-800" },
    { name: "Learning", color: "bg-pink-100 text-pink-800" },
]

const priorities = ["High", "Medium", "Low"]
const statuses = ["In Progress", "Completed", "On Hold"]

export default function GoalsPage() {
    useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        },
    })

    const [goals, setGoals] = useState<Goal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isNewGoalOpen, setIsNewGoalOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
    const [filter, setFilter] = useState({
        category: "",
        status: "",
    })
    const [newGoal, setNewGoal] = useState({
        title: "",
        description: "",
        category: categories[0].name,
        priority: "Medium",
        dueDate: undefined as Date | undefined,
        milestones: [] as { title: string; dueDate: Date | undefined }[],
    })

    const fetchGoals = async () => {
        try {
            const params = new URLSearchParams()
            if (filter.category) params.append('category', filter.category)
            if (filter.status) params.append('status', filter.status)

            const response = await fetch(`/api/goals?${params}`)
            if (!response.ok) throw new Error('Failed to fetch goals')
            const data = await response.json()
            setGoals(data)
        } catch (error) {
            console.error('Error fetching goals:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [filter, fetchGoals])

    const handleCreateGoal = async () => {
        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGoal),
            })

            if (!response.ok) throw new Error('Failed to create goal')

            await fetchGoals()
            setIsNewGoalOpen(false)
            setNewGoal({
                title: "",
                description: "",
                category: categories[0].name,
                priority: "Medium",
                dueDate: undefined,
                milestones: [],
            })
        } catch (error) {
            console.error('Error creating goal:', error)
        }
    }

    const handleUpdateGoal = async (goalId: string, updates: Partial<Goal>) => {
        try {
            const response = await fetch(`/api/goals?id=${goalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            })

            if (!response.ok) throw new Error('Failed to update goal')

            await fetchGoals()
        } catch (error) {
            console.error('Error updating goal:', error)
        }
    }

    const handleDeleteGoal = async (goalId: string) => {
        if (!confirm('Are you sure you want to delete this goal?')) return

        try {
            const response = await fetch(`/api/goals?id=${goalId}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete goal')

            await fetchGoals()
        } catch (error) {
            console.error('Error deleting goal:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar isCollapsed={false} onToggle={() => { }} />

            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Goals</h1>
                                <p className="text-slate-600 mt-1">Track and achieve your aspirations</p>
                            </div>

                            <Button onClick={() => setIsNewGoalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Goal
                            </Button>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4 mb-8">
                            <select
                                className="border rounded-lg px-3 py-2"
                                value={filter.category}
                                onChange={(e) => setFilter(f => ({ ...f, category: e.target.value }))}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>

                            <select
                                className="border rounded-lg px-3 py-2"
                                value={filter.status}
                                onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
                            >
                                <option value="">All Statuses</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* Goals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals.map(goal => (
                                <Card key={goal.id} className="relative">
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{goal.title}</CardTitle>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {goal.description}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => setSelectedGoal(goal)}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDeleteGoal(goal.id)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${categories.find(c => c.name === goal.category)?.color
                                                    }`}>
                                                    {goal.category}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                        goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {goal.priority}
                                                </span>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm text-slate-600 mb-2">
                                                    <span>Progress</span>
                                                    <span>{goal.progress}%</span>
                                                </div>
                                                <Progress value={goal.progress} />
                                            </div>

                                            {goal.dueDate && (
                                                <div className="flex items-center text-sm text-slate-600">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>Due {format(new Date(goal.dueDate), 'MMM d, yyyy')}</span>
                                                </div>
                                            )}

                                            {goal.milestones.length > 0 && (
                                                <div className="border-t pt-4 mt-4">
                                                    <h4 className="text-sm font-medium mb-2">Milestones</h4>
                                                    <div className="space-y-2">
                                                        {goal.milestones.map(milestone => (
                                                            <div
                                                                key={milestone.id}
                                                                className="flex items-center gap-2 text-sm"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={milestone.isCompleted}
                                                                    onChange={() => {
                                                                        const updatedMilestones = goal.milestones.map(m =>
                                                                            m.id === milestone.id
                                                                                ? { ...m, isCompleted: !m.isCompleted }
                                                                                : m
                                                                        )
                                                                        handleUpdateGoal(goal.id, {
                                                                            milestones: updatedMilestones,
                                                                            progress: Math.round(
                                                                                (updatedMilestones.filter(m => m.isCompleted).length /
                                                                                    updatedMilestones.length) *
                                                                                100
                                                                            ),
                                                                        })
                                                                    }}
                                                                />
                                                                <span className={milestone.isCompleted ? 'line-through text-slate-400' : ''}>
                                                                    {milestone.title}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* New Goal Dialog */}
            <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    {/* Fixed Header */}
                    <DialogHeader className="space-y-3 pb-4 border-b flex-shrink-0">
                        <DialogTitle className="text-2xl font-bold">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Create New Goal
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                            Define your goal, break it down into milestones, and track your progress
                        </DialogDescription>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto py-6 px-1">
                        <div className="space-y-8">
                            {/* Title Section */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Goal Title</Label>
                                <Input
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    placeholder="What do you want to achieve?"
                                    className="text-lg py-3 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Description Section */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Description</Label>
                                <Textarea
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                    placeholder="Describe your goal in detail. What does success look like?"
                                    className="min-h-[120px] border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            {/* Category and Priority Section */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Category</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none border rounded-lg px-4 py-3 pr-10 bg-white
                                 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500
                                 text-slate-700 cursor-pointer"
                                            value={newGoal.category}
                                            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Priority Level</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {priorities.map(priority => (
                                            <button
                                                key={priority}
                                                onClick={() => setNewGoal({ ...newGoal, priority })}
                                                className={`px-4 py-3 rounded-lg border transition-all ${newGoal.priority === priority
                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                                    }`}
                                            >
                                                {priority}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Due Date Section */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Due Date</Label>
                                <div className="border rounded-lg p-4 bg-white">
                                    <CalendarComponent
                                        mode="single"
                                        selected={newGoal.dueDate}
                                        onSelect={(date: Date | undefined) =>
                                            setNewGoal({ ...newGoal, dueDate: date || undefined })
                                        }
                                        className="rounded-md"
                                        classNames={{
                                            day_selected: "bg-indigo-600 text-white hover:bg-indigo-700",
                                            day_today: "bg-slate-100 text-slate-900",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Milestones Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-semibold text-slate-700">Milestones</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setNewGoal({
                                                ...newGoal,
                                                milestones: [...newGoal.milestones, { title: "", dueDate: undefined }],
                                            })
                                        }}
                                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Milestone
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {newGoal.milestones.map((milestone, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3 items-start group"
                                        >
                                            <div className="flex-1">
                                                <Input
                                                    value={milestone.title}
                                                    onChange={(e) => {
                                                        const updatedMilestones = [...newGoal.milestones]
                                                        updatedMilestones[index].title = e.target.value
                                                        setNewGoal({ ...newGoal, milestones: updatedMilestones })
                                                    }}
                                                    placeholder="What's the milestone?"
                                                    className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const updatedMilestones = newGoal.milestones.filter((_, i) => i !== index)
                                                    setNewGoal({ ...newGoal, milestones: updatedMilestones })
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    ))}

                                    {newGoal.milestones.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed rounded-lg border-slate-200">
                                            <Target className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                                            <p className="text-slate-600 mb-2">No milestones yet</p>
                                            <p className="text-sm text-slate-400">
                                                Break down your goal into smaller, achievable steps
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="flex justify-end gap-3 pt-6 border-t mt-auto flex-shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsNewGoalOpen(false)}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateGoal}
                            className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Goal
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Goal Dialog - Similar to New Goal Dialog */}
            <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
                {/* Similar form as new goal, but populated with selectedGoal data */}
            </Dialog>
        </div>
    )
} 