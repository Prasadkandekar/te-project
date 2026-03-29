'use client'

import { DimensionScores } from '@/redux/slices/validationSlice'

interface DimensionBreakdownProps {
  dimensionScores: DimensionScores
}

const DIMENSIONS = [
  { key: 'marketDemand', label: 'Market Demand', weight: '25%' },
  { key: 'competitiveGap', label: 'Competitive Gap', weight: '20%' },
  { key: 'executionFeasibility', label: 'Execution Feasibility', weight: '20%' },
  { key: 'revenuePotential', label: 'Revenue Potential', weight: '20%' },
  { key: 'timingTrends', label: 'Timing & Trends', weight: '15%' },
] as const

function getBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function DimensionBreakdown({ dimensionScores }: DimensionBreakdownProps) {
  return (
    <div className="space-y-4">
      {DIMENSIONS.map(({ key, label, weight }) => {
        const score = dimensionScores[key]
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                <span className="ml-1 text-xs text-gray-400">({weight})</span>
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{score}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
