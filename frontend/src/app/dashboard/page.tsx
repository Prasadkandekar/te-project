'use client'

import { useEffect, useState } from 'react'
import { useAuthGuard } from '@/lib/useAuthGuard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2,
  TrendingUp,
  Rocket,
  Target,
  ArrowRight,
  Sparkles,
  BarChart3,
  MapPin,
  Clock,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { dashboardAPI } from '@/lib/api'

interface IdeaWithData {
  id: string
  title: string
  description: string
  category: string
  stage: string
  createdAt: string
  validationScore?: number
  roadmapProgress?: number
  hasCaseStudy?: boolean
}

interface DashboardStats {
  totalIdeas: number
  validatedIdeas: number
  activeRoadmaps: number
  caseStudies: number
  avgScore: number
}

export default function DashboardPage() {
  const { user } = useAuthGuard()
  const [enrichedIdeas, setEnrichedIdeas] = useState<IdeaWithData[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalIdeas: 0,
    validatedIdeas: 0,
    activeRoadmaps: 0,
    caseStudies: 0,
    avgScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      setLoading(true)
      setFetchError(null)

      try {
        const response = await dashboardAPI.getDashboardData()
        const { ideas, stats: dashboardStats } = response.data.data
        
        setEnrichedIdeas(ideas)
        setStats(dashboardStats)
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error)
        setFetchError('Unable to load dashboard data. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the home page</h1>
        </div>
      </div>
    )
  }

  // Filter ideas with actual data
  const validatedIdeas = enrichedIdeas.filter((idea) => idea.validationScore !== undefined).slice(0, 3)
  const recentRoadmaps = enrichedIdeas.filter((idea) => idea.roadmapProgress !== undefined).slice(0, 2)
  const recentCaseStudies = enrichedIdeas.filter((idea) => idea.hasCaseStudy).slice(0, 2)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                Your startup journey at a glance
              </p>
            </div>
            <Link href="/validate-idea">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                <Sparkles className="w-5 h-5 mr-2" />
                Validate New Idea
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-indigo-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-400 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.validatedIdeas}</div>
                  <div className="text-sm text-indigo-100">Ideas Validated</div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-400 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.activeRoadmaps}</div>
                  <div className="text-sm text-indigo-100">Active Roadmaps</div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-400 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.caseStudies}</div>
                  <div className="text-sm text-indigo-100">Case Studies</div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-400 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.avgScore}%</div>
                  <div className="text-sm text-indigo-100">Avg Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fetchError && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">{fetchError}</p>
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Validated Ideas Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-navy-700 dark:text-lightTeal-300 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  Recently Validated Ideas
                </h2>
                <Link href="/validate-idea">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {loading ? (
                <Card className="animate-pulse">
                  <CardContent className="h-40" />
                </Card>
              ) : validatedIdeas.length > 0 ? (
                <div className="space-y-4">
                  {validatedIdeas.map((idea) => (
                    <Card key={idea.id} className="bg-white dark:bg-navy-800 border-0 shadow-md hover:shadow-xl transition-all group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-navy-700 dark:text-lightTeal-300 group-hover:text-indigo-600 transition-colors">
                                {idea.title}
                              </h3>
                              <Badge className="bg-indigo-100 text-indigo-700 border-0">
                                {idea.category}
                              </Badge>
                            </div>
                            <p className="text-navy-600 dark:text-lightTeal-400 line-clamp-2 mb-3">
                              {idea.description}
                            </p>
                          </div>
                          <div className="ml-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {idea.validationScore || 0}
                            </div>
                            <p className="text-xs text-navy-500 dark:text-lightTeal-500 mt-1">Score</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-navy-500 dark:text-lightTeal-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {idea.stage}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/validate-idea?ideaId=${idea.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              View Validation
                            </Button>
                          </Link>
                          <Link href={`/roadmap?ideaId=${idea.id}`} className="flex-1">
                            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                              View Roadmap
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-navy-800 border-0 shadow-md">
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-navy-300 dark:text-navy-600" />
                    <h3 className="text-lg font-semibold text-navy-700 dark:text-lightTeal-300 mb-2">
                      No validated ideas yet
                    </h3>
                    <p className="text-navy-600 dark:text-lightTeal-400 mb-4">
                      Start your journey by validating your first startup idea
                    </p>
                    <Link href="/validate-idea">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Validate Your First Idea
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Roadmaps Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-navy-700 dark:text-lightTeal-300 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  Active Roadmaps
                </h2>
                <Link href="/roadmap">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {recentRoadmaps.length > 0 ? (
                <div className="space-y-4">
                  {recentRoadmaps.map((idea) => (
                    <Card key={idea.id} className="bg-white dark:bg-navy-800 border-0 shadow-md hover:shadow-xl transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-navy-700 dark:text-lightTeal-300 mb-1">
                              {idea.title} Roadmap
                            </h3>
                            <p className="text-sm text-navy-600 dark:text-lightTeal-400">
                              12-week execution plan
                            </p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-700 border-0">
                            {idea.roadmapProgress === 100 ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-navy-600 dark:text-lightTeal-400">Progress</span>
                            <span className="font-semibold text-navy-700 dark:text-lightTeal-300">
                              {idea.roadmapProgress || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-navy-700 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${idea.roadmapProgress || 0}%` }}
                            />
                          </div>
                        </div>

                        <Link href={`/roadmap?ideaId=${idea.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Continue Roadmap
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-navy-800 border-0 shadow-md">
                  <CardContent className="py-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-navy-300 dark:text-navy-600" />
                    <p className="text-navy-600 dark:text-lightTeal-400 text-sm">
                      No roadmaps yet. Generate one after validating an idea.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-indigo-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <Rocket className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Ready to Launch?</h3>
                <p className="text-indigo-100 mb-4 text-sm">
                  Get your idea validated and create a roadmap to success
                </p>
                <Link href="/validate-idea">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">
                    Start Validation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Case Studies */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-navy-700 dark:text-lightTeal-300 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Case Studies
                </h3>
                <Link href="/case-studies">
                  <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 text-xs">
                    View All
                  </Button>
                </Link>
              </div>

              {recentCaseStudies.length > 0 ? (
                <div className="space-y-3">
                  {recentCaseStudies.map((idea) => (
                    <Card key={idea.id} className="bg-white dark:bg-navy-800 border-0 shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-navy-700 dark:text-lightTeal-300 mb-2 text-sm">
                          {idea.title} Competitors
                        </h4>
                        <p className="text-xs text-navy-600 dark:text-lightTeal-400 mb-3">
                          Learn from successful companies in your space
                        </p>
                        <Link href={`/case-studies?ideaId=${idea.id}`}>
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            View Analysis
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-navy-800 border-0 shadow-sm">
                  <CardContent className="py-6 text-center">
                    <TrendingUp className="w-10 h-10 mx-auto mb-2 text-navy-300 dark:text-navy-600" />
                    <p className="text-navy-600 dark:text-lightTeal-400 text-xs">
                      No case studies yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tips Card */}
            <Card className="bg-white dark:bg-navy-800 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-navy-700 dark:text-lightTeal-300">Pro Tip</h3>
                </div>
                <p className="text-sm text-navy-600 dark:text-lightTeal-400">
                  Validate your idea before building. Our AI analyzes market demand, competition, and feasibility to give you actionable insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
