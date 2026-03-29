'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { RootState, AppDispatch } from '@/redux/store'
import { logoutUser } from '@/redux/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Settings, HelpCircle, LogOut } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ThemeToggle } from './theme-toggle'

// Map routes to display names
const routeNames: Record<string, string> = {
  '/dashboard': 'Home',
  '/validate-idea': 'Validate Idea',
  '/roadmap': 'Roadmap',
  '/case-studies': 'Case Studies',
  '/startup-register': 'Startup Registration',
  '/profile': 'Profile',
  '/ideas': 'Ideas',
  '/community': 'Community',
  '/mentorship': 'Mentorship',
  '/pitches': 'Pitches',
  '/toolkit': 'Toolkit',
}

export function TopNav() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const pathname = usePathname()
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logged out successfully')
      router.push('/')
      setShowLogoutConfirm(false)
      setShowSettingsMenu(false)
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Get current page name
  const currentPageName = routeNames[pathname] || 'StartupLaunch'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700 shadow-sm">
        <div className="px-8 md:px-16 lg:px-24">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo/Brand */}
            <Link href="/dashboard" className="flex items-center space-x-3">
              <img 
                src="/logo/startup-launch-logo.png" 
                alt="StartupLaunch Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-navy-600 to-navy-700 dark:from-lightTeal-300 dark:to-lightTeal-400 bg-clip-text text-transparent">
                StartupLaunch
              </span>
            </Link>

            {/* Center: Current Page Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-navy-700 dark:text-lightTeal-300">
                {currentPageName}
              </h1>
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* How it Works */}
              <Button
                variant="ghost"
                size="icon"
                className="text-navy-700 dark:text-lightTeal-300 hover:bg-lightTeal-100 dark:hover:bg-navy-700"
                aria-label="How it works"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>

              {/* Settings with Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="text-navy-700 dark:text-lightTeal-300 hover:bg-lightTeal-100 dark:hover:bg-navy-700"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>

                {/* Settings Dropdown */}
                {showSettingsMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowSettingsMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-gray-200 dark:border-navy-700 z-50">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowLogoutConfirm(true)
                            setShowSettingsMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-navy-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-navy-700 dark:text-lightTeal-300 mb-4">
              Confirm Logout
            </h3>
            <p className="text-navy-600 dark:text-lightTeal-400 mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
