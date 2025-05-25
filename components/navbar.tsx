"use client"

import { useState } from "react"
import { Bookmark, Menu, X, User, LogOut, Globe, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface NavbarProps {
  currentView?: "all" | "my"
  onViewChange?: (view: "all" | "my") => void
}

export function Navbar({ currentView = "all", onViewChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleViewChange = (view: "all" | "my") => {
    if (onViewChange) {
      onViewChange(view)
    }
    setIsMenuOpen(false) // Fechar menu mobile
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BookmarkManager</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleViewChange("all")}
              className={`flex items-center gap-2 font-medium transition-colors ${
                currentView === "all"
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <Globe className="h-4 w-4" />
              Todos os Bookmarks
            </button>
            <button
              onClick={() => handleViewChange("my")}
              className={`flex items-center gap-2 font-medium transition-colors ${
                currentView === "my"
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Meus Bookmarks
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleViewChange("all")}
                className={`flex items-center gap-2 font-medium transition-colors text-left ${
                  currentView === "all" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <Globe className="h-4 w-4" />
                Todos os Bookmarks
              </button>
              <button
                onClick={() => handleViewChange("my")}
                className={`flex items-center gap-2 font-medium transition-colors text-left ${
                  currentView === "my" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <UserCheck className="h-4 w-4" />
                Meus Bookmarks
              </button>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
