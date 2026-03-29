'use client'

import { useState } from 'react'
import { CheckCircle, Circle } from 'lucide-react'

interface ValidationChecklistProps {
  checklist: string[]
}

export function ValidationChecklist({ checklist }: ValidationChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const completedCount = checked.size

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {completedCount} of {checklist.length} completed
        </span>
        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(completedCount / checklist.length) * 100}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2">
        {checklist.map((item, i) => (
          <li
            key={i}
            onClick={() => toggle(i)}
            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {checked.has(i) ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${checked.has(i) ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
