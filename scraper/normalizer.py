import logging
from typing import List, Optional, Tuple

from config import (
    VALID_POSITIONS,
    TRANSFERMARKT_POSITION_MAP,
    FBREF_POSITION_MAP,
)
from models import RawPlayerData, Player, PlayerSource
logger = logging.getLogger(__name__)
def normalize_position(position: str, source: str = "transfermarkt") -> Optional[str]:
    if not position:
        return None
    cleaned = position.strip().lower() 
    if cleaned.upper() in VALID_POSITIONS:
        return cleaned.upper()
    position_map = TRANSFERMARKT_POSITION_MAP if source == "transfermarkt" else FBREF_POSITION_MAP
    if cleaned in position_map:
        return position_map[cleaned]
    if source == "transfermarkt":
        for key, value in TRANSFERMARKT_POSITION_MAP.items():
            if key in cleaned or cleaned in key:
                logger.debug(f"Partial match: '{position}' -> '{value}'")
                return value
    
    logger.warning(f"Could not normalize position: '{position}' from {source}")
    return None


def normalize_positions(positions: List[str], source: str = "transfermarkt") -> Tuple[Optional[str], List[str]]:
    normalized = []
    
    for pos in positions:
        norm = normalize_position(pos, source)
        if norm and norm not in normalized:
            normalized.append(norm)
    
    if not normalized:
        return None, []
    
    primary = normalized[0]
    secondary = normalized[1:] if len(normalized) > 1 else []
    
    return primary, secondary


def derive_short_name(full_name: str) -> str:
    if not full_name:
        return ""
    
    parts = full_name.strip().split()
    
    if len(parts) == 1:
        return parts[0]
    
    # Handle suffixes like Jr, Jr., II, III
    suffixes = {"jr", "jr.", "ii", "iii", "iv", "sr", "sr."}
    
    # Get last name (excluding suffix)
    last_name_idx = -1
    if parts[-1].lower() in suffixes and len(parts) > 2:
        last_name = f"{parts[-2]} {parts[-1]}"
        first_initial = parts[0][0]
    else:
        last_name = parts[-1]
        first_initial = parts[0][0]
    
    return f"{first_initial}. {last_name}"


def normalize_player(raw: RawPlayerData, fbref_data: Optional[RawPlayerData] = None) -> Optional[Player]:
    # Normalize positions from Transfermarkt
    primary_pos, secondary_pos = normalize_positions(raw.positions, raw.source)
    
    # If FBref data available, use it to validate/enhance positions
    if fbref_data and fbref_data.positions:
        fbref_primary, fbref_secondary = normalize_positions(fbref_data.positions, "fbref")
        
        # Add FBref positions to secondary if different
        if fbref_primary and fbref_primary != primary_pos and fbref_primary not in secondary_pos:
            secondary_pos.append(fbref_primary)
        
        for pos in fbref_secondary:
            if pos != primary_pos and pos not in secondary_pos:
                secondary_pos.append(pos)
    
    # Handle missing primary position
    if not primary_pos:
        logger.warning(f"No valid position for player: {raw.name}")
        return None
    
    # Build source URLs
    source = PlayerSource(
        transfermarkt_url=raw.profile_url if raw.source == "transfermarkt" else None,
        fbref_url=fbref_data.profile_url if fbref_data else None,
    )
    
    return Player(
        name=raw.name,
        short_name=derive_short_name(raw.name),
        primary_position=primary_pos,
        secondary_positions=secondary_pos,
        club=raw.club,
        league=raw.league,
        nationality=raw.nationality or "Unknown",
        photo_url=raw.photo_url,
        source=source,
    )


def merge_player_data(
    tm_players: List[RawPlayerData],
    fbref_players: List[RawPlayerData],
) -> List[Player]:
    # Create lookup for FBref players by normalized name
    fbref_lookup = {}
    for player in fbref_players:
        key = _normalize_name_for_matching(player.name)
        fbref_lookup[key] = player
    
    normalized_players = []
    
    for tm_player in tm_players:
        key = _normalize_name_for_matching(tm_player.name)
        fbref_match = fbref_lookup.get(key)
        
        if fbref_match:
            logger.debug(f"Matched {tm_player.name} with FBref data")
        
        player = normalize_player(tm_player, fbref_match)
        if player:
            normalized_players.append(player)
    
    return normalized_players


def _normalize_name_for_matching(name: str) -> str:
    import unicodedata
    
    # Remove accents
    normalized = unicodedata.normalize('NFD', name)
    normalized = ''.join(c for c in normalized if unicodedata.category(c) != 'Mn')
    
    # Lowercase and remove special characters
    normalized = normalized.lower()
    normalized = ''.join(c for c in normalized if c.isalnum() or c.isspace())
    
    # Remove extra spaces
    normalized = ' '.join(normalized.split())
    
    return normalized
