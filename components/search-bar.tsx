"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  placeholder?: string
}

export function SearchBar({ searchTerm, onSearchChange, placeholder = "Buscar..." }: SearchBarProps) {
  const clearSearch = () => {
    onSearchChange("")
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
      {searchTerm && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Button variant="ghost" size="sm" onClick={clearSearch} className="h-6 w-6 p-0 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      )}
    </div>
  )
}
