from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from contextlib import asynccontextmanager

import models, schemas, auth
from database import engine, get_db, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # lock this down to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ─────────────────────────────────────────────────

@app.post("/register", response_model=schemas.TokenResponse)
async def register(data: schemas.RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).where(models.User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=data.email,
        hashed_password=auth.hash_password(data.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return {"access_token": auth.create_token(user.email), "token_type": "bearer"}


@app.post("/login", response_model=schemas.TokenResponse)
async def login(data: schemas.LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).where(models.User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not auth.verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"access_token": auth.create_token(user.email), "token_type": "bearer"}


# ── Profile ───────────────────────────────────────────────

@app.get("/profile", response_model=schemas.ProfileResponse)
async def get_profile(current_user=Depends(auth.get_current_user)):
    return current_user


@app.put("/profile", response_model=schemas.ProfileResponse)
async def update_profile(
    data: schemas.ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    if data.height is not None:
        current_user.height = data.height
    if data.body_type is not None:
        current_user.body_type = data.body_type
    if data.preferences is not None:
        current_user.preferences = data.preferences

    await db.commit()
    await db.refresh(current_user)
    return current_user