'use client'

import { Persona } from '@/redux/slices/validationSlice'
import { Users, DollarSign, Radio, AlertCircle } from 'lucide-react'

interface PersonaCardProps {
  persona: Persona
}

export function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">Target Persona</p>
            <p className="text-purple-100 text-sm">{persona.demographics}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pain Points</span>
          </div>
          <ul className="space-y-1">
            {persona.painPoints.map((point, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Willingness to Pay</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{persona.willingnessToPay}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Acquisition Channels</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {persona.channels.map((channel, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800">
                {channel}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
