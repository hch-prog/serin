"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import {
  Search,
  Plus,
  Grid2X2,
  List,
  MoreVertical,
  Edit3,
  Trash2,
  Clock,
  Filter,
  SortAsc,
  Loader2,
  Save,
  X,
  AlertCircle,
  Bookmark,
} from "lucide-react"
import { Sidebar } from "@/components/common/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood?: string
  weather?: string
  tags: string[]
  category: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  imageUrl?: string
}

const categories = [
  { name: "Personal", color: "bg-blue-100 text-blue-800" },
  { name: "Work", color: "bg-purple-100 text-purple-800" },
  { name: "Travel", color: "bg-green-100 text-green-800" },
  { name: "Dreams", color: "bg-yellow-100 text-yellow-800" },
  { name: "Goals", color: "bg-pink-100 text-pink-800" },
]

const moodEmojis = ["😊", "😔", "😐", "😡", "🥳", "😴", "🤔", "😅"]

export default function JournalPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'updated'>('newest')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "",
    weather: "",
    tags: [] as string[],
    category: categories[0].name,
    isFavorite: false,
  })

  // Add this state for delete confirmation
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEntries = async () => {
      if (status === "authenticated") {
        setIsLoading(true)
        try {
          const response = await fetch('/api/journal')
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          if (isMounted) {
            if (Array.isArray(data)) {
              setEntries(data)
            } else {
              console.error('Unexpected data format:', data)
              setEntries([])
            }
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching entries:', error)
            setEntries([])
          }
        } finally {
          if (isMounted) {
            setIsLoading(false)
          }
        }
      }
    }

    loadEntries()

    return () => {
      isMounted = false
    }
  }, [status])

  const handleSaveEntry = async () => {
    try {
      setIsSaving(true)
      // Validate required fields
      if (!newEntry.title.trim()) {
        setError("Title is required");
        return;
      }
      if (!newEntry.content.trim()) {
        setError("Content is required");
        return;
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newEntry.title.trim(),
          content: newEntry.content.trim(),
          mood: newEntry.mood,
          weather: newEntry.weather,
          tags: newEntry.tags,
          category: newEntry.category,
          isFavorite: newEntry.isFavorite
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save entry')
      }

      // Success! Reset form and refresh entries
      await fetchEntries()
      setIsNewEntryOpen(false)
      resetNewEntry()
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save entry')
    } finally {
      setIsSaving(false)
    }
  }

  const resetNewEntry = () => {
    setNewEntry({
      title: "",
      content: "",
      mood: "",
      weather: "",
      tags: [],
      category: categories[0].name,
      isFavorite: false,
    })
  }

  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || entry.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          case 'updated':
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          default:
            return 0
        }
      })
  }, [entries, searchQuery, selectedCategory, sortBy])

  const renderEntryCard = (entry: JournalEntry) => (
    <motion.div
      key={entry.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${viewMode === 'grid'
        ? 'col-span-1'
        : 'col-span-full'
        }`}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-none">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-semibold line-clamp-1">
              {entry.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4" />
              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
              {entry.mood && <span>{entry.mood}</span>}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedEntry(entry)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setEntryToDelete(entry)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className={`text-slate-600 ${viewMode === 'grid' ? 'line-clamp-3' : 'line-clamp-none'}`}>
            {entry.content}
          </p>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {entry.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <Badge
              className={
                categories.find(c => c.name === entry.category)?.color || 'bg-slate-100'
              }
            >
              {entry.category}
            </Badge>
            {entry.isFavorite && (
              <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

 
  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/journal')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setEntries(data)
      } else {
        console.error('Unexpected data format:', data)
        setEntries([])
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
      setEntries([])
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function to handle deletion
  const handleDeleteEntry = async (entry: JournalEntry) => {
    try {
      const response = await fetch(`/api/journal?id=${entry.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      await fetchEntries(); // Refresh the list
      setEntryToDelete(null); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete entry');
    }
  };

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

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Journal</h1>
                <p className="text-slate-600 mt-1">Capture your thoughts and memories</p>
              </div>

              <Button onClick={() => setIsNewEntryOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="float-right text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory(null)}
                      className={selectedCategory === null ? 'bg-slate-100' : ''}
                    >
                      All Categories
                    </DropdownMenuItem>
                    {categories.map(category => (
                      <DropdownMenuItem
                        key={category.name}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.name ? null : category.name
                        )}
                        className={selectedCategory === category.name ? 'bg-slate-100' : ''}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SortAsc className="w-4 h-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('newest')}>
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('updated')}>
                      Recently Updated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex border rounded-lg p-1 bg-white">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Entries Grid/List */}
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : entries.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-500 mb-4">
                    {error ? 'Failed to load entries' : 'No journal entries yet'}
                  </p>
                  <Button
                    onClick={() => setIsNewEntryOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Entry
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
                  }`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredEntries.map((entry) => renderEntryCard(entry))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* New Entry Dialog */}
      <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
            <DialogDescription>
              What&apos;s on your mind today?
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <Input
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="Entry Title..."
                className="text-xl font-medium"
              />
            </div>

            {/* Content */}
            <div>
              <Textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                placeholder="Write your thoughts..."
                className="min-h-[400px] resize-none"
              />
            </div>

            {/* Metadata Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <Label>Category</Label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                    className="w-full border rounded-md p-2"
                  >
                    {categories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mood */}
                <div>
                  <Label>Mood</Label>
                  <div className="flex gap-2 mt-2">
                    {moodEmojis.map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        onClick={() => setNewEntry({ ...newEntry, mood: emoji })}
                        className={`p-2 rounded-lg hover:bg-slate-100 ${newEntry.mood === emoji ? 'bg-slate-100' : ''
                          }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weather */}
                <div>
                  <Label>Weather</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={newEntry.weather || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, weather: e.target.value })}
                  >
                    <option value="">Select weather</option>
                    <option value="sunny">Sunny ☀️</option>
                    <option value="rainy">Rainy 🌧️</option>
                    <option value="cloudy">Cloudy ⛅</option>
                    <option value="snowy">Snowy 🌨️</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2 p-2 border rounded-md min-h-[100px]">
                    {newEntry.tags.length === 0 ? (
                      <p className="text-slate-400 text-sm">No tags added yet</p>
                    ) : (
                      newEntry.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                            onClick={() => {
                              const newTags = [...newEntry.tags];
                              newTags.splice(index, 1);
                              setNewEntry({ ...newEntry, tags: newTags });
                            }}
                          />
                        </Badge>
                      ))
                    )}
                    <Input
                      placeholder="Add tag..."
                      className="w-24 h-7 text-sm border-dashed"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newTag = e.currentTarget.value.trim().toLowerCase();

                          if (newEntry.tags.map(t => t.toLowerCase()).includes(newTag)) {
                            setError(`Tag &quot;${newTag}&quot; already exists`);
                            setTimeout(() => setError(null), 3000);
                            return;
                          }

                          setNewEntry({
                            ...newEntry,
                            tags: [...newEntry.tags, newTag]
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Favorite Toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newEntry.isFavorite}
                    onCheckedChange={(checked) =>
                      setNewEntry({ ...newEntry, isFavorite: checked })
                    }
                  />
                  <Label>Mark as favorite</Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEntry}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog - Similar to New Entry Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Journal Entry</DialogTitle>
            <DialogDescription>
              Update your thoughts and memories
            </DialogDescription>
          </DialogHeader>

          {/* Add the form content here */}
          <div className="space-y-6">
            <div className="relative">
              <Input
                value={selectedEntry?.title || ''}
                onChange={(e) => setSelectedEntry(selectedEntry ? {
                  ...selectedEntry,
                  title: e.target.value
                } : null)}
                placeholder="Entry Title..."
                className="text-xl font-serif"
              />
            </div>

            <Textarea
              value={selectedEntry?.content || ''}
              onChange={(e) => setSelectedEntry(selectedEntry ? {
                ...selectedEntry,
                content: e.target.value
              } : null)}
              placeholder="Content..."
              className="min-h-[200px]"
            />

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setSelectedEntry(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (selectedEntry) {
                    try {
                      const response = await fetch(`/api/journal?id=${selectedEntry.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(selectedEntry),
                      })

                      if (!response.ok) throw new Error('Failed to update entry')

                      await fetchEntries()
                      setSelectedEntry(null)
                    } catch (error) {
                      console.error('Error updating entry:', error)
                    }
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!entryToDelete} onOpenChange={() => setEntryToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{entryToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setEntryToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => entryToDelete && handleDeleteEntry(entryToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
