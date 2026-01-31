import { useEffect } from 'react'
import './TeamSelector.css'

function TeamSelector({ 
  leagues, 
  teams, 
  selectedLeague, 
  selectedTeam,
  scrapedPlayers,
  loading, 
  error, 
  scrapeStatus,
  onFetchLeagues,
  onSelectLeague, 
  onSelectTeam,
  onClose 
}) {
  useEffect(() => {
    if (leagues.length === 0) {
      onFetchLeagues()
    }
  }, [leagues.length, onFetchLeagues])

  const handleLeagueChange = (e) => {
    const leagueId = e.target.value
    if (leagueId) {
      onSelectLeague(leagueId)
    }
  }

  const handleTeamClick = (team) => {
    onSelectTeam(team.id, team.name, selectedLeague)
  }

  return (
    <div className="team-selector-overlay">
      <div className="team-selector-modal">
        <div className="team-selector-header">
          <h2>Select a Team to Scrape</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="team-selector-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="league-select">
            <label htmlFor="league">Select League:</label>
            <select 
              id="league" 
              value={selectedLeague || ''} 
              onChange={handleLeagueChange}
              disabled={loading}
            >
              <option value="">-- Choose a league --</option>
              {leagues.map(league => (
                <option key={league.id} value={league.id}>
                  {league.name} ({league.country})
                </option>
              ))}
            </select>
          </div>

          {loading && !teams.length && (
            <div className="loading">Loading...</div>
          )}

          {teams.length > 0 && (
            <div className="teams-grid">
              <h3>Teams in League</h3>
              <div className="teams-list">
                {teams.map(team => (
                  <button
                    key={team.id}
                    className={`team-btn ${selectedTeam?.id === team.id ? 'selected' : ''}`}
                    onClick={() => handleTeamClick(team)}
                    disabled={loading}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && teams.length > 0 && (
            <div className="scraping-status">
              <div className="spinner"></div>
              <span>{scrapeStatus || 'Scraping players from Transfermarkt...'}</span>
            </div>
          )}

          {scrapedPlayers.length > 0 && !loading && (
            <div className="scrape-result">
              <h3>✓ {scrapedPlayers.length} Players Loaded</h3>
              <p>Players from {selectedTeam?.name} are now available for search!</p>
              <button className="done-btn" onClick={onClose}>
                Start Building Lineup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamSelector
