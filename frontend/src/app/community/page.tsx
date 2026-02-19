'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { fetchUsers, createConnection } from '@/redux/slices/connectionsSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  MapPin, 
  Briefcase, 
  Filter,
  Search,
  UserPlus,
  Clock,
  CheckCircle
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { Sidebar } from '@/components/sidebar'
import toast from 'react-hot-toast'

export default function CommunityPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, pagination } = useSelector((state: RootState) => state.connections)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [filters, setFilters] = useState({
    role: '',
    skills: '',
    location: '',
    search: ''
  })

  useEffect(() => {
    dispatch(fetchUsers(filters))
  }, [dispatch, filters])

  const handleConnect = async (receiverId: string) => {
    try {
      await dispatch(createConnection({ receiverId })).unwrap()
      toast.success('Connection request sent!')
    } catch (error: any) {
      toast.error(error || 'Failed to send connection request')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view the community</h1>
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
                  Community
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                  Connect with mentors and potential co-founders
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Users className="w-4 h-4 mr-1" />
                  {pagination?.totalCount || 0} members
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-business-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                  >
                    <option value="">All Roles</option>
                    <option value="MENTOR">Mentors</option>
                    <option value="ENTREPRENEUR">Entrepreneurs</option>
                  </select>
                </div>

                {/* Skills Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Skills</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Marketing"
                    value={filters.skills}
                    onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                  />
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City or Country"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-business-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 dark:border-business-600 dark:bg-business-800"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Members Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-lightTeal-200 dark:bg-navy-700 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-lightTeal-200 dark:bg-navy-700 rounded w-3/4"></div>
                          <div className="h-3 bg-lightTeal-200 dark:bg-navy-700 rounded w-1/2 mt-2"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-lightTeal-200 dark:bg-navy-700 rounded"></div>
                        <div className="h-3 bg-lightTeal-200 dark:bg-navy-700 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : users.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-16 h-16 mx-auto text-teal-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-navy-700 dark:text-lightTeal-300">No members found</h3>
                  <p className="text-navy-600 dark:text-lightTeal-400 mb-4">
                    Try adjusting your filters to find more community members.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-navy-100 dark:bg-navy-900 rounded-full flex items-center justify-center">
                            <span className="text-navy-600 dark:text-navy-400 font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{member.name}</CardTitle>
                            <CardDescription className="flex items-center">
                              <Briefcase className="w-3 h-3 mr-1" />
                              {member.role}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant={member.role === 'MENTOR' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {member.role}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {member.bio && (
                        <p className="text-business-600 dark:text-business-300 text-sm mb-3 line-clamp-2">
                          {member.bio}
                        </p>
                      )}
                      
                      {member.location && (
                        <div className="flex items-center text-sm text-business-500 dark:text-business-400 mb-3">
                          <MapPin className="w-3 h-3 mr-1" />
                          {member.location}
                        </div>
                      )}

                      {member.skills && member.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {member.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-business-500 dark:text-business-400">
                          Joined {formatRelativeTime(member.createdAt)}
                        </span>
                        
                        {member.connectionStatus === null ? (
                          <Button
                            size="sm"
                            onClick={() => handleConnect(member.id)}
                            className="bg-navy-600 hover:bg-navy-700 text-white"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Connect
                          </Button>
                        ) : member.connectionStatus === 'PENDING' ? (
                          <Button size="sm" variant="outline" disabled>
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Button>
                        ) : member.connectionStatus === 'ACCEPTED' ? (
                          <Button size="sm" variant="outline" disabled>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Button>
                        ) : null}
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
