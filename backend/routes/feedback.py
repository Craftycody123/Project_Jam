from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from database import get_db
from models.feedback_model import Feedback
from models.recommendation_model import Recommendation

router = APIRouter(prefix="/recommendations", tags=["Feedback"])


class FeedbackRequest(BaseModel):
    recommendation_id: int
    garment_id:        int
    feedback:          str    # "like" or "dislike"


# ─── POST /recommendations/feedback ─────────────────────────────────────────

@router.post("/feedback")
async def submit_feedback(
    body:    FeedbackRequest,
    db:      AsyncSession = Depends(get_db),
    user_id: int          = 1
):
    if body.feedback not in ["like", "dislike"]:
        raise HTTPException(status_code=400, detail="Feedback must be 'like' or 'dislike'")

    rec_result = await db.execute(
        select(Recommendation).where(
            Recommendation.id      == body.recommendation_id,
            Recommendation.user_id == user_id
        )
    )
    rec = rec_result.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    existing_result = await db.execute(
        select(Feedback).where(
            Feedback.recommendation_id == body.recommendation_id,
            Feedback.garment_id        == body.garment_id,
            Feedback.user_id           == user_id
        )
    )
    existing = existing_result.scalar_one_or_none()

    if existing:
        existing.feedback = body.feedback
        await db.commit()
        return {"message": "Feedback updated", "feedback": body.feedback}

    fb = Feedback(
        recommendation_id = body.recommendation_id,
        garment_id        = body.garment_id,
        user_id           = user_id,
        feedback          = body.feedback,
    )
    db.add(fb)
    await db.commit()
    await db.refresh(fb)

    return {
        "id":                fb.id,
        "recommendation_id": fb.recommendation_id,
        "garment_id":        fb.garment_id,
        "feedback":          fb.feedback,
        "created_at":        fb.created_at,
    }


# ─── GET /recommendations/feedback ──────────────────────────────────────────

@router.get("/feedback")
async def get_feedback_history(
    db:      AsyncSession = Depends(get_db),
    user_id: int          = 1
):
    result    = await db.execute(
        select(Feedback)
        .where(Feedback.user_id == user_id)
        .order_by(Feedback.created_at.desc())
    )
    feedbacks = result.scalars().all()

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