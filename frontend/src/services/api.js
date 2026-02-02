const API_BASE = import.meta.env.VITE_API_URL || '/api'
const SCRAPER_API = import.meta.env.VITE_SCRAPER_URL || 'http://localhost:5000/api'

async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export const api = {
  async getFormations() {
    return fetchWithTimeout(`${API_BASE}/formations`)
  },
  
  async getFormation(id, flipH = false, flipV = false) {
    const params = new URLSearchParams()
    if (flipH) params.append('flipH', 'true')
    if (flipV) params.append('flipV', 'true')
    return fetchWithTimeout(`${API_BASE}/formations/${id}?${params}`)
  },
  
  async searchPlayers({ query, club, nationality, league, position, page = 0, size = 20 }) {
    const params = new URLSearchParams()
    if (query) params.append('query', query)
    if (club) params.append('club', club)
    if (nationality) params.append('nationality', nationality)
    if (league) params.append('league', league)
    if (position) params.append('position', position)
    params.append('page', page.toString())
    params.append('size', size.toString())
    
    return fetchWithTimeout(`${API_BASE}/players/search?${params}`)
  },
  
  async getPlayer(id) {
    return fetchWithTimeout(`${API_BASE}/players/${id}`)
  },
  
  async getClubs() {
    return fetchWithTimeout(`${API_BASE}/players/clubs`)
  },
  
  async getNationalities() {
    return fetchWithTimeout(`${API_BASE}/players/nationalities`)
  },
  
  async getLeagues() {
    return fetchWithTimeout(`${API_BASE}/players/leagues`)
  },
  
  async prepareExport(lineup, settings, format = 'png') {
    return fetchWithTimeout(`${API_BASE}/lineup/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        formationId: lineup.formationId,
        players: lineup.players,
        settings,
        format
      })
    })
  },

  async getScrapableLeagues() {
    return fetchWithTimeout(`${SCRAPER_API}/leagues`, {}, 10000)
  },

  async getTeamsInLeague(leagueId) {
    return fetchWithTimeout(`${SCRAPER_API}/leagues/${leagueId}/teams`, {}, 15000)
  },

  async scrapeTeam(teamId, teamName, leagueId) {
    return fetchWithTimeout(`${SCRAPER_API}/teams/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        team_id: teamId,
        team_name: teamName,
        league_id: leagueId
      })
    }, 60000)
  },

  async clearScraperCache() {
    return fetchWithTimeout(`${SCRAPER_API}/cache/clear`, {
      method: 'POST'
    })
  }
}
