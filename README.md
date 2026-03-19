<div align="center">
  <img src="./frontend/public/icons.svg" alt="Sentinel Logo" width="100"/>
  <h1>Sentinel API Monitoring</h1>
  <p><strong>A modern, multi-tenant API monitoring platform built to track endpoint uptime, latency, and trigger instant alerts.</strong></p>
</div>

---

##  What is Sentinel?
Sentinel is a lightweight, startup-ready **Uptime and API Monitoring** dashboard. It functions similarly to Pingdom or UptimeRobot, allowing users to configure HTTP endpoints, set custom polling intervals, and track response times. If an endpoint fails (returns 4xx, 5xx, or times out), Sentinel dispatches real-time alerts via Webhooks, Email, Slack, or Discord.

##  The Tech Stack

### Backend (Core API)
The entire backend engine is completely asynchronous and built for high throughput.
- **FastAPI (Python)**: The core REST API framework used for blazingly fast request handling and automatic OpenAPI swagger docs.
- **PostgreSQL**: The primary relational database handling Users, Endpoints, Alerts, Profile Settings, and API Keys.
- **SQLAlchemy (ORM)**: Clean, structured database interactions with complex queries completely isolated per-user.
- **JWT (JSON Web Tokens)**: Secure authentication mechanism using PyJWT and bcrypt password hashing. Every single API route is protected behind strict `Depends(get_current_user)` multi-tenant locks.

### Background Workers (Polling Engine)
Monitoring infrastructure requires highly scalable background loops rather than blocking API calls.
- **Celery**: The distributed task queue that actually performs the HTTP GET/POST checks in the background.
- **Redis**: Functions as the lightning-fast message broker directly passing endpoint intervals to Celery workers.
- **Node.js (Notification Services)**: Standalone microservices running in the `app/services/notifications` folder, waiting to execute external API integrations like Resend (Emails) or Telegram/Discord Webhooks whenever Celery flags an endpoint as `DOWN`.

### Frontend (Client Application)
A beautiful, highly interactive Single Page Application (SPA).
- **React 18 + TypeScript**: Strictly typed logic ensuring bug-free implementations and robust component architectures.
- **Vite.js**: Ultra-fast hot module replacement and production bundling.
- **Tailwind CSS**: Utility-first CSS framework natively driving the modern, SaaS-like dashboard aesthetics.
- **Recharts**: Rendering the live Dashboard Uptime and Latency graphs seamlessly.
- **Lucide React**: The premium vector icon library used across sidebars, empty states, and status badges.
- **React Hot Toast**: Injecting beautiful corner-aligned success/error popups upon any interaction.
- **Axios API Interceptors**: Natively intercepts `401 Unauthorized` tokens and manages all Bearer logic.

---

## Key Features

### 1. Multi-Tenant Architecture & Auth
- **Sign up & Login**: Full JWT implementation. Your dashboard only shows *your* endpoints.
- **Protected Routing**: The React frontend prevents unauthorized access and kicks invalid tokens automatically to the login portal.

### 2. Live Automated Polling
- Endpoints are pinged strictly according to their `interval` (e.g., every 30s or 60s).
- The Dashboard, Endpoints table, and Alerts Navbar rely on implicit `setInterval()` background API loops to aggressively fetch updated statuses in real-time. If an endpoint crashes, your UI glows red automatically.

### 3. Startup-Level UX
- **Beautiful Loaders & Spinners**: Avoids layout shift and visual bugs.
- **Skeleton Dropdowns**: The Navbar contains a fully functional notifications bell that opens a dropdown of critical, unresolved alerts.
- **Client-Side Search**: Instantly filter massive endpoint lists by name, `UP`/`DOWN` status, and HTTP Method. 

### 4. Alerting & Notification Connectors
- **Global Thresholds**: Adjust how many milliseconds an endpoint must take before warning of latency, or how many consecutive check failures cause a `DOWN` state.
- **Integration Toggles**: Easily toggle Email Alerts (via Resend), Slack integrations, or Discord Webhooks directly from the Settings plane. 
- **API Key Factories**: Generate 16-bit cryptographically secure strings right from the UI to securely hook into external pipelines.

---

##  Local Quickstart

### 1. Clone & Database Setup
1. Define your Postgres Database URI in a `.env` file under `DATABASE_URL=postgresql://user:pass@localhost/sentinel`.
2. Run the database migrations to generate the tables:
   ```bash
   python migrate_db.py
   python migrate_settings.py
   python migrate_threshold.py
   ```

### 2. Start the Backend API
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start the Background Polling System
*(Ensure Redis is installed and running `redis-server` locally)*
```bash
celery -A app.tasks worker --loglevel=info
celery -A app.tasks beat --loglevel=info
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to sign in to your dashboard!

---
> **Built with precision.** Ready to scale for massive infrastructure targeted uptime monitoring.
