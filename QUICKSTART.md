# Lineup Generator - Full Stack Football Lineup Builder

## Quick Start

### Option 1: Run Frontend Only (Demo Mode)
The frontend works standalone with built-in sample players:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Option 2: Run Full Stack

Terminal 1 - Backend:
```bash
cd backend
./mvnw spring-boot:run
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

## What's Included

### Backend (Spring Boot)
- REST API for players, formations, and export
- 50+ sample players (real footballers)
- 8 formations with tactical positions
- Caffeine caching for performance
- CORS configured for local development

### Frontend (React + Vite)
- Drag-and-drop lineup builder
- Formation selector with tactical categories
- Player search with instant results
- Visual customization (pitch style, jersey colors)
- PNG/SVG export with aspect ratio options
- Pitch flip (horizontal/vertical)
- Responsive design

## Project Philosophy
- Build a lineup in <30 seconds
- No login required
- No unnecessary animations
- Football-first design
