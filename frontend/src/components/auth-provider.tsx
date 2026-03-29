'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getCurrentUser } from '@/redux/slices/authSlice'
import { isAuthenticated } from '@/lib/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated: reduxAuth } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Refresh user data from API if we have a token, but don't block on it
    if (isAuthenticated() || reduxAuth) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, reduxAuth])

  return <>{children}</>
}
