# FootyBuilder Deployment Guide

Deploy FootyBuilder with **Frontend on Vercel** and **Backend on Render** (free tiers).

---

## 📋 Prerequisites

- GitHub account with repository pushed
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com

---

## 🖥️ Backend Deployment (Render)

### Step 1: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `footybuilder-api` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Instance Type** | `Free` |

### Step 2: Environment Variables

Add these environment variables in Render:

```
PORT=8080
RENDER_EXTERNAL_URL=https://your-service-name.onrender.com
```
*(Replace with your actual Render URL after first deploy)*

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (~3-5 minutes)
3. Copy your Render URL: `https://footybuilder-api.onrender.com`

### ⏰ Keep-Alive Feature

The backend pings itself every 5 minutes to prevent Render's free tier from sleeping.

- Set `RENDER_EXTERNAL_URL` to your Render service URL to enable

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 2: Environment Variables

Add this environment variable in Vercel:

```
VITE_API_URL=https://your-render-url.onrender.com/api
```

*(Replace `your-render-url` with your actual Render backend URL)*

### Step 3: Update vercel.json

Before deploying, update `frontend/vercel.json` with your Render URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-RENDER-URL.onrender.com/api/:path*"
    }
  ]
}
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~1-2 minutes)
3. Your app is live at: `https://your-project.vercel.app`

---

## 🔗 Quick Reference

### URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://footybuilder.vercel.app` |
| Backend | `https://footybuilder-api.onrender.com` |
| Health Check | `https://footybuilder-api.onrender.com/api/health` |

### Environment Variables Summary

**Render (Backend):**
```env
PORT=8080
RENDER_EXTERNAL_URL=https://footybuilder-api.onrender.com
```

**Vercel (Frontend):**
```env
VITE_API_URL=https://footybuilder-api.onrender.com/api
```

---

## 🐛 Troubleshooting

### Backend not responding?
- Render free tier sleeps after 15 min of inactivity
- First request may take 30-60 seconds to wake up
- Enable `KEEP_ALIVE_ENABLED=true` to prevent sleep

### CORS errors?
- Ensure `CORS_ALLOWED_ORIGINS=*` is set in Render
- Check browser console for specific error messages

### API calls failing?
- Verify `VITE_API_URL` in Vercel matches your Render URL
- Check Render logs for backend errors
- Test health endpoint: `curl https://your-api.onrender.com/api/health`

### Build failing?
- **Render**: Check Docker build logs, ensure `backend/Dockerfile` exists
- **Vercel**: Check Node version, ensure dependencies are installed

---

## 📊 Monitoring

### Health Check Endpoint
```bash
curl https://your-api.onrender.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-02T12:00:00Z",
  "uptime": "3600s"
}
```

### Render Dashboard
- View logs: Render Dashboard → Your Service → Logs
- View metrics: Render Dashboard → Your Service → Metrics

### Vercel Dashboard
- View deployments: Vercel Dashboard → Your Project → Deployments
- View analytics: Vercel Dashboard → Your Project → Analytics

---

## 🔄 Redeployment

### Automatic
Both Vercel and Render auto-deploy when you push to `main` branch.

### Manual
- **Vercel**: Dashboard → Project → Deployments → Redeploy
- **Render**: Dashboard → Service → Manual Deploy → Deploy latest commit

---

## 💡 Tips

1. **Custom Domain**: Both Vercel and Render support custom domains (free)
2. **Upgrade**: Consider paid tiers for always-on backend (~$7/month on Render)
3. **Caching**: Backend uses Caffeine cache for player data (1 hour TTL)
4. **Cold Starts**: First load after sleep takes ~30-60 seconds

---

Made with ⚽ by FootyBuilder
