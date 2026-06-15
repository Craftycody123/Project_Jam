from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    height = Column(Float, nullable=True)
    body_type = Column(String, nullable=True)
    location = Column(String, nullable=True)
    preferences = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())