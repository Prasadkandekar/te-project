'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { loginUser } from '@/redux/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await dispatch(loginUser({ email, password })).unwrap()
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error in component:', error)
      toast.error(error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/health')
      const data = await response.json()
      console.log('API Test:', data)
      toast.success('API is reachable!')
    } catch (error) {
      console.error('API Test Error:', error)
      toast.error('API is not reachable!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">SL</span>
          </div> */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-navy-700 bg-clip-text text-transparent">
            StartupLaunch
          </h1>
        </div>

        <Card className="bg-white dark:bg-navy-800 border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
              Sign in to your StartupLaunch account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
{/*               
              <Button 
                type="button"
                onClick={testAPI}
                variant="outline"
                className="w-full mt-2"
              >
                Test API Connection
              </Button> */}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-navy-600 hover:text-navy-700 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
