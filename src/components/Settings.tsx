"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Loader2, User, Bell, Shield, Download, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function Settings() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        },
    })

    const [isLoading, setIsLoading] = useState(false)

    const [notifications, setNotifications] = useState({
        email: true,
        reminders: true,
        insights: true
    })

    const [privacy, setPrivacy] = useState({
        shareData: false,
        anonymousAnalytics: true
    })

    const handleExportData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/export-data')
            const data = await response.json()

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'mood-data.json'
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        )
    }
    return (
        <div>
            <div className="flex-1 overflow-auto">
                <div className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Profile
                                </CardTitle>
                                <CardDescription>Manage your account settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    {session.user?.image && (
                                        <Image
                                            src={session.user.image}
                                            alt="Profile"
                                            width={60}
                                            height={60}
                                            className="rounded-full"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{session.user?.name}</p>
                                        <p className="text-sm text-slate-500">{session.user?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notifications
                                    </CardTitle>
                                    <CardDescription>Configure your notification preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="email-notifications">Email Notifications</Label>
                                        <Switch
                                            id="email-notifications"
                                            checked={notifications.email}
                                            onCheckedChange={(checked) =>
                                                setNotifications(prev => ({ ...prev, email: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="daily-reminders">Daily Reminders</Label>
                                        <Switch
                                            id="daily-reminders"
                                            checked={notifications.reminders}
                                            onCheckedChange={(checked) =>
                                                setNotifications(prev => ({ ...prev, reminders: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="ai-insights">AI Insights</Label>
                                        <Switch
                                            id="ai-insights"
                                            checked={notifications.insights}
                                            onCheckedChange={(checked) =>
                                                setNotifications(prev => ({ ...prev, insights: checked }))
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Privacy
                                    </CardTitle>
                                    <CardDescription>Manage your privacy settings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="share-data">Share Data for Research</Label>
                                        <Switch
                                            id="share-data"
                                            checked={privacy.shareData}
                                            onCheckedChange={(checked) =>
                                                setPrivacy(prev => ({ ...prev, shareData: checked }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="analytics">Anonymous Analytics</Label>
                                        <Switch
                                            id="analytics"
                                            checked={privacy.anonymousAnalytics}
                                            onCheckedChange={(checked) =>
                                                setPrivacy(prev => ({ ...prev, anonymousAnalytics: checked }))
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="w-5 h-5" />
                                        Data Management
                                    </CardTitle>
                                    <CardDescription>Manage your mood tracking data</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleExportData}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Exporting...
                                            </>
                                        ) : (
                                            'Export Your Data'
                                        )}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => {
                                            if (confirm('Are you sure? This action cannot be undone.')) {
                                                // Handle account deletion
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    )
}