"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se há token válido no localStorage ao carregar
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("bookmark-token")

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Token inválido, remover do localStorage
          localStorage.removeItem("bookmark-token")
          localStorage.removeItem("bookmark-user")
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error)
        localStorage.removeItem("bookmark-token")
        localStorage.removeItem("bookmark-user")
      }

      setIsLoading(false)
    }

    verifyToken()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem("bookmark-token", data.token)
        localStorage.setItem("bookmark-user", JSON.stringify(data.user))
        return { success: true }
      } else {
        return { success: false, error: data.error || "Erro ao fazer login" }
      }
    } catch (error) {
      console.error("Erro no login:", error)
      return { success: false, error: "Erro de conexão. Tente novamente." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bookmark-token")
    localStorage.removeItem("bookmark-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
