'use client'

import { Phase } from '@/redux/slices/roadmapSlice'
import { PhaseCard } from './PhaseCard'

interface PhaseTimelineProps {
  phases: Phase[]
}

export function PhaseTimeline({ phases }: PhaseTimelineProps) {
  const sorted = [...phases].sort((a, b) => a.phaseNumber - b.phaseNumber)

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />

      <div className="space-y-6">
        {sorted.map((phase, idx) => {
          const completedCount = phase.milestones.filter((m) => m.completed).length
          const isComplete = completedCount === phase.milestones.length && phase.milestones.length > 0
          const isActive = !isComplete && (idx === 0 || sorted[idx - 1].milestones.every((m) => m.completed))

          return (
            <div key={phase.id} className="flex gap-4 md:gap-6">
              {/* Step indicator */}
              <div className="hidden md:flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 z-10 ${
                    isComplete
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500'
                  }`}
                >
                  {isComplete ? '✓' : phase.phaseNumber}
                </div>
              </div>

              {/* Phase card */}
              <div className="flex-1">
                <PhaseCard phase={phase} isActive={isActive} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
