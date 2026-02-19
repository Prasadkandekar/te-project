'use client'

import { Provider } from 'react-redux'
import { ThemeProvider } from 'next-themes'
import { store } from '@/redux/store'
import { AuthProvider } from '@/components/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
}
