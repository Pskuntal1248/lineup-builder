# Lineup Generator Frontend

React application for creating football/soccer lineups with drag-and-drop functionality.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS v4
- Radix UI Components
## Local Development

```bash
npm install

npm run dev
```
Open `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Method 2: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Environment Variables

Add in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── Pitch.jsx       # Football pitch with positions
│   │   ├── PlayerNode.jsx  # Individual player display
│   │   ├── PlayerSearch.jsx # Player search modal
│   │   ├── Sidebar.jsx     # Settings panel
│   │   └── Toolbar.jsx     # Top navigation
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API client
│   └── styles/         # Global CSS
├── index.html
├── package.json
└── vite.config.js
```

## Features

- 30+ tactical formations
- Drag-and-drop player positioning
- Custom jersey colors
- Multiple pitch styles
- Export as PNG/JPEG
- Responsive design
