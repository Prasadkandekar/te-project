'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { getCurrentUser, setUser } from '@/redux/slices/authSlice'
import { getUserFromStorage, isAuthenticated } from '@/lib/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Check if user is authenticated and get user data
    if (isAuthenticated()) {
      // First, try to get user from localStorage for immediate UI update
      const storedUser = getUserFromStorage()
      if (storedUser) {
        dispatch(setUser(storedUser))
      }
      
      // Then fetch fresh user data from API
      dispatch(getCurrentUser())
    }
  }, [dispatch])

  return <>{children}</>
}
