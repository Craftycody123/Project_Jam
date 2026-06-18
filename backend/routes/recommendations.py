from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import auth
from database import get_db
from models.garment_model import Garment
from models.recommendation_model import Recommendation
from models.feedback_model import Feedback
from services.recommendation_engine import generate_recommendation

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


class GenerateRequest(BaseModel):
    occasion: str
    weather:  str


# ─── POST /recommendations/generate ─────────────────────────────────────────

@router.post("/generate")
async def generate(
    body:    GenerateRequest,
    db:      AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    result   = await db.execute(select(Garment).where(Garment.user_id == current_user.id))
    garments = result.scalars().all()

    if not garments:
        raise HTTPException(status_code=404, detail="No garments in wardrobe")

    fb_result    = await db.execute(select(Feedback).where(Feedback.user_id == current_user.id))
    feedbacks    = fb_result.scalars().all()
    feedback_map = {f.garment_id: f.feedback for f in feedbacks}

    recommended     = generate_recommendation(
        garments     = list(garments),
        occasion     = body.occasion,
        weather      = body.weather,
        feedback_map = feedback_map,
    )
    recommended_ids = [g.id for g in recommended]

    rec = Recommendation(
        user_id           = current_user.id,
        recommended_items = recommended_ids,
        occasion          = body.occasion,
        weather           = body.weather,
    )
    db.add(rec)
    await db.commit()
    await db.refresh(rec)

    return {
        "id":       rec.id,
        "occasion": rec.occasion,
        "weather":  rec.weather,
        "items": [
            {
                "id":        g.id,
                "image_url": g.image_url,
                "category":  g.category,
                "color":     g.color,
                "fabric":    g.fabric,
                "style":     g.style,
            }
            for g in recommended
        ],
        "created_at": rec.created_at,
    }


# ─── GET /recommendations/history ───────────────────────────────────────────

@router.get("/history")
async def get_history(
    db:      AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    result = await db.execute(
        select(Recommendation)
        .where(Recommendation.user_id == current_user.id)
        .order_by(Recommendation.created_at.desc())
    )
    recs   = result.scalars().all()

    history = []
    for rec in recs:
        g_result = await db.execute(
            select(Garment).where(Garment.id.in_(rec.recommended_items)),
            Garment.user_id == current_user.id
        )
        garments = g_result.scalars().all()

        history.append({
            "id":       rec.id,
            "occasion": rec.occasion,
            "weather":  rec.weather,
            "items": [
                {
                    "id":        g.id,
                    "image_url": g.image_url,
                    "category":  g.category,
                    "color":     g.color,
                }
                for g in garments
            ],
            "created_at": rec.created_at,
        })

    return history