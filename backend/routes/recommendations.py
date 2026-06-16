from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models.garment_model import Garment
from models.recommendation_model import Recommendation
from models.feedback_model import Feedback
from services.recommendation_engine import generate_recommendation

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


# ─── Request Schema ──────────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    occasion: str    # formal | casual | party | sports | college
    weather:  str    # hot | cold | rainy | cloudy


# ─── POST /recommendations/generate ─────────────────────────────────────────

@router.post("/generate")
def generate(
    body:    GenerateRequest,
    db:      Session = Depends(get_db),
    user_id: int     = 1
):
    # Fetch all garments for user
    garments = db.query(Garment).filter(Garment.user_id == user_id).all()

    if not garments:
        raise HTTPException(status_code=404, detail="No garments in wardrobe")

    # Build feedback map { garment_id: "like" | "dislike" }
    feedbacks = db.query(Feedback).filter(Feedback.user_id == user_id).all()
    feedback_map = {f.garment_id: f.feedback for f in feedbacks}

    # Run recommendation engine
    recommended = generate_recommendation(
        garments     = garments,
        occasion     = body.occasion,
        weather      = body.weather,
        feedback_map = feedback_map,
    )

    recommended_ids = [g.id for g in recommended]

    # Save recommendation to DB
    rec = Recommendation(
        user_id           = user_id,
        recommended_items = recommended_ids,
        occasion          = body.occasion,
        weather           = body.weather,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

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
def get_history(
    db:      Session = Depends(get_db),
    user_id: int     = 1
):
    recs = db.query(Recommendation).filter(
        Recommendation.user_id == user_id
    ).order_by(Recommendation.created_at.desc()).all()

    result = []
    for rec in recs:
        # Fetch full garment details for each recommendation
        garments = db.query(Garment).filter(
            Garment.id.in_(rec.recommended_items)
        ).all()

        result.append({
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

    return result