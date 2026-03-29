'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Calendar, Users, TrendingUp, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

interface TimelineEvent {
  year: number
  event: string
  impact: string
}

interface Competitor {
  name: string
  foundedYear: number
  founders: string
  story: string
  timeline: TimelineEvent[]
  keyLessons: string[]
  currentStatus: string
  differentiators: string[]
}

interface CompetitorCardProps {
  competitor: Competitor
  index: number
}

export default function CompetitorCard({ competitor, index }: CompetitorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-600" />
              {competitor.name}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Founded {competitor.foundedYear}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {competitor.founders}
              </span>
            </div>
            {!isExpanded && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                Click to view full case study
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 text-white">
              #{index + 1} Competitor
            </Badge>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-300">
        <div>
          <h3 className="font-semibold text-lg mb-2">Their Story</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{competitor.story}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Growth Timeline
          </h3>
          <div className="space-y-3">
            {competitor.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4 border-l-2 border-purple-600 pl-4 py-2">
                <div className="font-bold text-purple-600 min-w-[60px]">{event.year}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{event.event}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Key Lessons
          </h3>
          <ul className="space-y-2">
            {competitor.keyLessons.map((lesson, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700 dark:text-gray-300">{lesson}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Current Status</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{competitor.currentStatus}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Success Factors</h4>
            <ul className="text-sm space-y-1">
              {competitor.differentiators.map((diff, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">• {diff}</li>
              ))}
            </ul>
          </div>
        </div>
        </CardContent>
      )}
    </Card>
  )
}
