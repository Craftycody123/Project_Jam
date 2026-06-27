from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from contextlib import asynccontextmanager
from models import user_models
import schemas, auth
from database import engine, get_db, Base

from models.garment_model import Garment
from models.recommendation_model import Recommendation
from models.feedback_model import Feedback

from routes.garments import router as garments_router
from routes.recommendations import router as recommendations_router
from routes.weather import router as weather_router
# ← feedback_router removed, all those endpoints are in recommendations_router now


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            print("✅ Database connected and tables created")
    except Exception as e:
        print(f"❌ DB connection failed: {e}")
    yield


app = FastAPI(title="OOTD API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://kaleidoscopic-gumdrop-0e2918.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ──────────────────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=schemas.TokenResponse)
async def register(data: schemas.RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(user_models.User).where(user_models.User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail={"error": "Email already registered", "status": 400})
    user = user_models.User(
        name=data.name,
        email=data.email,
        hashed_password=auth.hash_password(data.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = auth.create_token(user.email)
    return {"token": token, "user": user}


@app.post("/auth/login", response_model=schemas.TokenResponse)
async def login(data: schemas.LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(user_models.User).where(user_models.User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not auth.verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail={"error": "Invalid credentials", "status": 401})
    token = auth.create_token(user.email)
    return {"token": token, "user": user}


@app.get("/auth/me", response_model=schemas.ProfileResponse)
async def get_me(current_user=Depends(auth.get_current_user)):
    return current_user


# ── Profile ───────────────────────────────────────────────────────────────────

@app.get("/profile", response_model=schemas.ProfileResponse)
async def get_profile(current_user=Depends(auth.get_current_user)):
    return current_user


@app.put("/profile", response_model=schemas.ProfileResponse)
async def update_profile(
    data: schemas.ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    if data.name is not None:
        current_user.name = data.name
    if data.height is not None:
        current_user.height = data.height
    if data.body_type is not None:
        current_user.body_type = data.body_type
    if data.location is not None:
        current_user.location = data.location
    if data.preferences is not None:
        current_user.preferences = data.preferences
    await db.commit()
    await db.refresh(current_user)
    return current_user


# ── Wardrobe ──────────────────────────────────────────────────────────────────

app.include_router(garments_router)
app.include_router(recommendations_router)
app.include_router(weather_router)


@app.get("/")
def root():
    return {"message": "OOTD API is running"}