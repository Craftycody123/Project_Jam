from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id                = Column(Integer, primary_key=True, index=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id"), nullable=True)  # ← nullable now
    user_id           = Column(Integer, ForeignKey("users.id"), nullable=False)
    garment_id        = Column(Integer, ForeignKey("garments.id"), nullable=False)
    feedback          = Column(String, nullable=False)
    created_at        = Column(DateTime, default=datetime.utcnow)

    user           = relationship("User", back_populates="feedbacks")
    recommendation = relationship("Recommendation", back_populates="feedbacks")
    garment        = relationship("Garment", back_populates="feedbacks")