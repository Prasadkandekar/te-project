'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { fetchResources, downloadResource } from '@/redux/slices/resourcesSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import { 
  BookOpen, 
  Download, 
  FileText, 
  Filter,
  Search,
  Star,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const resourceCategories = [
  'PITCH_DECK',
  'NDA',
  'BMC',
  'LEGAL',
  'MARKETING',
  'FINANCIAL',
  'TECHNICAL',
  'OTHER'
]

const categoryLabels: Record<string, string> = {
  'PITCH_DECK': 'Pitch Decks',
  'NDA': 'NDAs',
  'BMC': 'Business Model Canvas',
  'LEGAL': 'Legal Documents',
  'MARKETING': 'Marketing',
  'FINANCIAL': 'Financial',
  'TECHNICAL': 'Technical',
  'OTHER': 'Other'
}

export default function ToolkitPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { resources, loading, pagination } = useSelector((state: RootState) => state.resources)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  })

  useEffect(() => {
    dispatch(fetchResources(filters))
  }, [dispatch, filters])

  const handleDownload = async (resourceId: string, title: string) => {
    try {
      await dispatch(downloadResource(resourceId)).unwrap()
      toast.success(`Downloaded ${title}`)
    } catch (error: any) {
      toast.error(error || 'Failed to download resource')
    }
  }

  if (!user) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to access the toolkit</h1>
          </div>
        </div>
      </Sidebar>
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
                  Startup Toolkit
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                  Essential templates, documents, and resources for your startup journey
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {pagination?.totalCount || 0} resources
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-72 space-y-6">
              <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-navy-700 dark:text-lightTeal-300">
                    <Filter className="w-5 h-5 mr-3" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 dark:text-lightTeal-300 mb-3">Search</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search resources..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border border-lightTeal-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 dark:text-lightTeal-300 mb-3">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-lightTeal-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                    >
                      <option value="">All Categories</option>
                      {resourceCategories.map(category => (
                        <option key={category} value={category}>
                          {categoryLabels[category]}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Categories */}
              <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-navy-700 dark:text-lightTeal-300">
                    Popular Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['PITCH_DECK', 'NDA', 'BMC', 'LEGAL'].map(category => (
                    <button
                      key={category}
                      onClick={() => setFilters(prev => ({ ...prev, category }))}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-navy-600 dark:text-lightTeal-400 hover:bg-lightTeal-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      {categoryLabels[category]}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Resources Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse bg-white dark:bg-business-800 border-0 shadow-lg">
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
              ) : resources.length === 0 ? (
                <Card className="text-center py-12 bg-white dark:bg-business-800 border-0 shadow-lg">
                  <CardContent>
                    <BookOpen className="w-16 h-16 mx-auto text-business-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                    <p className="text-business-600 dark:text-business-300 mb-4">
                      Try adjusting your filters to find more resources.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource) => (
                    <Card key={resource.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-business-800">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2 group-hover:text-navy-600 transition-colors">
                              {resource.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              by {resource.uploader.name} • {formatRelativeTime(resource.createdAt)}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary">{categoryLabels[resource.category]}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {resource.description && (
                          <p className="text-business-600 dark:text-business-300 line-clamp-3 mb-4">
                            {resource.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-business-500 dark:text-business-400 mb-4">
                          <div className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {resource.downloads} downloads
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-teal-500" />
                            4.8
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleDownload(resource.id, resource.title)}
                            className="flex-1 bg-navy-600 hover:bg-navy-700 text-white"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-3"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
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
      </div>
    </Sidebar>
  )
}
