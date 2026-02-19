// TEMPORARILY DISABLED - Validate Idea Feature
// This feature is currently disabled due to configuration issues

'use client'

import { Sidebar } from '@/components/sidebar'

export default function ValidateIdeaPage() {
  return (
    <Sidebar>
      <div className="bg-gray-50 dark:bg-business-900 min-h-full">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Feature Temporarily Disabled
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                The Validate Idea feature is currently under maintenance.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Please check back later or explore our other features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

/*
// ORIGINAL VALIDATE IDEA CODE - COMMENTED OUT
'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sparkles,
  BarChart3,
  DollarSign,
  Users
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

// ... rest of the original code commented out for now
*/