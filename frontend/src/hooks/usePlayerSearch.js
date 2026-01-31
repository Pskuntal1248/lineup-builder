import { useState, useCallback } from 'react'
import { api } from '../services/api'

export function usePlayerSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await api.searchPlayers(params)
      setResults(data.items || [])
      return data
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return { results, loading, error, search, clearResults }
}
