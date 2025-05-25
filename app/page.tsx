"use client"

import { useState, useEffect } from "react"
import { BookmarkCard } from "@/components/bookmark-card"
import { BookmarkForm } from "@/components/bookmark-form"
import { SearchBar } from "@/components/search-bar"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Plus, BookmarkIcon } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface Bookmark {
  id: string
  title: string
  description: string
  url: string
  createdAt: string
  userId: string
}

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Simular dados iniciais (substitua pela chamada real da API)
  useEffect(() => {
    const mockBookmarks: Bookmark[] = [
      {
        id: "1",
        title: "React Documentation",
        description: "Official React documentation with guides and API reference",
        url: "https://react.dev",
        createdAt: "2024-01-15",
        userId: "user1",
      },
      {
        id: "2",
        title: "Tailwind CSS",
        description: "A utility-first CSS framework for rapidly building custom designs",
        url: "https://tailwindcss.com",
        createdAt: "2024-01-14",
        userId: "user1",
      },
      {
        id: "3",
        title: "Next.js",
        description: "The React Framework for Production",
        url: "https://nextjs.org",
        createdAt: "2024-01-13",
        userId: "user1",
      },
    ]

    setTimeout(() => {
      setBookmarks(mockBookmarks)
      setFilteredBookmarks(mockBookmarks)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBookmarks(filtered)
  }, [searchTerm, bookmarks])

  const handleAddBookmark = (bookmarkData: Omit<Bookmark, "id" | "createdAt" | "userId">) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      userId: "user1",
    }
    setBookmarks((prev) => [newBookmark, ...prev])
    setShowForm(false)
  }

  const handleEditBookmark = (bookmarkData: Omit<Bookmark, "id" | "createdAt" | "userId">) => {
    if (!editingBookmark) return

    const updatedBookmark: Bookmark = {
      ...editingBookmark,
      ...bookmarkData,
    }

    setBookmarks((prev) => prev.map((bookmark) => (bookmark.id === editingBookmark.id ? updatedBookmark : bookmark)))
    setEditingBookmark(null)
    setShowForm(false)
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))
  }

  const openEditForm = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingBookmark(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookmarkIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900">Meus Bookmarks</h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Organize e compartilhe seus links favoritos de forma simples e eficiente
              </p>
            </div>

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Buscar por título ou descrição..."
                />
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Bookmark
              </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <BookmarkForm
                    onSubmit={editingBookmark ? handleEditBookmark : handleAddBookmark}
                    onCancel={closeForm}
                    initialData={editingBookmark}
                    isEditing={!!editingBookmark}
                  />
                </div>
              </div>
            )}

            {/* Bookmarks Grid */}
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-16">
                <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  {searchTerm ? "Nenhum bookmark encontrado" : "Nenhum bookmark cadastrado"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm ? "Tente buscar por outros termos" : "Comece adicionando seu primeiro bookmark"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-5 w-5 mr-2" />
                    Adicionar Primeiro Bookmark
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onEdit={openEditForm}
                    onDelete={handleDeleteBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
