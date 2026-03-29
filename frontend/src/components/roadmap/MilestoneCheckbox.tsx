'use client'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { toggleMilestone } from '@/redux/slices/roadmapSlice'
import { Milestone } from '@/redux/slices/roadmapSlice'

interface MilestoneCheckboxProps {
  milestone: Milestone
}

export function MilestoneCheckbox({ milestone }: MilestoneCheckboxProps) {
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = () => {
    dispatch(toggleMilestone({ milestoneId: milestone.id, completed: !milestone.completed }))
  }

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={milestone.completed}
        onChange={handleChange}
        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
      />
      <span
        className={`text-sm transition-colors ${
          milestone.completed
            ? 'line-through text-gray-400 dark:text-gray-500'
            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
        }`}
      >
        {milestone.title}
      </span>
    </label>
  )
}
