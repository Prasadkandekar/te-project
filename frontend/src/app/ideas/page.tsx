'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { fetchIdeas, createIdea } from '@/redux/slices/ideasSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb, 
  Plus, 
  MessageSquare, 
  TrendingUp,
  Filter,
  Search
} from 'lucide-react'
import { formatRelativeTime, IDEA_CATEGORIES, IDEA_STAGES } from '@/lib/utils'
import { Sidebar } from '@/components/sidebar'
import toast from 'react-hot-toast'

export default function IdeasPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { ideas, loading, pagination } = useSelector((state: RootState) => state.ideas)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    stage: '',
    search: ''
  })

  useEffect(() => {
    dispatch(fetchIdeas(filters))
  }, [dispatch, filters])

  const handleCreateIdea = async (formData: any) => {
    try {
      await dispatch(createIdea(formData)).unwrap()
      toast.success('Idea submitted successfully!')
      setShowCreateModal(false)
    } catch (error: any) {
      toast.error(error || 'Failed to submit idea')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view ideas</h1>
        </div>
      </div>
    )
  }

  return (
    <Sidebar>
      <div className="bg-gray-50 dark:bg-business-900 min-h-full">
        {/* Header */}
        <div className="bg-white dark:bg-business-800 border-b border-gray-200 dark:border-business-700 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Startup Ideas
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                  Share your ideas and get valuable feedback from the community
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-navy-600 hover:bg-navy-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit Idea
              </Button>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-72 space-y-6">
            <Card className="bg-white dark:bg-business-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                  <Filter className="w-5 h-5 mr-3" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Search</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search ideas..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-business-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent dark:bg-business-700 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                  >
                    <option value="">All Categories</option>
                    {IDEA_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Stage Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Stage</label>
                  <select
                    value={filters.stage}
                    onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                    className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                  >
                    <option value="">All Stages</option>
                    {IDEA_STAGES.map(stage => (
                      <option key={stage.value} value={stage.value}>{stage.label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ideas Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-business-200 dark:bg-business-700 rounded w-3/4"></div>
                      <div className="h-3 bg-business-200 dark:bg-business-700 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-business-200 dark:bg-business-700 rounded"></div>
                        <div className="h-3 bg-business-200 dark:bg-business-700 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : ideas.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Lightbulb className="w-16 h-16 mx-auto text-business-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
                  <p className="text-business-600 dark:text-business-300 mb-4">
                    Be the first to share your startup idea with the community!
                  </p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-navy-600 hover:bg-navy-700"
                  >
                    Submit Your Idea
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
                          <CardDescription className="mt-1">
                            by {idea.user.name} • {formatRelativeTime(idea.createdAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary">{idea.category}</Badge>
                        <Badge variant="outline">{idea.stage}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-business-600 dark:text-business-300 line-clamp-3 mb-4">
                        {idea.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-business-500 dark:text-business-400">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {idea._count.feedbacks} feedback
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          View Details
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => {
                      // Handle previous page
                    }}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => {
                      // Handle next page
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Create Idea Modal */}
        {showCreateModal && (
          <CreateIdeaModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateIdea}
          />
        )}
      </div>
    </Sidebar>
  )
}

// Create Idea Modal Component
function CreateIdeaModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetMarket: '',
    challenges: '',
    stage: 'CONCEPT'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Submit Your Startup Idea</CardTitle>
          <CardDescription>
            Share your idea with the community and get valuable feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                  required
                >
                  <option value="">Select Category</option>
                  {IDEA_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                  className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                >
                  {IDEA_STAGES.map(stage => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Market</label>
              <input
                type="text"
                value={formData.targetMarket}
                onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                placeholder="Who is your target audience?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Challenges</label>
              <textarea
                value={formData.challenges}
                onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                placeholder="What challenges do you foresee?"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-navy-600 hover:bg-navy-700">
                Submit Idea
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
