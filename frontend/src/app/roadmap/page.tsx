'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { RootState, AppDispatch } from '@/redux/store'
import { generateRoadmap, fetchRoadmap, clearRoadmap } from '@/redux/slices/roadmapSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhaseTimeline } from '@/components/roadmap/PhaseTimeline'
import { RoadmapProgressBar } from '@/components/roadmap/RoadmapProgressBar'
import { ExportButton } from '@/components/roadmap/ExportButton'
import { ideaAPI } from '@/lib/api'
import { Map, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

function RoadmapContent() {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const { roadmap, loading, error } = useSelector((state: RootState) => state.roadmap)

  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState('')
  const [ideasLoading, setIdeasLoading] = useState(true)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await ideaAPI.getMyIdeas()
        const data = res.data.data
        const ideasArray = Array.isArray(data) ? data : (data?.ideas ?? [])
        setIdeas(ideasArray)

        const preselected = searchParams.get('ideaId')
        if (preselected) {
          setSelectedIdeaId(preselected)
        }
      } catch {
        toast.error('Failed to load your ideas')
      } finally {
        setIdeasLoading(false)
      }
    }
    fetchIdeas()
  }, [searchParams])

  // Auto-fetch roadmap when idea is selected
  useEffect(() => {
    if (!selectedIdeaId) {
      dispatch(clearRoadmap())
      return
    }
    dispatch(fetchRoadmap(selectedIdeaId))
  }, [selectedIdeaId, dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const selectedIdea = ideas.find((i) => i.id === selectedIdeaId)

  const handleGenerate = async () => {
    if (!selectedIdeaId) return
    setGeneratingId(selectedIdeaId)
    try {
      await dispatch(generateRoadmap(selectedIdeaId)).unwrap()
      toast.success('Roadmap generated!')
    } catch {
      // error handled via redux state
    } finally {
      setGeneratingId(null)
    }
  }

  const isGenerating = generatingId === selectedIdeaId && loading

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-indigo-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roadmap</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Generate and track your phase-based execution plan
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 max-w-5xl">
          {/* Idea selector + generate */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select an Idea
                  </label>
                  <select
                    value={selectedIdeaId}
                    onChange={(e) => setSelectedIdeaId(e.target.value)}
                    disabled={ideasLoading || loading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="">
                      {ideasLoading ? 'Loading ideas...' : 'Choose an idea'}
                    </option>
                    {ideas.map((idea) => (
                      <option key={idea.id} value={idea.id}>
                        {idea.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedIdeaId}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : roadmap ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Roadmap
                      </>
                    )}
                  </Button>
                  {roadmap && selectedIdea && (
                    <ExportButton ideaId={selectedIdeaId} ideaTitle={selectedIdea.title} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {isGenerating ? 'Generating your roadmap with AI...' : 'Loading roadmap...'}
              </p>
              {isGenerating && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">This may take a few seconds</p>
              )}
            </div>
          )}

          {/* Roadmap content */}
          {!loading && roadmap && (
            <>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <RoadmapProgressBar phases={roadmap.phases} />
                </CardContent>
              </Card>

              <PhaseTimeline phases={roadmap.phases} />
            </>
          )}

          {/* Empty state */}
          {!loading && !roadmap && selectedIdeaId && (
            <div className="text-center py-20">
              <Map className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No roadmap yet for this idea.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Roadmap
              </Button>
            </div>
          )}

          {!loading && !roadmap && !selectedIdeaId && (
            <div className="text-center py-20">
              <Map className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select an idea above to view or generate its roadmap.
              </p>
            </div>
          )}
        </div>
    </div>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  )
}
