"""
Configuration and constants for the football player scraper.
"""

from typing import Dict, List

# Request settings
REQUEST_TIMEOUT = 30
REQUEST_DELAY = 2.0  # Polite delay between requests (seconds)
MAX_RETRIES = 3
RETRY_DELAY = 5.0

# HTTP Headers to mimic a browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

# Position normalization enum
VALID_POSITIONS = [
    "GK", "RB", "RWB", "CB", "LB", "LWB", 
    "DM", "CM", "AM", "RW", "LW", "ST"
]

# Transfermarkt position mappings
TRANSFERMARKT_POSITION_MAP: Dict[str, str] = {
    # Goalkeeper
    "goalkeeper": "GK",
    "keeper": "GK",
    # Defenders
    "centre-back": "CB",
    "central defender": "CB",
    "centre back": "CB",
    "defender": "CB",
    "right-back": "RB",
    "right back": "RB",
    "right fullback": "RB",
    "left-back": "LB",
    "left back": "LB",
    "left fullback": "LB",
    "right wing-back": "RWB",
    "right wingback": "RWB",
    "left wing-back": "LWB",
    "left wingback": "LWB",
    # Midfielders
    "defensive midfield": "DM",
    "defensive midfielder": "DM",
    "holding midfielder": "DM",
    "central midfield": "CM",
    "central midfielder": "CM",
    "midfielder": "CM",
    "attacking midfield": "AM",
    "attacking midfielder": "AM",
    "playmaker": "AM",
    "right midfield": "RW",
    "right midfielder": "RW",
    "left midfield": "LW",
    "left midfielder": "LW",
    # Wingers
    "right winger": "RW",
    "right wing": "RW",
    "left winger": "LW",
    "left wing": "LW",
    # Forwards
    "centre-forward": "ST",
    "centre forward": "ST",
    "center forward": "ST",
    "striker": "ST",
    "forward": "ST",
    "second striker": "ST",
}

# FBref position mappings
FBREF_POSITION_MAP: Dict[str, str] = {
    "GK": "GK",
    "DF": "CB",  # Generic defender defaults to CB
    "DF,MF": "DM",
    "MF,DF": "DM",
    "MF": "CM",
    "MF,FW": "AM",
    "FW,MF": "AM",
    "FW": "ST",
    # More specific
    "RB": "RB",
    "LB": "LB",
    "CB": "CB",
    "DM": "DM",
    "CM": "CM",
    "AM": "AM",
    "RW": "RW",
    "LW": "LW",
    "ST": "ST",
    "CF": "ST",
}

# League configurations for Transfermarkt
# Season ID: 2025 = 2025-26 season (updated Feb/Sept for transfer windows)
# Update Schedule:
#   - January/February: After winter transfer window closes
#   - September: After summer transfer window closes
# Next update: September 2026 (set CURRENT_SEASON to 2026 for 2026-27 season)
CURRENT_SEASON = 2025

TRANSFERMARKT_LEAGUES: Dict[str, Dict] = {
    "premier-league": {
        "name": "Premier League",
        "country": "England",
        "url": "https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1",
        "squad_url": f"https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1/plus/?saison_id={CURRENT_SEASON}",
    },
    "la-liga": {
        "name": "La Liga",
        "country": "Spain",
        "url": "https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1",
        "squad_url": f"https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1/plus/?saison_id={CURRENT_SEASON}",
    },
    "bundesliga": {
        "name": "Bundesliga",
        "country": "Germany",
        "url": "https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1",
        "squad_url": f"https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1/plus/?saison_id={CURRENT_SEASON}",
    },
    "serie-a": {
        "name": "Serie A",
        "country": "Italy",
        "url": "https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1",
        "squad_url": f"https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1/plus/?saison_id={CURRENT_SEASON}",
    },
    "ligue-1": {
        "name": "Ligue 1",
        "country": "France",
        "url": "https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1",
        "squad_url": f"https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1/plus/?saison_id={CURRENT_SEASON}",
    },
}

# FBref league URLs for validation
FBREF_LEAGUES: Dict[str, str] = {
    "premier-league": "https://fbref.com/en/comps/9/Premier-League-Stats",
    "la-liga": "https://fbref.com/en/comps/12/La-Liga-Stats",
    "bundesliga": "https://fbref.com/en/comps/20/Bundesliga-Stats",
    "serie-a": "https://fbref.com/en/comps/11/Serie-A-Stats",
    "ligue-1": "https://fbref.com/en/comps/13/Ligue-1-Stats",
}

# Output directory
OUTPUT_DIR = "output"
