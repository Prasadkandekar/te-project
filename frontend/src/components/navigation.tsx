'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { RootState, AppDispatch } from '@/redux/store'
import { logoutUser } from '@/redux/slices/authSlice'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Home,
  Lightbulb, 
  Users, 
  BookOpen, 
  Calendar,
  BarChart2Icon,
  Bell,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Ideas', href: '/ideas', icon: Lightbulb },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Mentorship', href: '/mentorship', icon: Calendar },
  { name: 'Pitches', href: '/pitches', icon: BarChart2Icon },
  { name: 'Toolkit', href: '/toolkit', icon: BookOpen },
]

export function Navigation() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.notifications)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-navy-600 to-navy-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-navy-600 to-navy-500 bg-clip-text text-transparent">
              StartupLaunch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-lightTeal-200 text-navy-700 dark:bg-navy-800 dark:text-lightTeal-300'
                      : 'text-navy-700 hover:text-navy-900 hover:bg-lightTeal-100 dark:text-lightTeal-400 dark:hover:text-white dark:hover:bg-navy-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-700 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            <ThemeToggle />

            {/* User Menu */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-200 dark:bg-navy-800 rounded-full flex items-center justify-center">
                  <span className="text-navy-700 dark:text-lightTeal-300 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-navy-700 dark:text-lightTeal-300">
                  {user?.name}
                </span>
              </Button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-lightTeal-300 dark:border-navy-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-lightTeal-300 dark:border-navy-700">
                    <p className="text-sm font-medium text-navy-800 dark:text-lightTeal-200">{user?.name}</p>
                    <p className="text-xs text-navy-600 dark:text-lightTeal-400">{user?.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-navy-700 dark:text-lightTeal-300 hover:bg-lightTeal-100 dark:hover:bg-navy-700 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-coral-700 dark:text-coral-400 hover:bg-lightTeal-100 dark:hover:bg-navy-700 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-lightTeal-300 dark:border-navy-700">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-lightTeal-200 text-navy-700 dark:bg-navy-800 dark:text-lightTeal-300'
                        : 'text-navy-700 hover:text-navy-900 hover:bg-lightTeal-100 dark:text-lightTeal-400 dark:hover:text-white dark:hover:bg-navy-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
