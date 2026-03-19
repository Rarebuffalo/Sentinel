from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, endpoints, dashboard, alerts, settings
from app.database import engine, Base
from app.tasks import monitor_endpoints
import threading

#  CREATE APP ONLY ONCE
app = FastAPI(
    title="Sentinel API monitoring system"
)

# ADD CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # better than "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth.router)
app.include_router(endpoints.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)
app.include_router(settings.router)

# Background worker
threading.Thread(target=monitor_endpoints, daemon=True).start()