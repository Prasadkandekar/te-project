'use client'

import { Phase } from '@/redux/slices/roadmapSlice'
import { MilestoneCheckbox } from './MilestoneCheckbox'
import { CheckCircle2, Target, BarChart2, Wrench } from 'lucide-react'

interface PhaseCardProps {
  phase: Phase
  isActive: boolean
}

const PHASE_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-pink-600',
  'from-pink-500 to-rose-600',
]

export function PhaseCard({ phase, isActive }: PhaseCardProps) {
  const completedCount = phase.milestones.filter((m) => m.completed).length
  const totalCount = phase.milestones.length
  const gradient = PHASE_COLORS[(phase.phaseNumber - 1) % PHASE_COLORS.length]

  return (
    <div
      className={`rounded-xl border transition-all ${
        isActive
          ? 'border-indigo-300 dark:border-indigo-700 shadow-md'
          : 'border-gray-200 dark:border-gray-700'
      } bg-white dark:bg-gray-800 overflow-hidden`}
    >
      {/* Phase header */}
      <div className={`bg-gradient-to-r ${gradient} p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">
              Phase {phase.phaseNumber} · {phase.weekRange}
            </p>
            <h3 className="text-white font-bold text-lg mt-0.5">{phase.title}</h3>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">Milestones</p>
            <p className="text-white font-bold text-lg">
              {completedCount}/{totalCount}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Goal */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Goal</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{phase.goal}</p>
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Milestones</span>
          </div>
          <div className="space-y-2.5">
            {phase.milestones.map((milestone) => (
              <MilestoneCheckbox key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        {phase.successMetrics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Success Metrics</span>
            </div>
            <ul className="space-y-1">
              {phase.successMetrics.map((metric, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Tools */}
        {phase.recommendedTools.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recommended Tools</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {phase.recommendedTools.map((tool, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-800"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
