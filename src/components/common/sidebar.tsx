"use client"

import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Calendar,
  Settings,
  Menu,
  LogOut
} from "lucide-react"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const { data: session } = useSession()

  const menuItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", href: "/dashboard" },
    { icon: <BookOpen />, label: "Daily Mood", href: "/daily" },
    { icon: <BookOpen />, label: "Journal", href: "/journal" },
    { icon: <Target />, label: "Goals", href: "/goals" },
    { icon: <Calendar />, label: "Calendar", href: "/calendar" },
    { icon: <Settings />, label: "Settings", href: "/settings" },
  ]

  return (
    <div
      className={`
        h-screen bg-white border-r border-slate-200
        transition-all duration-300 flex flex-col
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="flex items-center border-slate-200 px-4 border-b h-16">
        <button
          onClick={onToggle}
          className="hover:bg-slate-100 p-2 rounded-lg"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
        {!isCollapsed && (
          <h1 className="ml-3 font-semibold text-xl">MoodTracker</h1>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className={`
                  flex items-center p-3 rounded-lg text-slate-600
                  hover:bg-slate-100 hover:text-slate-900 transition-colors
                  ${isCollapsed ? "justify-center" : "space-x-3"}
                `}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {session?.user && (
        <div className="border-t border-slate-200 p-4">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
            {session.user.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            )}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {session.user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-slate-200 p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`
            flex items-center p-3 rounded-lg text-slate-600
            hover:bg-slate-100 hover:text-slate-900 transition-colors w-full
            ${isCollapsed ? "justify-center" : "space-x-3"}
          `}
        >
          <LogOut className="w-6 h-6" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}
