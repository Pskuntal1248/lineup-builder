import json
import csv
import os
import logging
from typing import List, Dict
from datetime import datetime

from models import Player
from config import OUTPUT_DIR

logger = logging.getLogger(__name__)


def ensure_output_dir() -> str:
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        logger.info(f"Created output directory: {OUTPUT_DIR}")
    return OUTPUT_DIR


def export_to_json(players: List[Player], league_slug: str, league_name: str) -> str:
   
    ensure_output_dir()
    
    filename = f"{league_slug}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    output = {
        "league": league_name,
        "slug": league_slug,
        "exportedAt": datetime.utcnow().isoformat() + "Z",
        "playerCount": len(players),
        "players": [p.to_dict() for p in players],
    }
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Exported {len(players)} players to {filepath}")
    return filepath


def export_to_csv(players: List[Player], league_slug: str) -> str:
    ensure_output_dir()
    
    filename = f"{league_slug}.csv"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    fieldnames = [
        "id", "name", "shortName", "primaryPosition", "secondaryPositions",
        "club", "league", "nationality", "photoUrl", 
        "transfermarktUrl", "fbrefUrl"
    ]
    
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for player in players:
            row = {
                "id": player.id,
                "name": player.name,
                "shortName": player.short_name,
                "primaryPosition": player.primary_position,
                "secondaryPositions": ",".join(player.secondary_positions),
                "club": player.club,
                "league": player.league,
                "nationality": player.nationality,
                "photoUrl": player.photo_url or "",
                "transfermarktUrl": player.source.transfermarkt_url or "",
                "fbrefUrl": player.source.fbref_url or "",
            }
            writer.writerow(row)
    
    logger.info(f"Exported {len(players)} players to {filepath}")
    return filepath


def export_all_leagues(all_players: Dict[str, List[Player]], format: str = "json") -> List[str]:
    from config import TRANSFERMARKT_LEAGUES
    
    exported_files = []
    
    for league_slug, players in all_players.items():
        league_config = TRANSFERMARKT_LEAGUES.get(league_slug, {})
        league_name = league_config.get("name", league_slug)
        
        if format == "json":
            filepath = export_to_json(players, league_slug, league_name)
        elif format == "csv":
            filepath = export_to_csv(players, league_slug)
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        exported_files.append(filepath)
    
    return exported_files


def export_combined(all_players: Dict[str, List[Player]]) -> str:
    ensure_output_dir()
    
    filepath = os.path.join(OUTPUT_DIR, "all-players.json")
    
    combined_players = []
    for players in all_players.values():
        combined_players.extend([p.to_dict() for p in players])
    
    output = {
        "exportedAt": datetime.utcnow().isoformat() + "Z",
        "totalPlayers": len(combined_players),
        "leagues": list(all_players.keys()),
        "players": combined_players,
    }
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Exported {len(combined_players)} total players to {filepath}")
    return filepath
