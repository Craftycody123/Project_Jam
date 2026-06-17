from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Garment(Base):
    __tablename__ = "garments"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_url   = Column(String, nullable=False)
    public_id   = Column(String, nullable=False)       # Cloudinary public_id for deletion
    category    = Column(String, nullable=False)       # top / bottom / dress / outerwear
    color       = Column(String, nullable=False)
    fabric      = Column(String, nullable=False)       # light / medium / heavy
    style       = Column(String, nullable=False)       # casual / formal / party / sports
    tags        = Column(JSON, default=[])
    is_new      = Column(Boolean, default=True)
    times_worn  = Column(Integer, default=0)
    last_worn   = Column(DateTime, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    feedbacks       = relationship("Feedback", back_populates="garment")