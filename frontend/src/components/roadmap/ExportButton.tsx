'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { roadmapAPI } from '@/lib/api'
import { Download, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportButtonProps {
  ideaId: string
  ideaTitle?: string
}

export function ExportButton({ ideaId, ideaTitle }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const response = await roadmapAPI.exportPDF(ideaId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ideaTitle ? ideaTitle.replace(/\s+/g, '-').toLowerCase() : 'roadmap'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded successfully')
    } catch {
      toast.error('Failed to export PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </>
      )}
    </Button>
  )
}
