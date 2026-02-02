import { useState, useCallback } from 'react'
import { toPng, toSvg } from 'html-to-image'

export function useExport() {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  const exportLineup = useCallback(async (element, lineup, settings, format = 'png') => {
    if (!element) {
      setError('No element to export')
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
        backgroundColor: null,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      }

      let dataUrl
      if (format === 'svg') {
        dataUrl = await toSvg(element, options)
      } else {
        dataUrl = await toPng(element, options)
      }

      const link = document.createElement('a')
      link.download = `lineup-${lineup.formationId}-${Date.now()}.${format}`
      link.href = dataUrl
      link.click()

      return dataUrl
    } catch (err) {
      setError(err.message)
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
