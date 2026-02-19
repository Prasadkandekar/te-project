'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { fetchPitches, createPitch } from '@/redux/slices/pitchesSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import {
    Presentation,
    Plus,
    Eye,
    Download,
    Filter,
    Search,
    Upload,
    FileText,
    Lock,
    Globe
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PitchesPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { pitches, loading, pagination } = useSelector((state: RootState) => state.pitches)
    const { user } = useSelector((state: RootState) => state.auth)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [filters, setFilters] = useState({
        search: ''
    })

    useEffect(() => {
        dispatch(fetchPitches(filters))
    }, [dispatch, filters])

    const handleCreatePitch = async (formData: FormData) => {
        try {
            await dispatch(createPitch(formData)).unwrap()
            toast.success('Pitch deck uploaded successfully!')
            setShowCreateModal(false)
        } catch (error: any) {
            toast.error(error || 'Failed to upload pitch deck')
        }
    }

    if (!user) {
        return (
            <Sidebar>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please log in to view pitch decks</h1>
                    </div>
                </div>
            </Sidebar>
        )
    }

    return (
        <Sidebar>
            <div className="bg-gray-50 dark:bg-navy-900 min-h-full">
                {/* Header */}
                <div className="bg-white dark:bg-navy-800 border-b border-lightTeal-200 dark:border-navy-700 shadow-sm">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-navy-700 dark:text-lightTeal-300">
                                    Pitch Decks
                                </h1>
                                <p className="text-navy-600 dark:text-lightTeal-400 mt-3 text-lg">
                                    Share your pitch decks and explore innovative startup ideas
                                </p>
                            </div>
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-navy-600 hover:bg-navy-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-3"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Upload Pitch
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:w-72 space-y-6">
                            <Card className="bg-white dark:bg-navy-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-xl font-bold text-navy-700 dark:text-lightTeal-300">
                                        <Filter className="w-5 h-5 mr-3" />
                                        Filters
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Search */}
                                    <div>
                                        <label className="block text-sm font-semibold text-navy-700 dark:text-lightTeal-300 mb-3">Search</label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Search pitch decks..."
                                                value={filters.search}
                                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                                className="w-full pl-12 pr-4 py-3 border border-lightTeal-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pitches Grid */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <Card key={i} className="animate-pulse bg-white dark:bg-navy-800 border-0 shadow-lg">
                                            <CardHeader>
                                                <div className="h-4 bg-lightTeal-200 dark:bg-navy-700 rounded w-3/4"></div>
                                                <div className="h-3 bg-lightTeal-200 dark:bg-navy-700 rounded w-1/2"></div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div className="h-3 bg-lightTeal-200 dark:bg-navy-700 rounded"></div>
                                                    <div className="h-3 bg-lightTeal-200 dark:bg-navy-700 rounded w-5/6"></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : pitches.length === 0 ? (
                                <Card className="text-center py-12 bg-white dark:bg-navy-800 border-0 shadow-lg">
                                    <CardContent>
                                        <Presentation className="w-16 h-16 mx-auto text-teal-500 mb-4" />
                                        <h3 className="text-xl font-semibold mb-2 text-navy-700 dark:text-lightTeal-300">No pitch decks found</h3>
                                        <p className="text-navy-600 dark:text-lightTeal-400 mb-4">
                                            Be the first to share your pitch deck with the community!
                                        </p>
                                        <Button
                                            onClick={() => setShowCreateModal(true)}
                                            className="bg-navy-600 hover:bg-navy-700"
                                        >
                                            Upload Your Pitch
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pitches.map((pitch) => (
                                        <Card key={pitch.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-navy-800">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg line-clamp-2 group-hover:text-teal-500 transition-colors text-navy-700 dark:text-lightTeal-300">
                                                            {pitch.title}
                                                        </CardTitle>
                                                        <CardDescription className="mt-1 text-navy-600 dark:text-lightTeal-400">
                                                            by {pitch.uploader.name} • {formatRelativeTime(pitch.createdAt)}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="ml-2">
                                                        {pitch.isPublic ? (
                                                            <Globe className="w-4 h-4 text-teal-500" />
                                                        ) : (
                                                            <Lock className="w-4 h-4 text-navy-400 dark:text-lightTeal-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-navy-600 dark:text-lightTeal-400 line-clamp-3 mb-4">
                                                    {pitch.description}
                                                </p>

                                                <div className="flex items-center justify-between text-sm text-navy-500 dark:text-lightTeal-500">
                                                    <div className="flex items-center">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        {pitch.views} views
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <FileText className="w-3 h-3 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <Download className="w-3 h-3 mr-1" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            disabled={!pagination.hasPrev}
                                            onClick={() => {
                                                // Handle previous page
                                            }}
                                        >
                                            Previous
                                        </Button>
                                        <span className="px-4 py-2 text-sm">
                                            Page {pagination.currentPage} of {pagination.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            disabled={!pagination.hasNext}
                                            onClick={() => {
                                                // Handle next page
                                            }}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Pitch Modal */}
                {showCreateModal && (
                    <CreatePitchModal
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreatePitch}
                    />
                )}
            </div>
        </Sidebar>
    )
}

// Create Pitch Modal Component
function CreatePitchModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: FormData) => void }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isPublic: false
    })
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            toast.error('Please select a file to upload')
            return
        }

        const submitData = new FormData()
        submitData.append('title', formData.title)
        submitData.append('description', formData.description)
        submitData.append('isPublic', formData.isPublic.toString())
        submitData.append('file', file)

        onSubmit(submitData)
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-navy-800 border-0 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-navy-700 dark:text-lightTeal-300">Upload Pitch Deck</CardTitle>
                    <CardDescription className="text-navy-600 dark:text-lightTeal-400">
                        Share your pitch deck with the community and get valuable feedback
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 border border-lightTeal-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                                placeholder="Enter pitch deck title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-3 border border-lightTeal-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-navy-700 dark:text-lightTeal-300 transition-all"
                                placeholder="Describe your startup and what makes it unique"
                                required
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pitch Deck File *</label>
                            <div
                                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-all
                  ${dragActive
                                        ? 'border-teal-500 bg-lightTeal-50 dark:bg-navy-900'
                                        : 'border-lightTeal-300 dark:border-navy-700 hover:border-teal-400'
                                    }
                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 mx-auto text-teal-500 mb-4" />
                                {file ? (
                                    <div>
                                        <p className="text-sm font-medium text-navy-700 dark:text-lightTeal-300">{file.name}</p>
                                        <p className="text-xs text-navy-500 dark:text-lightTeal-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm text-navy-600 dark:text-lightTeal-400 mb-2">
                                            Drag and drop your pitch deck here, or click to browse
                                        </p>
                                        <p className="text-xs text-navy-500 dark:text-lightTeal-500">
                                            Supports PDF and PowerPoint files (max 50MB)
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.ppt,.pptx"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="mt-4 inline-block px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-navy-600 cursor-pointer transition-colors"
                                >
                                    Choose File
                                </label>
                            </div>
                        </div>

                        {/* Privacy Setting */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={formData.isPublic}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                                className="w-4 h-4 text-teal-500 border-lightTeal-300 rounded focus:ring-teal-500"
                            />
                            <label htmlFor="isPublic" className="text-sm font-medium text-navy-700 dark:text-lightTeal-300">
                                Make this pitch deck public (visible to all community members)
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-teal-500 hover:bg-navy-600">
                                Upload Pitch Deck
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
