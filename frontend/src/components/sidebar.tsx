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
  Presentation,
  // CheckCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Ideas', href: '/ideas', icon: Lightbulb },
  // { name: 'Validate Idea', href: '/validate-idea', icon: CheckCircle },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Mentorship', href: '/mentorship', icon: Calendar },
  { name: 'Pitches', href: '/pitches', icon: Presentation },
  { name: 'Toolkit', href: '/toolkit', icon: BookOpen },
]

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.notifications)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-navy-900">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white dark:bg-navy-800 border-r border-gray-200 dark:border-navy-700 shadow-lg
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-navy-700">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-navy-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-navy-600 to-navy-700 bg-clip-text text-transparent">
                StartupLaunch
              </span>
            </Link>
          )}
          
          {/* Collapse button - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          {/* Close button - mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all group
                  ${isActive
                    ? 'bg-lightTeal-200 text-navy-700 dark:bg-navy-800 dark:text-lightTeal-300'
                    : 'text-navy-700 hover:text-navy-900 hover:bg-lightTeal-100 dark:text-lightTeal-400 dark:hover:text-white dark:hover:bg-navy-700'
                  }
                `}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-16 bg-navy-700 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-lightTeal-300 dark:border-navy-700 p-4 space-y-2">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            className={`w-full justify-start relative ${collapsed ? 'px-3' : ''}`}
          >
            <Bell className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
            {!collapsed && <span>Notifications</span>}
            {unreadCount > 0 && (
              <span className={`
                absolute bg-coral-700 text-white text-xs rounded-full flex items-center justify-center
                ${collapsed ? 'w-4 h-4 -top-1 -right-1' : 'w-5 h-5 ml-auto'}
              `}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* Theme Toggle */}
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-start'}`}>
            <ThemeToggle />
            {!collapsed && <span className="ml-3 text-sm text-navy-700 dark:text-lightTeal-300">Theme</span>}
          </div>

          {/* User Menu */}
          <div className="pt-2">
            {!collapsed ? (
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-lightTeal-100 dark:bg-navy-700">
                <div className="w-8 h-8 bg-teal-200 dark:bg-navy-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-navy-700 dark:text-lightTeal-300 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 dark:text-lightTeal-200 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-navy-600 dark:text-lightTeal-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-teal-200 dark:bg-navy-800 rounded-full flex items-center justify-center">
                  <span className="text-navy-700 dark:text-lightTeal-300 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="mt-2 space-y-1">
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-navy-700 dark:text-lightTeal-300 ${collapsed ? 'px-3' : ''}`}
              >
                <User className={`w-4 h-4 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!collapsed && <span>Profile</span>}
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className={`w-full justify-start text-coral-700 dark:text-coral-500 ${collapsed ? 'px-3' : ''}`}
              >
                <LogOut className={`w-4 h-4 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!collapsed && <span>Sign out</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-navy-800 border-b border-lightTeal-200 dark:border-navy-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-navy-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SL</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-teal-500 to-navy-700 bg-clip-text text-transparent">
                StartupLaunch
              </span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
