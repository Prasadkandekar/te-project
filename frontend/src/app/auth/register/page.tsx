'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { registerUser, googleLogin } from '@/redux/slices/authSlice'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ENTREPRENEUR' as 'ENTREPRENEUR' | 'MENTOR'
  })
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await dispatch(registerUser(formData)).unwrap()
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    try {
      await dispatch(googleLogin({ credential: credentialResponse.credential, role: formData.role })).unwrap()
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error || 'Google sign-up failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-navy-700 bg-clip-text text-transparent">
            StartupLaunch
          </h1>
        </div>

        <Card className="bg-white dark:bg-navy-800 border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Join StartupLaunch</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {/* Role selector shown above Google button so it applies to Google sign-up too */}
            <div className="mb-4">
              <label htmlFor="role-google" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                I am a...
              </label>
              <select
                id="role-google"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
              >
                <option value="ENTREPRENEUR">Entrepreneur</option>
                <option value="MENTOR">Mentor</option>
              </select>
            </div>

            {/* Google Sign Up */}
            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google sign-up failed')}
                width="368"
                text="signup_with"
                shape="rectangular"
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-navy-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-navy-800 text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                  placeholder="Enter your full name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                  placeholder="Enter your email" required />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input id="password" name="password" type="password" value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                  placeholder="Create a password" required />
              </div>
              <Button type="submit"
                className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all mt-6"
                disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-navy-600 hover:text-navy-700 font-semibold">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
