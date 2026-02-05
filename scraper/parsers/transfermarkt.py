
import logging
import re
from typing import List, Optional
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from models import RawPlayerData, Club
logger = logging.getLogger(__name__)
BASE_URL = "https://www.transfermarkt.com"
class TransfermarktParser:
    def parse_league_clubs(self, html: str, league_name: str) -> List[Club]:
        clubs = []
        soup = BeautifulSoup(html, "lxml")
        table = soup.find("table", class_="items")
        if not table:
            logger.warning("Could not find clubs table")
            return clubs 
        for row in table.find_all("tr", class_=["odd", "even"]):
            try:
                club_cell = row.find("td", class_="hauptlink")
                if not club_cell:
                    continue
                link = club_cell.find("a")
                if not link:
                    continue
                club_name = link.get_text(strip=True)
                club_url = urljoin(BASE_URL, link.get("href", ""))
                squad_url = self._convert_to_squad_url(club_url)
                
                clubs.append(Club(
                    name=club_name,
                    url=club_url,
                    league=league_name,
                    squad_url=squad_url,
                ))
                
            except Exception as e:
                logger.warning(f"Error parsing club row: {e}")
                continue
        
        logger.info(f"Found {len(clubs)} clubs in {league_name}")
        return clubs
    
    def _convert_to_squad_url(self, club_url: str) -> str:
        if "/startseite/" in club_url:
            return club_url.replace("/startseite/", "/kader/") + "/plus/1/saison_id/2025"
        return club_url
    
    def parse_squad_page(self, html: str, club: Club) -> List[RawPlayerData]:
        players = []
        soup = BeautifulSoup(html, "lxml")
        
        # Find players table
        table = soup.find("table", class_="items")
        if not table:
            logger.warning(f"Could not find players table for {club.name}")
            return players
        
        for row in table.find_all("tr", class_=["odd", "even"]):
            player = self._parse_player_row(row, club)
            if player:
                players.append(player)
        
        logger.info(f"Found {len(players)} players for {club.name}")
        return players
    
    def _parse_player_row(self, row, club: Club) -> Optional[RawPlayerData]:
        try:
            # Get player name and profile URL
            player_cell = row.find("td", class_="hauptlink")
            if not player_cell:
                return None
            
            link = player_cell.find("a")
            if not link:
                return None
            
            name = link.get_text(strip=True)
            profile_url = urljoin(BASE_URL, link.get("href", ""))
            
            # Get position
            position_cell = row.find_all("td")
            position = ""
            for cell in position_cell:
                cell_text = cell.get_text(strip=True)
                if self._is_position(cell_text):
                    position = cell_text
                    break
            
            # Get photo URL (optional)
            photo_url = None
            img = row.find("img", class_="bilderrahmen-fixed")
            if img:
                photo_url = img.get("data-src") or img.get("src")
            
            # Get nationality
            nationality = ""
            flag_img = row.find("img", class_="flaggenrahmen")
            if flag_img:
                nationality = flag_img.get("title", "")
            
            return RawPlayerData(
                name=name,
                positions=[position] if position else [],
                club=club.name,
                league=club.league,
                nationality=nationality,
                photo_url=photo_url,
                profile_url=profile_url,
                source="transfermarkt",
            )
            
        except Exception as e:
            logger.warning(f"Error parsing player row: {e}")
            return None
    
    def _is_position(self, text: str) -> bool:
        position_keywords = [
            "goalkeeper", "keeper", "back", "defender", "midfield",
            "winger", "wing", "forward", "striker", "attack"
        ]
        text_lower = text.lower()
        return any(kw in text_lower for kw in position_keywords)
    
    def parse_player_profile(self, html: str, profile_url: str) -> Optional[RawPlayerData]:
        soup = BeautifulSoup(html, "lxml")
        
        try:
            # Get player name
            name_header = soup.find("h1", class_="data-header__headline-wrapper")
            if not name_header:
                return None
            
            name = name_header.get_text(strip=True)
            # Remove jersey number if present
            name = re.sub(r'#\d+', '', name).strip()
            
            # Get positions
            positions = []
            position_div = soup.find("li", class_="data-header__label", string=re.compile(r"Position", re.I))
            if position_div:
                position_value = position_div.find_next_sibling("span") or position_div.find_next("span")
                if position_value:
                    positions.append(position_value.get_text(strip=True))
            
            # Alternative: find in info table
            info_table = soup.find("div", class_="info-table")
            if info_table:
                for row in info_table.find_all("span", class_="info-table__content"):
                    label = row.find_previous("span", class_="info-table__content--label")
                    if label and "position" in label.get_text(strip=True).lower():
                        positions.append(row.get_text(strip=True))
            
            # Get club
            club = ""
            club_span = soup.find("span", class_="data-header__club")
            if club_span:
                club_link = club_span.find("a")
                if club_link:
                    club = club_link.get_text(strip=True)
            
            # Get nationality
            nationality = ""
            nationality_img = soup.find("span", class_="data-header__content", attrs={"itemprop": "nationality"})
            if nationality_img:
                nationality = nationality_img.get_text(strip=True)
            
            # Get photo
            photo_url = None
            photo_div = soup.find("div", class_="data-header__profile-container")
            if photo_div:
                img = photo_div.find("img")
                if img:
                    photo_url = img.get("src")
            
            return RawPlayerData(
                name=name,
                positions=positions,
                club=club,
                league="",  # Will be set by caller
                nationality=nationality,
                photo_url=photo_url,
                profile_url=profile_url,
                source="transfermarkt",
            )
            
        except Exception as e:
            logger.error(f"Error parsing player profile: {e}")
            return None
