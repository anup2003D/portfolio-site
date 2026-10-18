# Anup Dutta — Portfolio Site

A full-stack, Among-Us-themed portfolio built with **React + Vite** (frontend) and **FastAPI + MongoDB** (backend).

🌐 **Live**: [https://anup2003D.github.io/portfolio-site/](https://anup2003D.github.io/portfolio-site/)

---

## 🏗️ Project Structure

```
portfolio-site/
├── frontend/                  # Vite + React app
│   ├── public/
│   │   ├── audio/             # Among_us_bgm.mp3, kill_sound.mp3, loading_sound.mp3
│   │   └── Anup_Dutta_New_Resume.pdf
│   ├── src/
│   │   ├── api/client.js      # Fetch wrapper (uses VITE_API_BASE_URL)
│   │   ├── components/        # Hero, Navigation, Projects, Contact, etc.
│   │   ├── context/
│   │   │   └── PortfolioContext.jsx  # Global data + fallback data
│   │   ├── App.jsx
│   │   └── index.css          # Design system (Orbitron / Space Grotesk)
│   ├── vite.config.js         # base: '/portfolio-site/' for GitHub Pages
│   └── .env.local             # VITE_API_BASE_URL (local override)
│
├── backend/                   # FastAPI + Motor (async MongoDB)
│   ├── main.py                # All routes
│   ├── models.py              # Pydantic models
│   └── config.py              # MongoDB connection (reads MONGO_URL)
│
└── README.md
```

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB running locally **or** a MongoDB Atlas connection string

---

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

The Vite dev server proxies `/api/*` requests to `http://localhost:8000` automatically.

If the backend is offline the site still works — it loads **fallback data** (defined in `PortfolioContext.jsx`) and shows a yellow dev-only toast.

#### Environment variables (frontend)

Create `frontend/.env.local` (git-ignored):

```env
# Override the API base URL in dev if your backend runs on a different port/host
VITE_API_BASE_URL=http://localhost:8000/api
```

Leave this file absent in production; the Vite proxy handles it automatically.

---

### Backend

```bash
# Activate the venv (Windows)
venv\Scripts\activate

# Install dependencies (first time)
pip install -r backend/requirements.txt

# Set env vars (Windows PowerShell)
$env:MONGO_URL    = "mongodb://localhost:27017"
$env:ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:5173"

# Run
cd backend
uvicorn main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

---

## 🌍 GitHub Pages Deployment

The frontend is deployed as a static site via the `gh-pages` action.

```bash
cd frontend
npm run build     # outputs to frontend/dist/
```

**Important:** `vite.config.js` has `base: '/portfolio-site/'` set — this ensures asset paths work correctly under `https://anup2003D.github.io/portfolio-site/`.

> If you rename the GitHub repo, update `base` in `vite.config.js` to match.

---

## 🔧 Environment Variables Reference

### Backend (`backend/.env` or shell)

| Variable | Default | Description |
|---|---|---|
| `MONGO_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | CORS allow-list (comma-separated). **Must include your GitHub Pages URL in production.** |

Example for production:
```bash
ALLOWED_ORIGINS=https://anup2003D.github.io,https://yourdomain.com
```

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` (proxied) | Full URL to the backend API in production |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary font | Orbitron (headings) |
| Body font | Space Grotesk |
| Accent | `#ff4655` (Emergency Red) |
| Background | `#000000` (Void Black) |
| Custom cursor | Among Us crewmate SVG |

All CSS variables live in `frontend/src/index.css` under `:root`.

---

## 📦 Key Features

- **Among Us theme** — animated crewmate cursor, kill overlay, starfield, BGM
- **Fallback data** — site works without a backend; uses static data defined in `PortfolioContext.jsx`
- **Mobile navigation** — full-screen slide-in drawer at ≤ 900px
- **Contact form** — tries the API, falls back to a `mailto:` pre-filled link if backend is offline
- **Scroll reveal** — Intersection Observer animations for all sections

---

## 📞 Contact

- **Email**: anupdutta03work@gmail.com
- **LinkedIn**: [anup-dutta-9198171b6](https://www.linkedin.com/in/anup-dutta-9198171b6/)
- **GitHub**: [anup2003D](https://github.com/anup2003D)

---

<div align="center">
  <strong>Built with ❤️ by Anup Dutta</strong><br>
  <em>AI Developer · Data Engineer · CS Grad, Kolkata</em>
</div>
