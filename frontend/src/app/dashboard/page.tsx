'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { 
  Lightbulb, 
  Users, 
  BookOpen, 
  Plus,
  TrendingUp,
  MessageSquare,
  Download
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the dashboard</h1>
        </div>
      </div>
    )
  }

  return (
    <Sidebar>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-700 dark:text-lightTeal-300 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-navy-600 dark:text-lightTeal-400 text-lg">
            Here's what's happening with your startup journey today.
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-lightTeal-300">My Ideas</CardTitle>
              <div className="w-8 h-8 bg-navy-100 dark:bg-navy-900 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-navy-600 dark:text-navy-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-navy-700 dark:text-lightTeal-300">11</div>
              <p className="text-xs text-navy-500 dark:text-lightTeal-500 mt-1">
                +11 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-lightTeal-300">Connections</CardTitle>
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-navy-700 dark:text-lightTeal-300">7</div>
              <p className="text-xs text-navy-500 dark:text-lightTeal-500 mt-1">
                +5 new this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-lightTeal-300">Feedback Received</CardTitle>
              <div className="w-8 h-8 bg-charcoal-100 dark:bg-charcoal-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-charcoal-600 dark:text-charcoal-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-navy-700 dark:text-lightTeal-300">3</div>
              <p className="text-xs text-navy-500 dark:text-lightTeal-500 mt-1">
                +2 this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy-600 dark:text-lightTeal-300">Resources Downloaded</CardTitle>
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                <Download className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-navy-700 dark:text-lightTeal-300">0</div>
              <p className="text-xs text-navy-500 dark:text-lightTeal-500 mt-1">
                +0 this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg hover:shadow-xl transition-all group">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-navy-700 dark:text-lightTeal-300">Share Your Idea</CardTitle>
              <CardDescription className="text-navy-600 dark:text-lightTeal-400 leading-relaxed">
                Submit your startup idea and get valuable feedback from the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-teal-500 hover:bg-navy-600 text-white shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Submit Idea
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg hover:shadow-xl transition-all group">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-navy-700 dark:text-lightTeal-300">Find Connections</CardTitle>
              <CardDescription className="text-navy-600 dark:text-lightTeal-400 leading-relaxed">
                Connect with mentors and potential co-founders in your industry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300">
                Browse Community
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg hover:shadow-xl transition-all group">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-charcoal-600 to-charcoal-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-navy-700 dark:text-lightTeal-300">Startup Toolkit</CardTitle>
              <CardDescription className="text-navy-600 dark:text-lightTeal-400 leading-relaxed">
                Access templates, guides, and resources to help build your startup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-2 border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 hover:border-charcoal-300">
                Explore Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-navy-700 dark:text-lightTeal-300">Recent Activity</CardTitle>
            <CardDescription className="text-navy-600 dark:text-lightTeal-400">
              Your latest interactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-navy-500 dark:text-lightTeal-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet.</p>
              <p className="text-sm">Start by submitting your first idea or connecting with mentors!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  )
}
