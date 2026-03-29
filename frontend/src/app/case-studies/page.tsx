'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { generateCaseStudies, fetchCaseStudies } from '@/redux/slices/caseStudiesSlice'
import { fetchIdeas } from '@/redux/slices/ideasSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CompetitorCard from '@/components/case-studies/CompetitorCard'
import CaseStudyLoadingState from '@/components/case-studies/CaseStudyLoadingState'
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react'
import { useAuthGuard } from '@/lib/useAuthGuard'

export default function CaseStudiesPage() {
  useAuthGuard()
  const dispatch = useDispatch<AppDispatch>()
  const { ideas } = useSelector((state: RootState) => state.ideas)
  const { currentCaseStudy, loading, error } = useSelector((state: RootState) => state.caseStudies)
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('')
  const [customIdea, setCustomIdea] = useState('')

  useEffect(() => {
    dispatch(fetchIdeas({}))
  }, [dispatch])

  const handleGenerate = async () => {
    if (selectedIdeaId) {
      await dispatch(generateCaseStudies(selectedIdeaId))
    }
  }

  const handleSelectIdea = async (ideaId: string) => {
    setSelectedIdeaId(ideaId)
    setCustomIdea('')
    await dispatch(fetchCaseStudies(ideaId))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Competitor Case Studies</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Learn from the top 3 competitors in your space. Discover how they started, grew, and succeeded.
          </p>
        </div>

        {!currentCaseStudy && !loading && (
          <Card className="bg-white dark:bg-gray-800 mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Select Your Startup Idea</h2>
              
              {ideas.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {ideas.map((idea) => (
                      <button
                        key={idea.id}
                        onClick={() => handleSelectIdea(idea.id)}
                        className={`text-left p-4 rounded-lg border-2 transition-all ${
                          selectedIdeaId === idea.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                        }`}
                      >
                        <div className="font-semibold text-lg">{idea.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {idea.description.substring(0, 100)}...
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {idea.category}
                          </span>
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {idea.stage}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedIdeaId && (
                    <Button
                      onClick={handleGenerate}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      size="lg"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Case Studies
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You don't have any ideas yet. Create an idea first to generate case studies.
                  </p>
                  <Button
                    onClick={() => window.location.href = '/ideas'}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Go to Ideas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && <CaseStudyLoadingState />}

        {currentCaseStudy && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Top 3 Competitors</h2>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Generate New Analysis
              </Button>
            </div>

            {currentCaseStudy.competitors.map((competitor, index) => (
              <CompetitorCard key={index} competitor={competitor} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
