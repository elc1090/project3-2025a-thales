"use client"

import { useState, useEffect } from "react"
import { BookmarkCard } from "@/components/bookmark-card"
import { BookmarkForm } from "@/components/bookmark-form"
import { SearchBar } from "@/components/search-bar"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Plus, BookmarkIcon, AlertCircle, Globe, UserCheck } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { bookmarkAPI } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

interface User {
  id: string
  name: string
  email: string
}

interface Bookmark {
  id: string
  title: string
  description: string
  url: string
  createdAt: string
  updatedAt: string
  userId: string
  user: User
}

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentView, setCurrentView] = useState<"all" | "my">("all")
  const { user } = useAuth()

  // Carregar bookmarks do banco
  const loadBookmarks = async (search?: string, view: "all" | "my" = currentView) => {
    try {
      setLoading(true)
      setError("")

      let data: Bookmark[]
      if (view === "my" && user) {
        data = await bookmarkAPI.getMyBookmarks(user.id, search)
      } else {
        data = await bookmarkAPI.getBookmarks(search)
      }

      setBookmarks(data)
    } catch (err) {
      setError("Erro ao carregar bookmarks. Tente novamente.")
      console.error("Erro ao carregar bookmarks:", err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar bookmarks ao montar o componente
  useEffect(() => {
    if (user) {
      loadBookmarks()
    }
  }, [user, currentView])

  // Buscar bookmarks quando o termo de busca mudar
  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        loadBookmarks(searchTerm, currentView)
      }, 300) // Debounce de 300ms

      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, currentView, user])

  const handleViewChange = (view: "all" | "my") => {
    setCurrentView(view)
    setSearchTerm("") // Limpar busca ao trocar de view
  }

  const handleAddBookmark = async (bookmarkData: { title: string; description: string; url: string }) => {
    try {
      const newBookmark = await bookmarkAPI.createBookmark(bookmarkData)
      setBookmarks((prev) => [newBookmark, ...prev])
      setShowForm(false)
    } catch (err) {
      console.error("Erro ao criar bookmark:", err)
      throw err // Deixa o formulário lidar com o erro
    }
  }

  const handleEditBookmark = async (bookmarkData: { title: string; description: string; url: string }) => {
    if (!editingBookmark) return

    try {
      const updatedBookmark = await bookmarkAPI.updateBookmark(editingBookmark.id, bookmarkData)
      setBookmarks((prev) => prev.map((bookmark) => (bookmark.id === editingBookmark.id ? updatedBookmark : bookmark)))
      setEditingBookmark(null)
      setShowForm(false)
    } catch (err) {
      console.error("Erro ao editar bookmark:", err)
      throw err // Deixa o formulário lidar com o erro
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      await bookmarkAPI.deleteBookmark(id)
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))
    } catch (err) {
      console.error("Erro ao excluir bookmark:", err)
      setError("Erro ao excluir bookmark. Tente novamente.")
    }
  }

  const openEditForm = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingBookmark(null)
  }

  const getHeaderInfo = () => {
    if (currentView === "my") {
      return {
        icon: <UserCheck className="h-8 w-8 text-blue-600" />,
        title: "Meus Bookmarks",
        description: "Gerencie seus bookmarks pessoais",
      }
    }
    return {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Bookmarks Compartilhados",
      description: "Descubra e compartilhe links interessantes com a comunidade",
    }
  }

  const getSearchPlaceholder = () => {
    if (currentView === "my") {
      return "Buscar nos meus bookmarks..."
    }
    return "Buscar por título, descrição ou autor..."
  }

  const getEmptyStateMessage = () => {
    if (currentView === "my") {
      return {
        title: searchTerm ? "Nenhum bookmark encontrado" : "Você ainda não tem bookmarks",
        description: searchTerm ? "Tente buscar por outros termos" : "Comece adicionando seu primeiro bookmark",
      }
    }
    return {
      title: searchTerm ? "Nenhum bookmark encontrado" : "Nenhum bookmark cadastrado",
      description: searchTerm ? "Tente buscar por outros termos" : "Seja o primeiro a compartilhar um bookmark",
    }
  }

  const headerInfo = getHeaderInfo()
  const emptyState = getEmptyStateMessage()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar currentView={currentView} onViewChange={handleViewChange} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                {headerInfo.icon}
                <h1 className="text-4xl font-bold text-gray-900">{headerInfo.title}</h1>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{headerInfo.description}</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder={getSearchPlaceholder()}
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

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              /* Bookmarks Grid */
              <>
                {bookmarks.length === 0 ? (
                  <div className="text-center py-16">
                    <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">{emptyState.title}</h3>
                    <p className="text-gray-400 mb-6">{emptyState.description}</p>
                    {!searchTerm && (
                      <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-5 w-5 mr-2" />
                        {currentView === "my" ? "Adicionar Meu Primeiro Bookmark" : "Adicionar Primeiro Bookmark"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark) => (
                      <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        onEdit={openEditForm}
                        onDelete={handleDeleteBookmark}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
