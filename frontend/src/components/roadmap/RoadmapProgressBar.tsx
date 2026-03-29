'use client'

interface RoadmapProgressBarProps {
  phases: { milestones: { completed: boolean }[] }[]
}

export function RoadmapProgressBar({ phases }: RoadmapProgressBarProps) {
  const total = phases.reduce((sum, p) => sum + p.milestones.length, 0)
  const completed = phases.reduce(
    (sum, p) => sum + p.milestones.filter((m) => m.completed).length,
    0
  )
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {completed} of {total} milestones completed
      </p>
    </div>
  )
}
