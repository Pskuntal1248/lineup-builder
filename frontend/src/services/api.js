const API_BASE = '/api'

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
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
  // Formations
  async getFormations() {
    return fetchWithTimeout(`${API_BASE}/formations`)
  },
  
  async getFormation(id, flipH = false, flipV = false) {
    const params = new URLSearchParams()
    if (flipH) params.append('flipH', 'true')
    if (flipV) params.append('flipV', 'true')
    return fetchWithTimeout(`${API_BASE}/formations/${id}?${params}`)
  },
  
  // Players
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
  
  // Export
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
  }
}
