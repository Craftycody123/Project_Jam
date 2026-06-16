from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json

from database import get_db
from models.garment_model import Garment
from services.cloudinary_service import upload_image, delete_image

router = APIRouter(prefix="/garments", tags=["Garments"])


# ─── Helper: get garment or 404 ─────────────────────────────────────────────

def get_garment_or_404(garment_id: int, user_id: int, db: Session) -> Garment:
    garment = db.query(Garment).filter(
        Garment.id == garment_id,
        Garment.user_id == user_id
    ).first()
    if not garment:
        raise HTTPException(status_code=404, detail="Garment not found")
    return garment


# ─── POST /garments/upload ───────────────────────────────────────────────────

@router.post("/upload")
async def upload_garment(
    file:     UploadFile = File(...),
    category: str        = Form(...),
    color:    str        = Form(...),
    fabric:   str        = Form(...),
    style:    str        = Form(...),
    tags:     str        = Form("[]"),          # JSON string eg: '["summer","light"]'
    db:       Session    = Depends(get_db),
    # TODO: replace with real JWT user_id from auth middleware
    user_id:  int        = 1
):
    # Upload to Cloudinary
    contents = await file.read()
    upload_result = upload_image(contents)

    # Parse tags JSON string
    try:
        tags_list = json.loads(tags)
    except Exception:
        tags_list = []

    garment = Garment(
        user_id   = user_id,
        image_url = upload_result["image_url"],
        public_id = upload_result["public_id"],
        category  = category,
        color     = color,
        fabric    = fabric,
        style     = style,
        tags      = tags_list,
        is_new    = True,
    )
    db.add(garment)
    db.commit()
    db.refresh(garment)

    return {
        "id":          garment.id,
        "image_url":   garment.image_url,
        "category":    garment.category,
        "color":       garment.color,
        "fabric":      garment.fabric,
        "style":       garment.style,
        "tags":        garment.tags,
        "is_new":      garment.is_new,
        "uploaded_at": garment.uploaded_at,
    }


# ─── GET /garments ───────────────────────────────────────────────────────────

@router.get("/")
def get_wardrobe(
    db:      Session = Depends(get_db),
    user_id: int     = 1
):
    garments = db.query(Garment).filter(Garment.user_id == user_id).all()
    return [
        {
            "id":          g.id,
            "image_url":   g.image_url,
            "category":    g.category,
            "color":       g.color,
            "fabric":      g.fabric,
            "style":       g.style,
            "tags":        g.tags,
            "is_new":      g.is_new,
            "times_worn":  g.times_worn,
            "uploaded_at": g.uploaded_at,
        }
        for g in garments
    ]


# ─── GET /garments/{id} ──────────────────────────────────────────────────────

@router.get("/{garment_id}")
def get_garment(
    garment_id: int,
    db:         Session = Depends(get_db),
    user_id:    int     = 1
):
    g = get_garment_or_404(garment_id, user_id, db)
    return {
        "id":          g.id,
        "image_url":   g.image_url,
        "category":    g.category,
        "color":       g.color,
        "fabric":      g.fabric,
        "style":       g.style,
        "tags":        g.tags,
        "is_new":      g.is_new,
        "times_worn":  g.times_worn,
        "last_worn":   g.last_worn,
        "uploaded_at": g.uploaded_at,
    }


# ─── PUT /garments/{id} ──────────────────────────────────────────────────────

@router.put("/{garment_id}")
def update_garment(
    garment_id: int,
    category:   Optional[str]  = Form(None),
    color:      Optional[str]  = Form(None),
    fabric:     Optional[str]  = Form(None),
    style:      Optional[str]  = Form(None),
    tags:       Optional[str]  = Form(None),
    db:         Session        = Depends(get_db),
    user_id:    int            = 1
):
    g = get_garment_or_404(garment_id, user_id, db)

    if category: g.category = category
    if color:    g.color    = color
    if fabric:   g.fabric   = fabric
    if style:    g.style    = style
    if tags:
        try:
            g.tags = json.loads(tags)
        except Exception:
            pass

    db.commit()
    db.refresh(g)
    return {"message": "Garment updated", "id": g.id}


# ─── DELETE /garments/{id} ───────────────────────────────────────────────────

@router.delete("/{garment_id}")
def delete_garment(
    garment_id: int,
    db:         Session = Depends(get_db),
    user_id:    int     = 1
):
    g = get_garment_or_404(garment_id, user_id, db)

    # Delete from Cloudinary first
    delete_image(g.public_id)

    db.delete(g)
    db.commit()
    return {"message": "Garment deleted", "id": garment_id}