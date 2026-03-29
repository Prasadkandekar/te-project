'use client'

import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import { RootState } from '@/redux/store'

export function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const pathname = usePathname()

  // Check if we're on a public page (landing page or auth pages)
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth')

  // Apply different padding based on authentication and page type
  const paddingClasses = isAuthenticated && !isPublicPage
    ? 'min-h-screen pt-20 pb-24 px-8 md:px-16 lg:px-24'
    : 'min-h-screen'

  return (
    <div className={paddingClasses}>
      {children}
    </div>
  )
}
