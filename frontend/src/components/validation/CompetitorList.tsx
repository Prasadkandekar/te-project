'use client'

import { Competitor } from '@/redux/slices/validationSlice'
import { Badge } from '@/components/ui/badge'

interface CompetitorListProps {
  competitors: Competitor[]
}

const THREAT_STYLES: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
}

export function CompetitorList({ competitors }: CompetitorListProps) {
  return (
    <div className="space-y-3">
      {competitors.map((competitor, i) => (
        <div
          key={i}
          className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex-1 min-w-0 mr-3">
            <p className="font-medium text-gray-900 dark:text-white text-sm">{competitor.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {competitor.positioningNote}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border flex-shrink-0 ${THREAT_STYLES[competitor.threatLevel] || THREAT_STYLES.MEDIUM}`}>
            {competitor.threatLevel}
          </span>
        </div>
      ))}
    </div>
  )
}
