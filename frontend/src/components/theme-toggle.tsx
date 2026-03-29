"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  className?: string
  asNavItem?: boolean
}

export function ThemeToggle({ className, asNavItem = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Wrap theme changes with error handling for localStorage
  const handleThemeChange = (newTheme: string) => {
    try {
      setTheme(newTheme)
    } catch (error) {
      console.warn('Unable to persist theme preference:', error)
      // Theme will still change in-memory via next-themes
      // but won't persist across sessions if localStorage fails
    }
  }

  if (!mounted) {
    if (asNavItem) {
      return (
        <div className={className}>
          <Sun className="w-5 h-5" />
        </div>
      )
    }
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  if (asNavItem) {
    // Handle keyboard navigation (Enter and Space keys)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleThemeChange(theme === "light" ? "dark" : "light")
      }
    }

    return (
      <button
        onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
        onKeyDown={handleKeyDown}
        aria-label="Toggle theme"
        tabIndex={0}
        className={`${className} focus:outline-none focus:ring-2 focus:ring-lightTeal-500 focus:ring-offset-2 focus:ring-offset-navy-900 dark:focus:ring-offset-navy-800`}
      >
        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="text-xs font-medium">Theme</span>
      </button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
      className="text-foreground hover:bg-muted"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
