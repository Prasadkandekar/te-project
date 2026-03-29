'use client'

import { ValidationReport, Competitor } from '@/redux/slices/validationSlice'
import { BarChart3, TrendingUp } from 'lucide-react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts'

interface CompetitiveDashboardProps {
  report: ValidationReport | null
}

// Map threat level to a numeric "features" score for the scatter chart
function threatToFeatures(threatLevel: string): number {
  if (threatLevel === 'HIGH') return 80
  if (threatLevel === 'MEDIUM') return 50
  return 20
}

// Derive a rough "price" score from positioning note keywords
function positioningToPrice(note: string): number {
  const lower = note.toLowerCase()
  if (lower.includes('premium') || lower.includes('enterprise') || lower.includes('expensive')) return 80
  if (lower.includes('free') || lower.includes('open source') || lower.includes('cheap') || lower.includes('low cost')) return 15
  if (lower.includes('mid') || lower.includes('affordable') || lower.includes('competitive pricing')) return 45
  // Default: spread based on string hash for visual variety
  let hash = 0
  for (let i = 0; i < note.length; i++) hash = (hash * 31 + note.charCodeAt(i)) & 0xffff
  return 25 + (hash % 40)
}

interface ChartPoint {
  name: string
  price: number
  features: number
  threatLevel: string
  positioningNote: string
}

const THREAT_COLORS: Record<string, string> = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#22c55e',
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d: ChartPoint = payload[0].payload
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg max-w-xs">
      <p className="font-semibold text-gray-900 dark:text-white text-sm">{d.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{d.positioningNote}</p>
      <div className="flex gap-3 mt-2 text-xs">
        <span className="text-gray-600 dark:text-gray-300">Price index: <strong>{d.price}</strong></span>
        <span className="text-gray-600 dark:text-gray-300">Features: <strong>{d.features}</strong></span>
      </div>
      <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        d.threatLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
        d.threatLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
        'bg-green-100 text-green-700'
      }`}>{d.threatLevel} threat</span>
    </div>
  )
}

function deriveOpportunities(competitors: Competitor[]): string[] {
  const opportunities: string[] = []

  const lowThreat = competitors.filter(c => c.threatLevel === 'LOW')
  const highThreat = competitors.filter(c => c.threatLevel === 'HIGH')

  if (lowThreat.length > 0) {
    opportunities.push(
      `Outperform ${lowThreat.map(c => c.name).join(', ')} by addressing their weak positioning: ${lowThreat[0].positioningNote}`
    )
  }

  if (highThreat.length < competitors.length) {
    opportunities.push('Most competitors are not dominant — there is room to capture market share with a focused value proposition.')
  }

  const premiumCount = competitors.filter(c =>
    c.positioningNote.toLowerCase().includes('premium') || c.positioningNote.toLowerCase().includes('enterprise')
  ).length
  if (premiumCount > 0 && premiumCount < competitors.length) {
    opportunities.push('Gap exists in the mid-market segment — consider a competitive pricing strategy to attract price-sensitive customers.')
  }

  const freeCount = competitors.filter(c =>
    c.positioningNote.toLowerCase().includes('free') || c.positioningNote.toLowerCase().includes('open source')
  ).length
  if (freeCount === 0) {
    opportunities.push('No free-tier competitor detected — a freemium model could accelerate user acquisition.')
  }

  if (opportunities.length === 0) {
    opportunities.push('Differentiate through superior UX, faster onboarding, or niche vertical focus.')
    opportunities.push('Explore underserved customer segments not addressed by current competitors.')
  }

  return opportunities
}

export function CompetitiveDashboard({ report }: CompetitiveDashboardProps) {
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Run validation first</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Validate your idea to see the competitive landscape dashboard.
        </p>
      </div>
    )
  }

  const chartData: ChartPoint[] = report.competitors.map(c => ({
    name: c.name,
    price: positioningToPrice(c.positioningNote),
    features: threatToFeatures(c.threatLevel),
    threatLevel: c.threatLevel,
    positioningNote: c.positioningNote,
  }))

  const opportunities = deriveOpportunities(report.competitors)

  // Market gap: low price + high features quadrant (top-left)
  const hasLowPriceHighFeatureGap = !chartData.some(d => d.price < 40 && d.features > 60)
  // Market gap: high price + low features quadrant (bottom-right)
  const hasHighPriceLowFeatureGap = !chartData.some(d => d.price > 60 && d.features < 40)

  return (
    <div className="space-y-6">
      {/* Scatter chart */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Competitor Positioning Map</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Competitors plotted by estimated price index vs. feature richness (derived from threat level &amp; positioning).
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="price"
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            >
              <Label value="Price Index →" offset={-10} position="insideBottom" style={{ fontSize: 11, fill: '#6b7280' }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="features"
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            >
              <Label value="Feature Richness →" angle={-90} position="insideLeft" style={{ fontSize: 11, fill: '#6b7280' }} />
            </YAxis>

            {/* Quadrant dividers */}
            <ReferenceLine x={50} stroke="#d1d5db" strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="#d1d5db" strokeDasharray="4 4" />

            <Tooltip content={<CustomTooltip />} />

            {/* Render each competitor as a colored dot */}
            {chartData.map((point, i) => (
              <Scatter
                key={i}
                name={point.name}
                data={[point]}
                fill={THREAT_COLORS[point.threatLevel] || '#6366f1'}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 justify-center">
          {(['HIGH', 'MEDIUM', 'LOW'] as const).map(level => (
            <div key={level} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: THREAT_COLORS[level] }} />
              {level} threat
            </div>
          ))}
        </div>

        {/* Market gap annotations */}
        {(hasLowPriceHighFeatureGap || hasHighPriceLowFeatureGap) && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Market Gaps Detected</p>
            {hasLowPriceHighFeatureGap && (
              <div className="flex items-start gap-2 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-3 py-2">
                <span className="mt-0.5">📍</span>
                <span>Low-price / high-feature quadrant is unoccupied — opportunity to offer a feature-rich product at an accessible price point.</span>
              </div>
            )}
            {hasHighPriceLowFeatureGap && (
              <div className="flex items-start gap-2 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2">
                <span className="mt-0.5">📍</span>
                <span>High-price / low-feature quadrant is unoccupied — a premium niche with simplified, focused functionality could command higher margins.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Competitor list */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Competitor Breakdown</h3>
        <div className="space-y-3">
          {report.competitors.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: THREAT_COLORS[c.threatLevel] || '#6366f1' }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{c.positioningNote}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                c.threatLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                c.threatLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>{c.threatLevel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiation opportunities */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Differentiation Opportunities</h3>
        </div>
        <ul className="space-y-2">
          {opportunities.map((opp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              {opp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
