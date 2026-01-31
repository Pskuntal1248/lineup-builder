# Lineup Generator

A fast, intuitive football lineup builder. Create professional-looking formation graphics in under 30 seconds.

## Features

- **30+ Tactical Formations** - From classic 4-4-2 to modern 3-4-2-1
- **3,788 Real Players** - Search from top 5 European leagues
- **Drag-and-Drop** - Move and swap players naturally
- **Custom Styling** - Jersey colors, pitch styles, display options
- **Export** - PNG/JPEG in square, portrait, or landscape

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Java 21, Spring Boot 3.2.2 |
| Frontend | React 18, Vite 5, Tailwind CSS v4 |
| UI | Radix UI Components |
| Hosting | Render (API), Vercel (Frontend) |

## Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/lineup-generator.git
cd lineup-generator

# Start everything
chmod +x start.sh
./start.sh
```

Or manually:

```bash
# Terminal 1 - Backend
cd backend && ./mvnw spring-boot:run

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```

Open `http://localhost:5173`

## Deployment

### Backend → Render

1. Create new **Web Service** on [Render](https://render.com)
2. Connect GitHub repo
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Docker
4. Add environment variables:
   - `CORS_ALLOWED_ORIGINS`: `https://your-app.vercel.app`
   - `LOG_LEVEL`: `INFO`

See [backend/README.md](backend/README.md) for details.

### Frontend → Vercel

1. Import project on [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
3. Add environment variable:
   - `VITE_API_URL`: `https://your-api.onrender.com/api`

See [frontend/README.md](frontend/README.md) for details.

## Project Structure

```
lineup-generator/
├── backend/               # Spring Boot API
│   ├── src/main/java/
│   ├── Dockerfile
│   └── README.md
├── frontend/              # React SPA
│   ├── src/
│   ├── vercel.json
│   └── README.md
├── render.yaml            # Render IaC config
└── start.sh               # Local dev script
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players/search` | Search players |
| GET | `/api/formations` | List formations |
| POST | `/api/export` | Prepare export |

## License

MIT
