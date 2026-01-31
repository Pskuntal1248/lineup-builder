"""
Parser for FBref player data (secondary validation source).
"""

import logging
import re
from typing import List, Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from models import RawPlayerData

logger = logging.getLogger(__name__)

BASE_URL = "https://fbref.com"


class FBrefParser:
    """Parser for FBref HTML pages."""
    
    def parse_league_players(self, html: str, league_name: str) -> List[RawPlayerData]:
        """
        Parse players from a league stats page.
        
        FBref shows all players in a league on one page in a stats table.
        
        Args:
            html: HTML content of the league stats page
            league_name: Name of the league
            
        Returns:
            List of RawPlayerData objects
        """
        players = []
        soup = BeautifulSoup(html, "lxml")
        
        # Find the standard stats table
        table = soup.find("table", id=re.compile(r"stats_standard"))
        if not table:
            # Try alternative table IDs
            table = soup.find("table", class_="stats_table")
        
        if not table:
            logger.warning(f"Could not find stats table for {league_name}")
            return players
        
        tbody = table.find("tbody")
        if not tbody:
            return players
        
        for row in tbody.find_all("tr"):
            # Skip header rows
            if row.find("th", scope="col"):
                continue
            
            player = self._parse_player_row(row, league_name)
            if player:
                players.append(player)
        
        logger.info(f"Found {len(players)} players from FBref for {league_name}")
        return players
    
    def _parse_player_row(self, row, league_name: str) -> Optional[RawPlayerData]:
        """Parse a single player row from the stats table."""
        try:
            # Get player name
            player_cell = row.find("th", {"data-stat": "player"})
            if not player_cell:
                player_cell = row.find("td", {"data-stat": "player"})
            
            if not player_cell:
                return None
            
            link = player_cell.find("a")
            name = link.get_text(strip=True) if link else player_cell.get_text(strip=True)
            
            if not name:
                return None
            
            profile_url = None
            if link:
                profile_url = urljoin(BASE_URL, link.get("href", ""))
            
            # Get position
            position = ""
            pos_cell = row.find("td", {"data-stat": "position"})
            if pos_cell:
                position = pos_cell.get_text(strip=True)
            
            # Parse multiple positions (FBref uses comma separation like "MF,FW")
            positions = [p.strip() for p in position.split(",")] if position else []
            
            # Get team
            team = ""
            team_cell = row.find("td", {"data-stat": "team"})
            if team_cell:
                team_link = team_cell.find("a")
                team = team_link.get_text(strip=True) if team_link else team_cell.get_text(strip=True)
            
            # Get nationality (FBref shows country code)
            nationality = ""
            nation_cell = row.find("td", {"data-stat": "nationality"})
            if nation_cell:
                # FBref uses flag images with title
                flag_span = nation_cell.find("span", class_=re.compile(r"f-"))
                if flag_span:
                    nationality = flag_span.get("title", "")
                else:
                    nationality = nation_cell.get_text(strip=True)
            
            return RawPlayerData(
                name=name,
                positions=positions,
                club=team,
                league=league_name,
                nationality=nationality,
                profile_url=profile_url,
                source="fbref",
            )
            
        except Exception as e:
            logger.warning(f"Error parsing FBref player row: {e}")
            return None
    
    def parse_player_profile(self, html: str, profile_url: str) -> Optional[RawPlayerData]:
        """
        Parse detailed player data from FBref profile page.
        
        This provides additional position validation.
        
        Args:
            html: HTML content of the player profile
            profile_url: URL of the profile
            
        Returns:
            RawPlayerData with position information
        """
        soup = BeautifulSoup(html, "lxml")
        
        try:
            # Get player name
            name_h1 = soup.find("h1")
            if not name_h1:
                return None
            
            name_span = name_h1.find("span")
            name = name_span.get_text(strip=True) if name_span else name_h1.get_text(strip=True)
            
            # Get position from meta info
            positions = []
            meta_div = soup.find("div", id="meta")
            if meta_div:
                for p in meta_div.find_all("p"):
                    text = p.get_text(strip=True)
                    if "Position:" in text:
                        pos_text = text.replace("Position:", "").strip()
                        # Handle format like "Position: FW-ST, MF-AM"
                        pos_parts = re.split(r'[,▸]', pos_text)
                        for part in pos_parts:
                            # Extract position codes
                            codes = re.findall(r'\b([A-Z]{2,3})\b', part)
                            positions.extend(codes)
            
            # Get team
            team = ""
            team_link = soup.find("a", href=re.compile(r"/squads/"))
            if team_link:
                team = team_link.get_text(strip=True)
            
            return RawPlayerData(
                name=name,
                positions=positions,
                club=team,
                league="",
                profile_url=profile_url,
                source="fbref",
            )
            
        except Exception as e:
            logger.error(f"Error parsing FBref player profile: {e}")
            return None
