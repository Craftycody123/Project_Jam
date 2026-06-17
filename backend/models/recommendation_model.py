from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id                 = Column(Integer, primary_key=True, index=True)
    user_id            = Column(Integer, ForeignKey("users.id"), nullable=False)
    recommended_items  = Column(JSON, default=[])      # list of garment ids
    occasion           = Column(String, nullable=False)
    weather            = Column(String, nullable=False)
    created_at         = Column(DateTime, default=datetime.utcnow)

    feedbacks = relationship("Feedback", back_populates="recommendation")