from sqlalchemy import Column, Integer, String, Float
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Profile fields
    height = Column(Float, nullable=True)        # in cm
    body_type = Column(String, nullable=True)    # e.g. "slim", "athletic", "curvy"
    preferences = Column(String, nullable=True)  # comma-separated or JSON string