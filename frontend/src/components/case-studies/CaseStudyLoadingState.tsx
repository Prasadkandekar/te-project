'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function CaseStudyLoadingState() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Researching Competitors...</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Analyzing top competitors and their growth stories
        </p>
      </div>

      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-white dark:bg-gray-800 animate-pulse">
          <CardHeader>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
