'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { RootState, AppDispatch } from '@/redux/store'
import { runValidation, clearCurrentReport, fetchValidationHistory } from '@/redux/slices/validationSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ValidationScoreCard } from '@/components/validation/ValidationScoreCard'
import { DimensionBreakdown } from '@/components/validation/DimensionBreakdown'
import { SwotGrid } from '@/components/validation/SwotGrid'
import { CompetitorList } from '@/components/validation/CompetitorList'
import { PersonaCard } from '@/components/validation/PersonaCard'
import { ValidationChecklist } from '@/components/validation/ValidationChecklist'
import { PivotBanner } from '@/components/validation/PivotBanner'
import { CompetitiveDashboard } from '@/components/validation/CompetitiveDashboard'
import { ValidationLoadingState } from '@/components/validation/ValidationLoadingState'
import { Loader2, Sparkles, Plus, ChevronDown, History, Calendar } from 'lucide-react'
import { ideaAPI } from '@/lib/api'
import toast from 'react-hot-toast'

type Tab = 'validate' | 'history'
type SubTab = 'overview' | 'competitive'
type Mode = 'existing' | 'new'

const CATEGORIES = ['SaaS', 'Marketplace', 'Mobile App', 'Hardware', 'E-commerce', 'FinTech', 'HealthTech', 'EdTech', 'Other']
const STAGES = ['CONCEPT', 'VALIDATION', 'MVP', 'GROWTH']

function ValidateIdeaContent() {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const { currentReport, history, loading, error } = useSelector((state: RootState) => state.validation)

  const [mode, setMode] = useState<Mode>('existing')
  const [ideas, setIdeas] = useState<any[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('validate')
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview')
  const [ideasLoading, setIdeasLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedHistoryReport, setSelectedHistoryReport] = useState<any>(null)

  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'SaaS',
    targetMarket: '',
    challenges: '',
    stage: 'CONCEPT',
  })

  const fetchIdeas = async () => {
    try {
      const res = await ideaAPI.getMyIdeas()
      const data = res.data.data
      const ideasArray = Array.isArray(data) ? data : (data?.ideas ?? [])
      setIdeas(ideasArray)
    } catch {
      toast.error('Failed to load your ideas')
    } finally {
      setIdeasLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas()
    const preselected = searchParams.get('ideaId')
    if (preselected) {
      setSelectedIdeaId(preselected)
      setMode('existing')
    }
  }, [searchParams])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleCreateAndValidate = async () => {
    if (!newIdea.title.trim() || !newIdea.description.trim()) {
      toast.error('Title and description are required')
      return
    }
    setCreating(true)
    try {
      const res = await ideaAPI.createIdea(newIdea)
      const created = res.data.data?.idea || res.data.data
      toast.success('Idea saved!')
      await fetchIdeas()
      setSelectedIdeaId(created.id)
      dispatch(clearCurrentReport())
      setSelectedHistoryReport(null)
      await dispatch(runValidation(created.id)).unwrap()
      toast.success('Validation complete!')
      dispatch(fetchValidationHistory(created.id))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create or validate idea')
    } finally {
      setCreating(false)
    }
  }

  const handleValidateExisting = async () => {
    if (!selectedIdeaId) {
      toast.error('Please select an idea first')
      return
    }
    dispatch(clearCurrentReport())
    setSelectedHistoryReport(null)
    try {
      await dispatch(runValidation(selectedIdeaId)).unwrap()
      toast.success('Validation complete!')
      dispatch(fetchValidationHistory(selectedIdeaId))
    } catch {
      // handled via redux state
    }
  }

  useEffect(() => {
    if (selectedIdeaId && activeTab === 'history') {
      dispatch(fetchValidationHistory(selectedIdeaId))
    }
  }, [selectedIdeaId, activeTab, dispatch])

  const busy = loading || creating
  const displayReport = selectedHistoryReport || currentReport

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Validate Idea</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Get an AI-powered assessment of your startup idea&apos;s viability
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Main Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('validate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'validate'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Validate
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>

        {/* Validate Tab */}
        {activeTab === 'validate' && (
          <>
            {/* Mode toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode('existing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  mode === 'existing'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                }`}
              >
                Use Existing Idea
              </button>
              <button
                onClick={() => setMode('new')}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  mode === 'new'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                }`}
              >
                <Plus className="w-4 h-4" />
                New Idea
              </button>
            </div>

            {/* Existing idea selector */}
            {mode === 'existing' && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select an Idea
                      </label>
                      <div className="relative">
                        <select
                          value={selectedIdeaId}
                          onChange={(e) => setSelectedIdeaId(e.target.value)}
                          disabled={ideasLoading || busy}
                          className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                          <option value="">
                            {ideasLoading ? 'Loading ideas...' : ideas.length === 0 ? 'No ideas yet — create one' : 'Choose an idea to validate'}
                          </option>
                          {ideas.map((idea) => (
                            <option key={idea.id} value={idea.id}>{idea.title}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {ideas.length === 0 && !ideasLoading && (
                        <p className="text-xs text-gray-500 mt-1">
                          Switch to &quot;New Idea&quot; to create and validate one.
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleValidateExisting}
                        disabled={busy || !selectedIdeaId}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 w-full sm:w-auto"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Validating...</>
                        ) : (
                          <><Sparkles className="w-4 h-4 mr-2" />Validate</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New idea form */}
            {mode === 'new' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Enter Your Idea</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newIdea.title}
                        onChange={(e) => setNewIdea(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. AI-powered invoice automation for SMBs"
                        disabled={busy}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={newIdea.description}
                        onChange={(e) => setNewIdea(p => ({ ...p, description: e.target.value }))}
                        placeholder="Describe your idea — the problem it solves, how it works, and who it's for."
                        disabled={busy}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select
                        value={newIdea.category}
                        onChange={(e) => setNewIdea(p => ({ ...p, category: e.target.value }))}
                        disabled={busy}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
                      <select
                        value={newIdea.stage}
                        onChange={(e) => setNewIdea(p => ({ ...p, stage: e.target.value }))}
                        disabled={busy}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      >
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Market</label>
                      <input
                        type="text"
                        value={newIdea.targetMarket}
                        onChange={(e) => setNewIdea(p => ({ ...p, targetMarket: e.target.value }))}
                        placeholder="e.g. Small business owners in the US"
                        disabled={busy}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Challenges</label>
                      <input
                        type="text"
                        value={newIdea.challenges}
                        onChange={(e) => setNewIdea(p => ({ ...p, challenges: e.target.value }))}
                        placeholder="e.g. High customer acquisition cost"
                        disabled={busy}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleCreateAndValidate}
                      disabled={busy || !newIdea.title.trim() || !newIdea.description.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                    >
                      {busy ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{creating ? 'Saving...' : 'Validating...'}</>
                      ) : (
                        <><Sparkles className="w-4 h-4 mr-2" />Save &amp; Validate</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading */}
            {busy && <ValidationLoadingState creating={creating} />}

            {/* Results */}
            {!busy && displayReport && (
              <>
                <div className="mb-6">
                  <PivotBanner
                    pivotRecommended={displayReport.pivotRecommended}
                    pivotSuggestions={displayReport.pivotSuggestions}
                  />
                </div>

                {selectedHistoryReport && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                      <History className="w-4 h-4" />
                      <span>Viewing historical report from {new Date(selectedHistoryReport.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => setSelectedHistoryReport(null)}
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                      Back to Latest
                    </button>
                  </div>
                )}

                {/* Sub-tabs */}
                <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                  <button
                    onClick={() => setActiveSubTab('overview')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSubTab === 'overview'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveSubTab('competitive')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSubTab === 'competitive'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Competitive Analysis
                  </button>
                </div>

                {activeSubTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader><CardTitle className="text-lg">Overall Score</CardTitle></CardHeader>
                        <CardContent className="flex justify-center">
                          <ValidationScoreCard score={displayReport.score} />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="text-lg">Dimension Breakdown</CardTitle></CardHeader>
                        <CardContent>
                          <DimensionBreakdown dimensionScores={displayReport.dimensionScores} />
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader><CardTitle className="text-lg">SWOT Analysis</CardTitle></CardHeader>
                      <CardContent><SwotGrid swot={displayReport.swot} /></CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader><CardTitle className="text-lg">Competitor Snapshot</CardTitle></CardHeader>
                        <CardContent><CompetitorList competitors={displayReport.competitors} /></CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="text-lg">Target Persona</CardTitle></CardHeader>
                        <CardContent><PersonaCard persona={displayReport.persona} /></CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader><CardTitle className="text-lg">Pre-Build Checklist</CardTitle></CardHeader>
                      <CardContent><ValidationChecklist checklist={displayReport.checklist} /></CardContent>
                    </Card>
                  </div>
                )}

                {activeSubTab === 'competitive' && (
                  <Card>
                    <CardContent className="pt-6">
                      <CompetitiveDashboard report={displayReport} />
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!busy && !displayReport && (
              <div className="text-center py-20">
                <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {mode === 'new'
                    ? 'Fill in your idea details above and click Save & Validate.'
                    : 'Select an idea and click Validate to get your AI-powered report.'}
                </p>
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Validation History
                </CardTitle>
                {selectedIdeaId && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ideas.find(i => i.id === selectedIdeaId)?.title}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedIdeaId ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Select an idea to view its validation history
                  </p>
                  <div className="relative inline-block">
                    <select
                      value={selectedIdeaId}
                      onChange={(e) => setSelectedIdeaId(e.target.value)}
                      disabled={ideasLoading}
                      className="px-4 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 appearance-none"
                    >
                      <option value="">Choose an idea</option>
                      {ideas.map((idea) => (
                        <option key={idea.id} value={idea.id}>{idea.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    No validation history yet for this idea
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Run a validation to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => {
                        setSelectedHistoryReport(report)
                        setActiveTab('validate')
                        setActiveSubTab('overview')
                      }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-colors bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            report.score >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            report.score >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {report.score}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(report.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {report.pivotRecommended && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs rounded">
                                Pivot Recommended
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                          View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ValidateIdeaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    }>
      <ValidateIdeaContent />
    </Suspense>
  )
}
