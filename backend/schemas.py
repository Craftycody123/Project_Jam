from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    height: Optional[float] = None
    body_type: Optional[str] = None
    location: Optional[str] = None
    preferences: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    name: Optional[str]
    email: str
    height: Optional[float]
    body_type: Optional[str]
    location: Optional[str]
    preferences: Optional[str]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}

class TokenResponse(BaseModel):
    token: str
    user: ProfileResponse