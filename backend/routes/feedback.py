from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import auth
from database import get_db
from models.feedback_model import Feedback
from models.recommendation_model import Recommendation
from models.garment_model import Garment
router = APIRouter(prefix="/recommendations", tags=["Feedback"])


class FeedbackRequest(BaseModel):
    recommendation_id: int
    
    feedback:          str    # "like" or "dislike"


# ─── POST /recommendations/feedback ─────────────────────────────────────────

@router.post("/feedback")
async def submit_feedback(
    body: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    if body.feedback not in ["like", "dislike"]:
        raise HTTPException(
            status_code=400,
            detail="Feedback must be 'like' or 'dislike'"
        )

    # Verify recommendation belongs to current user
    rec_result = await db.execute(
        select(Recommendation).where(
            Recommendation.id == body.recommendation_id,
            Recommendation.user_id == current_user.id
        )
    )

    rec = rec_result.scalar_one_or_none()

    if not rec:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found"
        )
    

    

    
    for garment_id in rec.recommended_items:

        existing_result = await db.execute(
                select(Feedback).where(
                Feedback.recommendation_id == body.recommendation_id,
                Feedback.garment_id == garment_id,
                Feedback.user_id == current_user.id,
            )
        )

        existing = existing_result.scalar_one_or_none()

        if existing:
             existing.feedback = body.feedback
        else:
             fb = Feedback(
            recommendation_id=body.recommendation_id,
            garment_id=garment_id,
            user_id=current_user.id,
            feedback=body.feedback,
        )
        db.add(fb)

    await db.commit()

    return {
    "success": True,
    "message": "Feedback saved successfully",
}
# ─── GET /recommendations/feedback ──────────────────────────────────────────

@router.get("/feedback")
async def get_feedback_history(
    db:      AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):

    result    = await db.execute(
        select(Feedback)
        .where(Feedback.user_id == current_user.id)
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