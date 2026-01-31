"""
Data models for the football player scraper.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional, Dict
import hashlib
import json


@dataclass
class PlayerSource:
    """Source URLs for a player."""
    transfermarkt_url: Optional[str] = None
    fbref_url: Optional[str] = None
    
    def to_dict(self) -> Dict:
        return {
            "transfermarktUrl": self.transfermarkt_url,
            "fbrefUrl": self.fbref_url,
        }


@dataclass
class Player:
    """Player data model matching the required output schema."""
    name: str
    short_name: str
    primary_position: str
    club: str
    league: str
    nationality: str
    secondary_positions: List[str] = field(default_factory=list)
    photo_url: Optional[str] = None
    source: PlayerSource = field(default_factory=PlayerSource)
    id: str = ""
    
    def __post_init__(self):
        """Generate unique ID after initialization."""
        if not self.id:
            self.id = self._generate_id()
    
    def _generate_id(self) -> str:
        """Generate a unique ID based on player name and club."""
        unique_str = f"{self.name.lower()}_{self.club.lower()}_{self.league.lower()}"
        return hashlib.md5(unique_str.encode()).hexdigest()[:12]
    
    def to_dict(self) -> Dict:
        """Convert to dictionary matching the output schema."""
        return {
            "id": self.id,
            "name": self.name,
            "shortName": self.short_name,
            "primaryPosition": self.primary_position,
            "secondaryPositions": self.secondary_positions,
            "club": self.club,
            "league": self.league,
            "nationality": self.nationality,
            "photoUrl": self.photo_url,
            "source": self.source.to_dict(),
        }
    
    def to_json(self) -> str:
        """Convert to JSON string."""
        return json.dumps(self.to_dict(), indent=2)


@dataclass
class Club:
    """Club data model for scraping squad pages."""
    name: str
    url: str
    league: str
    squad_url: Optional[str] = None


@dataclass 
class RawPlayerData:
    """Raw scraped player data before normalization."""
    name: str
    positions: List[str]
    club: str
    league: str
    nationality: str = ""
    photo_url: Optional[str] = None
    profile_url: Optional[str] = None
    source: str = "unknown"  # "transfermarkt" or "fbref"
