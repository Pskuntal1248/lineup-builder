# Player Data Update Schedule

The scraper collects player data from Transfermarkt and FBref. Update the data after each major transfer window.

## Update Schedule

| Date | Action | Config Change |
|------|--------|---------------|
| **Jan 2026** | Winter window update | `CURRENT_SEASON = 2025` (2025-26) |
| **Sep 2026** | Summer window update | `CURRENT_SEASON = 2026` (2026-27) |
| **Jan 2027** | Winter window update | `CURRENT_SEASON = 2026` (2026-27) |
| **Sep 2027** | Summer window update | `CURRENT_SEASON = 2027` (2027-28) |

## How to Update

### 1. Check Current Season

For summer updates (July-September), increment `CURRENT_SEASON` in `config.py`:

```python
# Change this for new season
CURRENT_SEASON = 2026  # 2026-27 season
```

### 2. Run the Scraper

```bash
cd scraper
python main.py --format both --combined
```

### 3. Update Backend Data

Copy the generated JSON to the backend:

```bash
cp output/all_players.json ../backend/src/main/resources/data/players.json
```

### 4. Restart Backend

```bash
cd ../backend
./mvnw spring-boot:run
```

## Quick Commands

```bash
# Full scrape (all 5 leagues, ~30 mins)
python main.py --format json --combined

# Test scrape (2 clubs per league, ~5 mins)
python main.py --test --format json

# Single league scrape
python main.py --league premier-league
```

## Notes

- Winter window: Updates existing squads (loans, purchases)
- Summer window: Major squad changes, new season data
- The `CURRENT_SEASON` value corresponds to the year the season *starts* (2025 = 2025-26 season)
