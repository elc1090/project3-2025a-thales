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

interface CreateBookmarkData {
  title: string
  description: string
  url: string
}

class BookmarkAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem("bookmark-token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getBookmarks(search?: string): Promise<Bookmark[]> {
    const url = new URL("/api/bookmarks", window.location.origin)
    if (search) {
      url.searchParams.set("search", search)
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error("Erro ao buscar bookmarks")
    }

    return response.json()
  }

  async createBookmark(data: CreateBookmarkData): Promise<Bookmark> {
    const response = await fetch("/api/bookmarks", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao criar bookmark")
    }

    return response.json()
  }

  async updateBookmark(id: string, data: CreateBookmarkData): Promise<Bookmark> {
    const response = await fetch(`/api/bookmarks/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao atualizar bookmark")
    }

    return response.json()
  }

  async deleteBookmark(id: string): Promise<void> {
    const response = await fetch(`/api/bookmarks/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao excluir bookmark")
    }
  }
}

export const bookmarkAPI = new BookmarkAPI()
