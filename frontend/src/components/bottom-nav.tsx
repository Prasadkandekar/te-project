"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { Home, CheckCircle, Map, BookOpen, Shield, User } from "lucide-react"
import { LucideIcon } from "lucide-react"
import { RootState } from "@/redux/store"

// TypeScript interfaces
interface NavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick?: () => void
}

interface BottomNavProps {
  // No props needed - component reads from Redux state and Next.js router
}

// Navigation configuration
interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  ariaLabel: string
}

const navigationConfig: NavigationItem[] = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: Home,
    ariaLabel: 'Navigate to home page'
  },
  {
    name: 'Validate Idea',
    href: '/validate-idea',
    icon: CheckCircle,
    ariaLabel: 'Navigate to idea validation'
  },
  {
    name: 'Roadmap',
    href: '/roadmap',
    icon: Map,
    ariaLabel: 'Navigate to roadmap'
  },
  {
    name: 'Case Studies',
    href: '/case-studies',
    icon: BookOpen,
    ariaLabel: 'Navigate to case studies'
  },
  {
    name: 'Register',
    href: '/startup-register',
    icon: Shield,
    ariaLabel: 'Navigate to startup registration'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    ariaLabel: 'Navigate to profile'
  }
]

// NavItem sub-component
const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive, onClick }) => {
  // Handle keyboard navigation (Enter and Space keys)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      tabIndex={0}
      style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-lightTeal-500 focus:ring-offset-2 focus:ring-offset-navy-900 dark:focus:ring-offset-navy-800 ${
        isActive 
          ? 'bg-white dark:bg-lightTeal-200 text-navy-900 dark:text-navy-800 scale-105' 
          : 'text-lightTeal-300 dark:text-lightTeal-400 hover:bg-navy-700/50 hover:scale-[1.02] transition duration-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

// Main BottomNav component
export function BottomNav({}: BottomNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  // Conditional rendering based on authentication (Requirement 1.6)
  // Return null if user is not authenticated to prevent nav bar from rendering on public pages
  if (!isAuthenticated) {
    return null
  }

  // Handle navigation item click
  const handleNavClick = (href: string) => {
    router.push(href)
  }

  return (
    <nav 
      role="navigation" 
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 animate-slide-up"
    >
      <div className="bg-navy-900 dark:bg-navy-800 rounded-full shadow-2xl px-6 py-3 flex items-center gap-2 md:gap-4 max-w-2xl w-full">
        {navigationConfig.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.name}
            isActive={pathname === item.href}
            onClick={() => handleNavClick(item.href)}
          />
        ))}
      </div>
    </nav>
  )
}
