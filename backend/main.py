from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import models so Alembic/SQLAlchemy picks them up
from models.garment_model import Garment
from models.recommendation_model import Recommendation
from models.feedback_model import Feedback

# Import routers
from routes.garments import router as garments_router
from routes.recommendations import router as recommendations_router
from routes.feedback import router as feedback_router
from routes.weather import router as weather_router

# Create tables (for dev only — use Alembic migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="OOTD API", version="1.0.0")

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(garments_router)
app.include_router(recommendations_router)
app.include_router(feedback_router)
app.include_router(weather_router)


@app.get("/")
def root():
    return {"message": "OOTD API is running"}