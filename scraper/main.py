#!/usr/bin/env python3
import argparse
import logging
import sys
from typing import List, Optional

from config import TRANSFERMARKT_LEAGUES, OUTPUT_DIR
from scraper import FootballScraper
from exporter import export_to_json, export_to_csv, export_combined, export_all_leagues


def setup_logging(verbose: bool = False) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("scraper.log", mode="w"),
        ]
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scrape football player data from Transfermarkt and FBref",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    
    parser.add_argument(
        "--league",
        type=str,
        help="Single league to scrape (e.g., premier-league)",
    )
    
    parser.add_argument(
        "--leagues",
        type=str,
        help="Comma-separated list of leagues to scrape",
    )
    
    parser.add_argument(
        "--no-fbref",
        action="store_true",
        help="Skip FBref position validation",
    )
    
    parser.add_argument(
        "--format",
        choices=["json", "csv", "both"],
        default="json",
        help="Output format (default: json)",
    )
    
    parser.add_argument(
        "--combined",
        action="store_true",
        help="Also export a combined file with all players",
    )
    
    parser.add_argument(
        "--test",
        action="store_true",
        help="Test mode: scrape only 2 clubs per league",
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose logging",
    )
    
    parser.add_argument(
        "--list-leagues",
        action="store_true",
        help="List available leagues and exit",
    )
    
    return parser.parse_args()


def get_target_leagues(args: argparse.Namespace) -> Optional[List[str]]:
    if args.league:
        return [args.league]
    elif args.leagues:
        return [l.strip() for l in args.leagues.split(",")]
    return None  # All leagues


def main() -> int:
    args = parse_args()
    
    # List leagues and exit
    if args.list_leagues:
        print("\nAvailable leagues:")
        print("-" * 40)
        for slug, config in TRANSFERMARKT_LEAGUES.items():
            print(f"  {slug:<20} {config['name']}")
        print()
        return 0
    
    setup_logging(args.verbose)
    logger = logging.getLogger(__name__)
    
    logger.info("=" * 60)
    logger.info("Football Player Scraper")
    logger.info("=" * 60)
    
    # Determine target leagues
    target_leagues = get_target_leagues(args)
    if target_leagues:
        # Validate league slugs
        for league in target_leagues:
            if league not in TRANSFERMARKT_LEAGUES:
                logger.error(f"Unknown league: {league}")
                logger.info(f"Available leagues: {', '.join(TRANSFERMARKT_LEAGUES.keys())}")
                return 1
        logger.info(f"Target leagues: {', '.join(target_leagues)}")
    else:
        logger.info("Target leagues: ALL")
    
    include_fbref = not args.no_fbref
    max_clubs = 2 if args.test else None
    
    if args.test:
        logger.info("Running in TEST mode (2 clubs per league)")
    
    # Run scraper
    all_players = {}
    
    with FootballScraper() as scraper:
        if target_leagues:
            for league_slug in target_leagues:
                try:
                    players = scraper.scrape_league(
                        league_slug,
                        include_fbref=include_fbref,
                        max_clubs=max_clubs,
                    )
                    all_players[league_slug] = players
                except Exception as e:
                    logger.error(f"Failed to scrape {league_slug}: {e}")
                    all_players[league_slug] = []
        else:
            all_players = scraper.scrape_all_leagues(
                include_fbref=include_fbref,
                leagues=target_leagues,
            )
    
    # Export results
    logger.info("-" * 60)
    logger.info("Exporting results...")
    
    exported_files = []
    
    if args.format in ("json", "both"):
        files = export_all_leagues(all_players, format="json")
        exported_files.extend(files)
    
    if args.format in ("csv", "both"):
        files = export_all_leagues(all_players, format="csv")
        exported_files.extend(files)
    
    if args.combined:
        combined_file = export_combined(all_players)
        exported_files.append(combined_file)
    
    # Summary
    total_players = sum(len(players) for players in all_players.values())
    
    logger.info("=" * 60)
    logger.info("SCRAPING COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Total leagues scraped: {len(all_players)}")
    logger.info(f"Total players collected: {total_players}")
    logger.info(f"Output directory: {OUTPUT_DIR}/")
    logger.info("Exported files:")
    for filepath in exported_files:
        logger.info(f"  - {filepath}")
    logger.info("=" * 60)
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
