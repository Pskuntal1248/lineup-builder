import logging
from typing import List, Dict, Optional

from config import TRANSFERMARKT_LEAGUES, FBREF_LEAGUES
from fetcher import Fetcher
from parsers import TransfermarktParser, FBrefParser
from normalizer import merge_player_data
from models import Player, RawPlayerData, Club

logger = logging.getLogger(__name__)


class FootballScraper:
    def __init__(self, fetcher: Optional[Fetcher] = None):
        self.fetcher = fetcher or Fetcher()
        self.tm_parser = TransfermarktParser()
        self.fbref_parser = FBrefParser()
    
    def scrape_league(
        self, 
        league_slug: str, 
        include_fbref: bool = True,
        max_clubs: Optional[int] = None,
    ) -> List[Player]:
        league_config = TRANSFERMARKT_LEAGUES.get(league_slug)
        if not league_config:
            logger.error(f"Unknown league: {league_slug}")
            return []
        
        league_name = league_config["name"]
        logger.info(f"Starting scrape for {league_name}")
        
        # Step 1: Get clubs from Transfermarkt
        clubs = self._get_league_clubs(league_config, league_name)
        
        if max_clubs:
            clubs = clubs[:max_clubs]
            logger.info(f"Limited to {max_clubs} clubs for testing")
        
        # Step 2: Scrape players from each club
        tm_players = []
        for club in clubs:
            players = self._scrape_club_players(club)
            tm_players.extend(players)
        
        logger.info(f"Scraped {len(tm_players)} players from Transfermarkt")
        
        # Step 3: Get FBref data for validation (optional)
        fbref_players = []
        if include_fbref:
            fbref_players = self._get_fbref_players(league_slug, league_name)
            logger.info(f"Got {len(fbref_players)} players from FBref")
        
        # Step 4: Merge and normalize data
        normalized = merge_player_data(tm_players, fbref_players)
        
        # Set league name on all players
        for player in normalized:
            player.league = league_name
        
        logger.info(f"Normalized {len(normalized)} players for {league_name}")
        return normalized
    
    def _get_league_clubs(self, league_config: Dict, league_name: str) -> List[Club]:
        url = league_config.get("squad_url") or league_config["url"]
        
        html = self.fetcher.fetch(url)
        if not html:
            logger.error(f"Failed to fetch league page: {url}")
            return []
        
        return self.tm_parser.parse_league_clubs(html, league_name)
    
    def _scrape_club_players(self, club: Club) -> List[RawPlayerData]:
        if not club.squad_url:
            logger.warning(f"No squad URL for {club.name}")
            return []
        
        html = self.fetcher.fetch(club.squad_url)
        if not html:
            logger.warning(f"Failed to fetch squad page for {club.name}")
            return []
        
        return self.tm_parser.parse_squad_page(html, club)
    
    def _get_fbref_players(self, league_slug: str, league_name: str) -> List[RawPlayerData]:
        url = FBREF_LEAGUES.get(league_slug)
        if not url:
            logger.warning(f"No FBref URL configured for {league_slug}")
            return []
        
        html = self.fetcher.fetch(url)
        if not html:
            logger.warning(f"Failed to fetch FBref page: {url}")
            return []
        
        return self.fbref_parser.parse_league_players(html, league_name)
    
    def scrape_all_leagues(
        self, 
        include_fbref: bool = True,
        leagues: Optional[List[str]] = None,
    ) -> Dict[str, List[Player]]:
        target_leagues = leagues or list(TRANSFERMARKT_LEAGUES.keys())
        
        all_players = {}
        
        for league_slug in target_leagues:
            try:
                players = self.scrape_league(league_slug, include_fbref)
                all_players[league_slug] = players
            except Exception as e:
                logger.error(f"Error scraping {league_slug}: {e}")
                all_players[league_slug] = []
        
        return all_players
    
    def close(self):
        self.fetcher.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
