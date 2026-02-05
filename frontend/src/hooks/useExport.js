import { useState, useCallback } from 'react'
import { toPng, toSvg } from 'html-to-image'

export function useExport() {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  const exportLineup = useCallback(async (element, lineup, settings, format = 'png') => {
    if (!element) {
      setError('No element to export')
      console.error('Export failed: No element provided')
      return
    }

    setExporting(true)
    setError(null)

    try {
      const dimensions = getExportDimensions(settings.aspectRatio)

      const options = {
        width: dimensions.width,
        height: dimensions.height,
        quality: 1,
        pixelRatio: 2,
        skipFonts: true, // Skip font inlining to avoid CORS errors with Google Fonts
        backgroundColor: null,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      }

      console.log('Starting export with format:', format, 'dimensions:', dimensions)

      let dataUrl
      if (format === 'svg') {
        dataUrl = await toSvg(element, options)
      } else if (format === 'jpeg' || format === 'jpg') {
        // For JPEG, we need a white background
        dataUrl = await toPng(element, { ...options, backgroundColor: '#ffffff' })
      } else {
        dataUrl = await toPng(element, options)
      }

      console.log('Export data URL generated, length:', dataUrl.length)

      // Create download link
      const link = document.createElement('a')
      const fileName = `lineup-${lineup.formationId}-${Date.now()}.${format === 'jpeg' || format === 'jpg' ? 'jpg' : format}`
      link.download = fileName
      link.href = dataUrl
      
      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('Export completed:', fileName)

      return dataUrl
    } catch (err) {
      console.error('Export error:', err)
      setError(err.message)
      alert(`Export failed: ${err.message}`)
    } finally {
      setExporting(false)
    }
  }, [])

  return { exportLineup, exporting, error }
}

function getExportDimensions(aspectRatio) {
  const baseWidth = 1080
  
  switch (aspectRatio) {
    case 'square':
      return { width: baseWidth, height: baseWidth }
    case 'portrait':
    default:
      return { width: baseWidth, height: Math.round(baseWidth * 1.25) }
  }
}
