#!/usr/bin/env python3
"""
Football Scraper API Server
Provides REST endpoints to scrape player data on-demand.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import uuid
from scraper import FootballScraper
from config import TRANSFERMARKT_LEAGUES

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Cache for scraped data (in-memory for simplicity)
team_cache = {}
teams_cache = {}  # Cache team lists per league


@app.route('/api/leagues', methods=['GET'])
def get_leagues():
    """Get list of available leagues."""
    leagues = [
        {"id": slug, "name": config["name"], "country": config["country"]}
        for slug, config in TRANSFERMARKT_LEAGUES.items()
    ]
    return jsonify({"leagues": leagues})


@app.route('/api/leagues/<league_id>/teams', methods=['GET'])
def get_teams(league_id):
    """Get list of teams in a league."""
    if league_id not in TRANSFERMARKT_LEAGUES:
        return jsonify({"error": "League not found"}), 404
    
    # Check cache
    if league_id in teams_cache:
        return jsonify(teams_cache[league_id])
    
    try:
        with FootballScraper() as scraper:
            league_config = TRANSFERMARKT_LEAGUES[league_id]
            clubs = scraper._get_league_clubs(league_config, league_config["name"])
            
            teams = [
                {
                    "id": club.name.lower().replace(" ", "-").replace(".", ""),
                    "name": club.name,
                    "squadUrl": club.squad_url
                }
                for club in clubs
            ]
            
        result = {
            "league": league_config["name"],
            "leagueId": league_id,
            "teams": teams
        }
        
        # Cache the result
        teams_cache[league_id] = result
            
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error fetching teams: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/teams/scrape', methods=['POST'])
def scrape_team():
    """Scrape players for a specific team."""
    data = request.get_json()
    
    team_id = data.get('team_id')
    team_name = data.get('team_name')
    league_id = data.get('league_id')
    
    if not team_id or not league_id:
        return jsonify({"success": False, "error": "team_id and league_id are required"}), 400
    
    # Find the team's squad URL from cache
    squad_url = None
    if league_id in teams_cache:
        for team in teams_cache[league_id].get('teams', []):
            if team['id'] == team_id:
                squad_url = team.get('squadUrl')
                team_name = team.get('name', team_name)
                break
    
    if not squad_url:
        # Need to fetch teams first
        try:
            with FootballScraper() as scraper:
                league_config = TRANSFERMARKT_LEAGUES[league_id]
                clubs = scraper._get_league_clubs(league_config, league_config["name"])
                
                for club in clubs:
                    club_id = club.name.lower().replace(" ", "-").replace(".", "")
                    if club_id == team_id:
                        squad_url = club.squad_url
                        team_name = club.name
                        break
        except Exception as e:
            return jsonify({"success": False, "error": f"Could not find team: {e}"}), 404
    
    if not squad_url:
        return jsonify({"success": False, "error": "Team not found"}), 404
    
    # Check cache first
    cache_key = f"{league_id}:{team_id}"
    if cache_key in team_cache:
        logger.info(f"Returning cached data for {team_name}")
        return jsonify({"success": True, **team_cache[cache_key]})
    
    league_name = TRANSFERMARKT_LEAGUES.get(league_id, {}).get('name', 'Unknown')
    
    try:
        logger.info(f"Scraping players for {team_name}...")
        
        with FootballScraper() as scraper:
            from models import Club
            
            club = Club(
                name=team_name,
                url=squad_url,
                league=league_name,
                squad_url=squad_url
            )
            
            raw_players = scraper._scrape_club_players(club)
            
            # Normalize players
            from normalizer import normalize_player
            players = []
            for i, raw in enumerate(raw_players):
                raw.league = league_name
                player = normalize_player(raw)
                if player:
                    # Convert to frontend format
                    player_dict = {
                        "id": str(uuid.uuid4()),
                        "name": player.name,
                        "displayName": player.display_name or player.name.split()[-1],
                        "positions": player.positions,
                        "club": player.club,
                        "nationality": player.nationality,
                        "number": player.number,
                        "age": player.age,
                        "photoUrl": player.photo_url
                    }
                    players.append(player_dict)
        
        result = {
            "team": team_name,
            "league": league_name,
            "playerCount": len(players),
            "players": players
        }
        
        # Cache the result
        team_cache[cache_key] = result
        
        logger.info(f"Scraped {len(players)} players for {team_name}")
        return jsonify({"success": True, **result})
        
    except Exception as e:
        logger.error(f"Error scraping team: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/cache/clear', methods=['POST'])
def clear_cache():
    """Clear the player cache."""
    team_cache.clear()
    teams_cache.clear()
    return jsonify({"message": "Cache cleared"})


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok"})


if __name__ == '__main__':
    print("Starting Football Scraper API on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
