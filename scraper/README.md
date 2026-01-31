# Football Player Scraper

A minimal, reliable web scraper for collecting football player data from Transfermarkt and FBref.

## Features

- **Modular Architecture**: Separate layers for fetching, parsing, normalizing, and exporting
- **Position Normalization**: All positions mapped to a fixed enum (GK, RB, RWB, CB, LB, LWB, DM, CM, AM, RW, LW, ST)
- **Polite Scraping**: Rate limiting, retry logic, and proper headers
- **Multi-Source Validation**: Merges data from Transfermarkt and FBref
- **Multiple Export Formats**: JSON and CSV output

## Data Collected

| Field | Description |
|-------|-------------|
| `id` | Unique player identifier |
| `name` | Full player name |
| `shortName` | Display name (e.g., "L. Messi") |
| `primaryPosition` | Main position (normalized) |
| `secondaryPositions` | Alternative positions |
| `club` | Current club |
| `league` | League name |
| `nationality` | Player nationality |
| `photoUrl` | Player photo URL (optional) |
| `source.transfermarktUrl` | Source profile URL |
| `source.fbrefUrl` | FBref profile URL (if matched) |

## Installation

```bash
cd scraper
pip install -r requirements.txt
```

## Usage

### Scrape All Leagues
```bash
python main.py
```

### Scrape Specific League
```bash
python main.py --league premier-league
```

### Scrape Multiple Leagues
```bash
python main.py --leagues premier-league,la-liga,bundesliga
```

### Test Mode (2 clubs per league)
```bash
python main.py --test --league premier-league
```

### Skip FBref Validation
```bash
python main.py --no-fbref
```

### Export as CSV
```bash
python main.py --format csv
```

### Export Both JSON and CSV
```bash
python main.py --format both --combined
```

### List Available Leagues
```bash
python main.py --list-leagues
```

## Output Schema

```json
{
  "league": "Premier League",
  "slug": "premier-league",
  "exportedAt": "2026-01-31T15:00:00Z",
  "playerCount": 520,
  "players": [
    {
      "id": "a1b2c3d4e5f6",
      "name": "Erling Braut Haaland",
      "shortName": "E. Haaland",
      "primaryPosition": "ST",
      "secondaryPositions": [],
      "club": "Manchester City",
      "league": "Premier League",
      "nationality": "Norway",
      "photoUrl": "https://...",
      "source": {
        "transfermarktUrl": "https://www.transfermarkt.com/...",
        "fbrefUrl": "https://fbref.com/..."
      }
    }
  ]
}
```

## Available Leagues

| Slug | League |
|------|--------|
| `premier-league` | Premier League (England) |
| `la-liga` | La Liga (Spain) |
| `bundesliga` | Bundesliga (Germany) |
| `serie-a` | Serie A (Italy) |
| `ligue-1` | Ligue 1 (France) |

## Position Mapping

| Normalized | Common Names |
|------------|--------------|
| GK | Goalkeeper, Keeper |
| RB | Right-back, Right Fullback |
| RWB | Right Wing-back |
| CB | Centre-back, Central Defender |
| LB | Left-back, Left Fullback |
| LWB | Left Wing-back |
| DM | Defensive Midfield, Holding Midfielder |
| CM | Central Midfield, Midfielder |
| AM | Attacking Midfield, Playmaker |
| RW | Right Winger, Right Midfield |
| LW | Left Winger, Left Midfield |
| ST | Striker, Centre-forward |

## Project Structure

```
scraper/
├── __init__.py          # Package init
├── main.py              # CLI entry point
├── config.py            # Configuration and constants
├── models.py            # Data models
├── fetcher.py           # HTTP fetcher with retry
├── normalizer.py        # Position normalization
├── exporter.py          # JSON/CSV export
├── scraper.py           # Main orchestration
├── parsers/
│   ├── __init__.py
│   ├── transfermarkt.py # Transfermarkt parser
│   └── fbref.py         # FBref parser
├── output/              # Generated output files
└── requirements.txt     # Dependencies
```

## Ethical Scraping Notes

- Requests are rate-limited (2 second delay between requests)
- Proper User-Agent headers are used
- Retry logic with exponential backoff
- Only public player data is collected
- No market values, advanced stats, or copyrighted assets

## License

For personal/educational use only. Respect the terms of service of the source websites.
