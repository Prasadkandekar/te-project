'use client'

import { AlertTriangle } from 'lucide-react'

interface PivotBannerProps {
  pivotRecommended: boolean
  pivotSuggestions: string[]
}

export function PivotBanner({ pivotRecommended, pivotSuggestions }: PivotBannerProps) {
  if (!pivotRecommended) return null

  return (
    <div className="rounded-xl border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-orange-800 dark:text-orange-300">Pivot Recommended</p>
          <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
            Your idea scored below 60. Consider these pivot suggestions:
          </p>
          {pivotSuggestions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {pivotSuggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-orange-700 dark:text-orange-400 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
