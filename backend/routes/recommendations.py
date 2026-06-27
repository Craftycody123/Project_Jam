from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import List, Optional
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


class ManualOutfitRequest(BaseModel):
    garment_ids: List[int]
    occasion:    str
    weather:     str


class FeedbackRequest(BaseModel):
    recommendation_id: Optional[int] = None
    garment_ids:       Optional[List[int]] = None
    feedback:          str


# ─── POST /recommendations/generate ─────────────────────────────────────────

@router.post("/generate")
async def generate(
    body:        GenerateRequest,
    db:          AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    result   = await db.execute(select(Garment).where(Garment.user_id == current_user.id))
    garments = result.scalars().all()

    if not garments:
        raise HTTPException(status_code=404, detail="No garments in wardrobe")

    fb_result    = await db.execute(select(Feedback).where(Feedback.user_id == current_user.id))
    feedbacks    = fb_result.scalars().all()

    # Build feedback_map: garment_id → latest feedback
    feedback_map = {f.garment_id: f.feedback for f in feedbacks}

    # Build like_count: garment_id → number of likes
    like_counts = {}
    for f in feedbacks:
        if f.feedback == "like":
            like_counts[f.garment_id] = like_counts.get(f.garment_id, 0) + 1

    recommended = generate_recommendation(
        garments     = list(garments),
        occasion     = body.occasion,
        weather      = body.weather,
        feedback_map = feedback_map,
        like_counts  = like_counts,
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


# ─── POST /recommendations/save-manual ───────────────────────────────────────

@router.post("/save-manual")
async def save_manual_outfit(
    body:        ManualOutfitRequest,
    db:          AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    if not body.garment_ids:
        raise HTTPException(status_code=400, detail="No garments provided")

    result = await db.execute(
        select(Garment).where(
            Garment.id.in_(body.garment_ids),
            Garment.user_id == current_user.id
        )
    )
    garments = result.scalars().all()

    if not garments:
        raise HTTPException(status_code=404, detail="No valid garments found")

    rec = Recommendation(
        user_id           = current_user.id,
        recommended_items = [g.id for g in garments],
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
            for g in garments
        ],
        "created_at": rec.created_at,
    }


# ─── POST /recommendations/feedback ─────────────────────────────────────────
# Works for BOTH recommended and manually selected outfits.
# Pass recommendation_id for recommended outfits.
# Pass garment_ids directly for manual outfits.

@router.post("/feedback")
async def submit_feedback(
    body:         FeedbackRequest,
    db:           AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    if body.feedback not in ["like", "dislike"]:
        raise HTTPException(status_code=400, detail="Feedback must be 'like' or 'dislike'")

    # Resolve which garment IDs to rate
    if body.recommendation_id is not None:
        # Recommended outfit — look up garment IDs from recommendation
        rec_result = await db.execute(
            select(Recommendation).where(
                Recommendation.id == body.recommendation_id,
                Recommendation.user_id == current_user.id
            )
        )
        rec = rec_result.scalar_one_or_none()
        if not rec:
            raise HTTPException(status_code=404, detail="Recommendation not found")
        garment_ids = rec.recommended_items

    elif body.garment_ids:
        # Manual outfit — use provided garment IDs directly
        garment_ids = body.garment_ids

    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either recommendation_id or garment_ids"
        )

    # Save feedback per garment
    for garment_id in garment_ids:
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
                recommendation_id = body.recommendation_id,  # None for manual
                garment_id        = garment_id,
                user_id           = current_user.id,
                feedback          = body.feedback,
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
    db:           AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    result = await db.execute(
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


# ─── GET /recommendations/history ───────────────────────────────────────────

@router.get("/history")
async def get_history(
    db:          AsyncSession = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    result = await db.execute(
        select(Recommendation)
        .where(Recommendation.user_id == current_user.id)
        .order_by(Recommendation.created_at.desc())
    )
    recs = result.scalars().all()

    history = []
    for rec in recs:
        g_result = await db.execute(
            select(Garment).where(
                Garment.id.in_(rec.recommended_items),
                Garment.user_id == current_user.id
            )
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