'use client'

interface ValidationScoreCardProps {
  score: number
}

function getScoreColor(score: number): { text: string; stroke: string; bg: string; label: string } {
  if (score >= 80) return { text: 'text-green-600 dark:text-green-400', stroke: '#16a34a', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Strong' }
  if (score >= 60) return { text: 'text-yellow-600 dark:text-yellow-400', stroke: '#ca8a04', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Moderate' }
  return { text: 'text-red-600 dark:text-red-400', stroke: '#dc2626', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Weak' }
}

export function ValidationScoreCard({ score }: ValidationScoreCardProps) {
  const { text, stroke, bg, label } = getScoreColor(score)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-xl ${bg} border border-opacity-20`}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="65" textAnchor="middle" className="text-3xl font-bold" fill={stroke} fontSize="28" fontWeight="bold">
          {score}
        </text>
        <text x="70" y="85" textAnchor="middle" fill="#6b7280" fontSize="12">
          / 100
        </text>
      </svg>
      <p className={`text-lg font-semibold mt-2 ${text}`}>{label} Viability</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall Score</p>
    </div>
  )
}
