import { useState, useCallback } from 'react'
import api from '../services/api'

export function useTeamScraper() {
  const [leagues, setLeagues] = useState([])
  const [teams, setTeams] = useState([])
  const [scrapedPlayers, setScrapedPlayers] = useState([])
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scrapeStatus, setScrapeStatus] = useState(null)

  const fetchLeagues = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getScrapableLeagues()
      setLeagues(data.leagues || [])
    } catch (err) {
      setError('Failed to load leagues. Make sure the scraper API is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTeams = useCallback(async (leagueId) => {
    if (!leagueId) return
    
    setLoading(true)
    setError(null)
    setTeams([])
    setSelectedTeam(null)
    setScrapedPlayers([])
    
    try {
      const data = await api.getTeamsInLeague(leagueId)
      setTeams(data.teams || [])
      setSelectedLeague(leagueId)
    } catch (err) {
      setError('Failed to load teams. The league may not be available.')
    } finally {
      setLoading(false)
    }
  }, [])

  const scrapeTeam = useCallback(async (teamId, teamName, leagueId) => {
    setLoading(true)
    setError(null)
    setScrapeStatus('Scraping players...')
    setScrapedPlayers([])
    
    try {
      const data = await api.scrapeTeam(teamId, teamName, leagueId || selectedLeague)
      
      if (data.success) {
        setScrapedPlayers(data.players || [])
        setSelectedTeam({ id: teamId, name: teamName })
        setScrapeStatus(`Found ${data.players?.length || 0} players`)
      } else {
        setError(data.error || 'Failed to scrape team')
        setScrapeStatus(null)
      }
    } catch (err) {
      setError('Failed to scrape team. Please try again.')
      setScrapeStatus(null)
    } finally {
      setLoading(false)
    }
  }, [selectedLeague])

  const clearCache = useCallback(async () => {
    try {
      await api.clearScraperCache()
      setScrapedPlayers([])
      setScrapeStatus('Cache cleared')
    } catch (err) {
    }
  }, [])

  const reset = useCallback(() => {
    setTeams([])
    setScrapedPlayers([])
    setSelectedLeague(null)
    setSelectedTeam(null)
    setScrapeStatus(null)
    setError(null)
  }, [])

  return {
    leagues,
    teams,
    scrapedPlayers,
    selectedLeague,
    selectedTeam,
    loading,
    error,
    scrapeStatus,
    fetchLeagues,
    fetchTeams,
    scrapeTeam,
    clearCache,
    reset
  }
}

export default useTeamScraper
