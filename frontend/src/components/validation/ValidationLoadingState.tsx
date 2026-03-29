'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Lightbulb, TrendingUp, Users, Target, Zap } from 'lucide-react'

const TIPS = [
  { icon: Lightbulb, text: "Analyzing market demand and opportunity size..." },
  { icon: Users, text: "Identifying your target audience and personas..." },
  { icon: TrendingUp, text: "Evaluating competitive landscape and gaps..." },
  { icon: Target, text: "Assessing execution feasibility and resources..." },
  { icon: Zap, text: "Calculating revenue potential and scalability..." },
  { icon: Sparkles, text: "Generating SWOT analysis and recommendations..." },
]

export function ValidationLoadingState({ creating }: { creating?: boolean }) {
  const [currentTip, setCurrentTip] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Rotate tips every 3 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length)
    }, 3000)

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95 // Cap at 95% until actual completion
        return prev + Math.random() * 3
      })
    }, 200)

    return () => {
      clearInterval(tipInterval)
      clearInterval(progressInterval)
    }
  }, [])

  if (creating) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-t-indigo-600 rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium mt-6">
          Saving your idea...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Just a moment</p>
      </div>
    )
  }

  const CurrentIcon = TIPS[currentTip].icon

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Animated icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Pulsing background circles */}
          <div className="absolute inset-0 -m-4">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-ping opacity-20" />
          </div>
          <div className="absolute inset-0 -m-2">
            <div className="w-20 h-20 bg-indigo-200 dark:bg-indigo-800/40 rounded-full animate-pulse" />
          </div>
          
          {/* Main icon */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <CurrentIcon className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>
      </div>

      {/* Main message */}
      <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        AI is analyzing your idea
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        This usually takes 10-15 seconds
      </p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full bg-white/30 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Rotating tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-start gap-3 min-h-[60px]">
          <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
            <CurrentIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 pt-1">
            <p
              key={currentTip}
              className="text-gray-700 dark:text-gray-300 font-medium animate-fade-in"
            >
              {TIPS[currentTip].text}
            </p>
          </div>
        </div>
      </div>

      {/* Fun facts */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Dimensions</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">SWOT Areas</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">3-5</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Competitors</div>
        </div>
      </div>
    </div>
  )
}
