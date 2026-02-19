'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { fetchBookings, createBooking } from '@/redux/slices/bookingsSlice'
import { fetchUsers } from '@/redux/slices/connectionsSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Star,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { formatRelativeTime, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function MentorshipPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { bookings, loading } = useSelector((state: RootState) => state.bookings)
  const { users } = useSelector((state: RootState) => state.connections)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [activeTab, setActiveTab] = useState<'sessions' | 'mentors'>('sessions')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchBookings({}))
    dispatch(fetchUsers({ role: 'MENTOR' }))
  }, [dispatch])

  const handleBookSession = (mentor: any) => {
    setSelectedMentor(mentor)
    setShowBookingModal(true)
  }

  const handleCreateBooking = async (bookingData: any) => {
    try {
      await dispatch(createBooking(bookingData)).unwrap()
      toast.success('Booking request sent successfully!')
      setShowBookingModal(false)
      setSelectedMentor(null)
    } catch (error: any) {
      toast.error(error || 'Failed to create booking')
    }
  }

  if (!user) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to access mentorship</h1>
          </div>
        </div>
      </Sidebar>
    )
  }

  const mentors = users.filter(u => u.role === 'MENTOR')

  return (
    <Sidebar>
      <div className="bg-gray-50 dark:bg-business-900 min-h-full">
        {/* Header */}
        <div className="bg-white dark:bg-business-800 border-b border-gray-200 dark:border-business-700 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Mentorship
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                  Connect with experienced mentors and schedule 1:1 sessions
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant={activeTab === 'sessions' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('sessions')}
                  className={activeTab === 'sessions' ? 'bg-navy-600 hover:bg-navy-700' : ''}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  My Sessions
                </Button>
                <Button
                  variant={activeTab === 'mentors' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('mentors')}
                  className={activeTab === 'mentors' ? 'bg-navy-600 hover:bg-navy-700' : ''}
                >
                  <User className="w-4 h-4 mr-2" />
                  Find Mentors
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {activeTab === 'sessions' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Sessions</h2>
              </div>

              {loading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse bg-white dark:bg-business-800 border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-business-200 dark:bg-business-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-business-200 dark:bg-business-700 rounded w-1/3"></div>
                            <div className="h-3 bg-business-200 dark:bg-business-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <Card className="text-center py-12 bg-white dark:bg-business-800 border-0 shadow-lg">
                  <CardContent>
                    <Calendar className="w-16 h-16 mx-auto text-business-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No sessions scheduled</h3>
                    <p className="text-business-600 dark:text-business-300 mb-4">
                      Book your first mentorship session to get started!
                    </p>
                    <Button 
                      onClick={() => setActiveTab('mentors')}
                      className="bg-navy-600 hover:bg-navy-700"
                    >
                      Find Mentors
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="bg-white dark:bg-business-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-navy-100 dark:bg-navy-900 rounded-full flex items-center justify-center">
                              <span className="text-navy-600 dark:text-navy-400 font-semibold">
                                {booking.mentor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                Session with {booking.mentor.name}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDateTime(booking.date)}
                              </div>
                              {booking.notes && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {booking.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge 
                              variant={
                                booking.status === 'CONFIRMED' ? 'default' :
                                booking.status === 'PENDING' ? 'secondary' :
                                booking.status === 'CANCELLED' ? 'destructive' : 'outline'
                              }
                              className="flex items-center"
                            >
                              {booking.status === 'CONFIRMED' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {booking.status === 'PENDING' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {booking.status === 'CANCELLED' && <XCircle className="w-3 h-3 mr-1" />}
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Mentors</h2>
              </div>

              {mentors.length === 0 ? (
                <Card className="text-center py-12 bg-white dark:bg-business-800 border-0 shadow-lg">
                  <CardContent>
                    <User className="w-16 h-16 mx-auto text-business-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No mentors available</h3>
                    <p className="text-business-600 dark:text-business-300">
                      Check back later for available mentors in your area.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                    <Card key={mentor.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-business-800">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-navy-100 dark:bg-navy-900 rounded-full flex items-center justify-center">
                            <span className="text-navy-600 dark:text-navy-400 font-semibold">
                              {mentor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{mentor.name}</CardTitle>
                            <CardDescription className="flex items-center">
                              <Badge variant="outline" className="text-xs">
                                Mentor
                              </Badge>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {mentor.bio && (
                          <p className="text-business-600 dark:text-business-300 text-sm mb-3 line-clamp-3">
                            {mentor.bio}
                          </p>
                        )}
                        
                        {mentor.location && (
                          <div className="flex items-center text-sm text-business-500 dark:text-business-400 mb-3">
                            <MapPin className="w-3 h-3 mr-1" />
                            {mentor.location}
                          </div>
                        )}

                        {mentor.skills && mentor.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {mentor.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {mentor.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{mentor.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-business-500 dark:text-business-400">
                            <Star className="w-4 h-4 mr-1 text-teal-500" />
                            <span>4.8 (24 reviews)</span>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => handleBookSession(mentor)}
                            className="bg-navy-600 hover:bg-navy-700 text-white"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Book Session
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedMentor && (
          <BookingModal
            mentor={selectedMentor}
            onClose={() => {
              setShowBookingModal(false)
              setSelectedMentor(null)
            }}
            onSubmit={handleCreateBooking}
          />
        )}
      </div>
    </Sidebar>
  )
}

// Booking Modal Component
function BookingModal({ 
  mentor, 
  onClose, 
  onSubmit 
}: { 
  mentor: any; 
  onClose: () => void; 
  onSubmit: (data: any) => void 
}) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time) {
      toast.error('Please select a date and time')
      return
    }

    const dateTime = new Date(`${formData.date}T${formData.time}`)
    
    onSubmit({
      mentorId: mentor.id,
      date: dateTime.toISOString(),
      notes: formData.notes
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white dark:bg-business-800 border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Book Session with {mentor.name}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Schedule a 1:1 mentorship session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-business-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent dark:bg-business-700 dark:text-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Time *
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-business-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent dark:bg-business-700 dark:text-white transition-all"
                required
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-business-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent dark:bg-business-700 dark:text-white transition-all"
                placeholder="What would you like to discuss?"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-navy-600 hover:bg-navy-700">
                Book Session
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
