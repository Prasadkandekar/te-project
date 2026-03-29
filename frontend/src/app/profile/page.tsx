'use client'

import { useAuthGuard } from '@/lib/useAuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar,
  Edit,
  Shield
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuthGuard()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your profile</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-700 dark:text-lightTeal-300 mb-2">
            My Profile
          </h1>
          <p className="text-navy-600 dark:text-lightTeal-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-navy-700 dark:text-lightTeal-300">
                    {user.name}
                  </h2>
                  {user.verified && (
                    <Badge className="bg-green-600 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge className="bg-purple-600 text-white">
                    {user.role}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-navy-600 dark:text-lightTeal-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        {user.bio && (
          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-navy-700 dark:text-lightTeal-300">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-navy-600 dark:text-lightTeal-400 leading-relaxed">
                {user.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-navy-700 dark:text-lightTeal-300 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Details */}
        <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-navy-700 dark:text-lightTeal-300">Account Details</CardTitle>
            <CardDescription className="text-navy-600 dark:text-lightTeal-400">
              Your account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-navy-600 dark:text-lightTeal-400">
                <Calendar className="w-4 h-4" />
                <span>Member Since</span>
              </div>
              <span className="font-semibold text-navy-700 dark:text-lightTeal-300">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-navy-600 dark:text-lightTeal-400">
                <User className="w-4 h-4" />
                <span>Account Type</span>
              </div>
              <Badge className="bg-purple-600 text-white">
                {user.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-navy-600 dark:text-lightTeal-400">
                <Shield className="w-4 h-4" />
                <span>Verification Status</span>
              </div>
              {user.verified ? (
                <Badge className="bg-green-600 text-white">Verified</Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                  Not Verified
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
