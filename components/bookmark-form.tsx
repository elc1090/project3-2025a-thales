"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Save, Plus, AlertCircle } from "lucide-react"

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

interface BookmarkFormProps {
  onSubmit: (data: { title: string; description: string; url: string }) => Promise<void>
  onCancel: () => void
  initialData?: Bookmark | null
  isEditing?: boolean
}

export function BookmarkForm({ onSubmit, onCancel, initialData, isEditing = false }: BookmarkFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    url: initialData?.url || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL é obrigatória"
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = "URL deve ser válida (ex: https://exemplo.com)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setApiError("")

    try {
      await onSubmit(formData)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Erro ao salvar bookmark")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Limpar erro da API
    if (apiError) {
      setApiError("")
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Editar Bookmark" : "Adicionar Novo Bookmark"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* API Error */}
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {/* Título */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Título *
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Ex: React Documentation"
            className={`mt-1 ${errors.title ? "border-red-500 focus:border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* URL */}
        <div>
          <Label htmlFor="url" className="text-sm font-medium text-gray-700">
            URL *
          </Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            placeholder="https://exemplo.com"
            className={`mt-1 ${errors.url ? "border-red-500 focus:border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
        </div>

        {/* Descrição */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Descrição *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Descreva brevemente o conteúdo do link..."
            rows={3}
            className={`mt-1 resize-none ${errors.description ? "border-red-500 focus:border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditing ? "Salvando..." : "Adicionando..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isEditing ? "Salvar Alterações" : "Adicionar Bookmark"}
              </div>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="px-6">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
