from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models.feedback_model import Feedback
from models.recommendation_model import Recommendation

router = APIRouter(prefix="/recommendations", tags=["Feedback"])


# ─── Request Schema ──────────────────────────────────────────────────────────

class FeedbackRequest(BaseModel):
    recommendation_id: int
    garment_id:        int
    feedback:          str    # "like" or "dislike"


# ─── POST /recommendations/feedback ─────────────────────────────────────────

@router.post("/feedback")
def submit_feedback(
    body:    FeedbackRequest,
    db:      Session = Depends(get_db),
    user_id: int     = 1
):
    if body.feedback not in ["like", "dislike"]:
        raise HTTPException(status_code=400, detail="Feedback must be 'like' or 'dislike'")

    # Check recommendation exists
    rec = db.query(Recommendation).filter(
        Recommendation.id      == body.recommendation_id,
        Recommendation.user_id == user_id
    ).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # Check if feedback already exists for this garment + recommendation
    existing = db.query(Feedback).filter(
        Feedback.recommendation_id == body.recommendation_id,
        Feedback.garment_id        == body.garment_id,
        Feedback.user_id           == user_id
    ).first()

    if existing:
        # Update existing feedback
        existing.feedback = body.feedback
        db.commit()
        return {"message": "Feedback updated", "feedback": body.feedback}

    # Create new feedback
    fb = Feedback(
        recommendation_id = body.recommendation_id,
        garment_id        = body.garment_id,
        user_id           = user_id,
        feedback          = body.feedback,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)

    return {
        "id":                fb.id,
        "recommendation_id": fb.recommendation_id,
        "garment_id":        fb.garment_id,
        "feedback":          fb.feedback,
        "created_at":        fb.created_at,
    }


# ─── GET /recommendations/feedback ──────────────────────────────────────────

@router.get("/feedback")
def get_feedback_history(
    db:      Session = Depends(get_db),
    user_id: int     = 1
):
    feedbacks = db.query(Feedback).filter(
        Feedback.user_id == user_id
    ).order_by(Feedback.created_at.desc()).all()

    return [
        {
            "id":                f.id,
            "recommendation_id": f.recommendation_id,
            "garment_id":        f.garment_id,
            "feedback":          f.feedback,
            "created_at":        f.created_at,
        }
        for f in feedbacks
    ]