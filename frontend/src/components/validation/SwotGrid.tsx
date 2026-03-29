'use client'

import { Swot } from '@/redux/slices/validationSlice'

interface SwotGridProps {
  swot: Swot
}

const QUADRANTS = [
  { key: 'strengths', label: 'Strengths', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', title: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  { key: 'weaknesses', label: 'Weaknesses', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', title: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  { key: 'opportunities', label: 'Opportunities', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', title: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  { key: 'threats', label: 'Threats', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', title: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
] as const

export function SwotGrid({ swot }: SwotGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {QUADRANTS.map(({ key, label, bg, border, title, dot }) => (
        <div key={key} className={`p-4 rounded-lg border ${bg} ${border}`}>
          <h4 className={`font-semibold text-sm mb-3 ${title}`}>{label}</h4>
          <ul className="space-y-1.5">
            {swot[key].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
