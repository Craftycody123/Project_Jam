from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    height: Optional[float] = None
    body_type: Optional[str] = None
    preferences: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    email: str
    height: Optional[float]
    body_type: Optional[str]
    preferences: Optional[str]

    model_config = {"from_attributes": True}

class TokenResponse(BaseModel):
    access_token: str
    token_type: str