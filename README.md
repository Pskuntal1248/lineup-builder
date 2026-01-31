# Lineup Generator

A fast, intuitive football lineup builder. Create professional-looking formation graphics in under 30 seconds.

![Lineup Generator](https://via.placeholder.com/800x400/2e7d32/ffffff?text=Lineup+Generator)

## Features

### Core Features
- **8 Predefined Formations**: 4-3-3, 4-2-3-1, 4-4-2, 3-5-2, 4-1-4-1, 5-3-2, 4-3-1-2, 3-4-3
- **Dynamic Formation Switching**: Change formations without losing players
- **Pitch Flip Support**: Horizontal & vertical flip
- **Drag-and-Drop**: Move and swap players naturally
- **Player Search**: Search by name, club, nationality, or position

### Visual Customization
- **4 Pitch Styles**: Grass, Dark, Light, Minimal
- **Custom Jersey Colors**: Preset colors + custom picker
- **Display Toggles**: Photos, names, numbers on/off
- **3 Export Ratios**: Square (Instagram), Portrait, Landscape

### Export
- **PNG Export**: High-quality image download
- **SVG Export**: Vector format for scaling
- **No Watermarks**: Clean exports by default
- **Optional Branding**: Toggle app branding

## Tech Stack

### Backend (Spring Boot)
- Java 17
- Spring Boot 3.2
- Caffeine Cache
- RESTful APIs

### Frontend (React)
- React 18
- Vite
- html-to-image (for exports)
- Pure CSS (no framework bloat)

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Players
- `GET /api/players/search` - Search players
  - Query params: `query`, `club`, `nationality`, `league`, `position`, `page`, `size`
- `GET /api/players/{id}` - Get player by ID
- `GET /api/players/clubs` - List all clubs
- `GET /api/players/nationalities` - List all nationalities
- `GET /api/players/leagues` - List all leagues

### Formations
- `GET /api/formations` - List all formations
- `GET /api/formations/{id}` - Get formation by ID
  - Query params: `flipH`, `flipV` (boolean)
- `GET /api/formations/category/{category}` - Get formations by category

### Export
- `POST /api/lineup/export` - Prepare export metadata
- `POST /api/lineup/export/svg` - Generate SVG server-side

## Project Structure

```
lineup-generator/
├── backend/
│   ├── src/main/java/com/lineupgenerator/
│   │   ├── config/          # Cache, CORS config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── model/           # Domain models
│   │   └── service/         # Business logic
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API client
│   │   └── styles/          # CSS files
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Design Principles

1. **Speed First**: Every interaction optimized for quick lineup creation
2. **One-Screen Builder**: No modals unless critical
3. **Zero Learning Curve**: Intuitive drag-and-drop
4. **Football-First**: Tactics > decoration
5. **No Feature Creep**: Essential features only

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close search modal |
| `Enter` | Select first search result |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use for personal or commercial projects.

---

Built with ⚽ for football fans everywhere.
