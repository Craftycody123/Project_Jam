from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import json

from database import get_db
from models.garment_model import Garment
from services.bg_removal import remove_background_bytes
from services.cloudinary_service import upload_image, delete_image
import auth

router = APIRouter(prefix="/garments", tags=["Garments"])


# ──────────────────────────────────────────────────────────────────────────────
# Helper
# ──────────────────────────────────────────────────────────────────────────────

async def get_garment_or_404(
    garment_id: int,
    user_id: int,
    db: AsyncSession
) -> Garment:
    result = await db.execute(
        select(Garment).where(
            Garment.id == garment_id,
            Garment.user_id == user_id
        )
    )

    garment = result.scalar_one_or_none()

    if not garment:
        raise HTTPException(
            status_code=404,
            detail="Garment not found"
        )

    return garment


# ──────────────────────────────────────────────────────────────────────────────
# POST /garments/upload
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_garment(
    file: UploadFile = File(...),
    category: str = Form(...),
    color: str = Form(...),
    fabric: str = Form(...),
    style: str = Form(...),
    tags: str = Form("[]"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    contents = await file.read()

    processed_image = remove_background_bytes(contents)

    upload_result = upload_image(processed_image)

    try:
        tags_list = json.loads(tags)
    except Exception:
        tags_list = []

    garment = Garment(
        user_id=current_user.id,
        image_url=upload_result["image_url"],
        public_id=upload_result["public_id"],
        category=category,
        color=color,
        fabric=fabric,
        style=style,
        tags=tags_list,
        is_new=True,
    )

    db.add(garment)
    await db.commit()
    await db.refresh(garment)

    return {
        "id": garment.id,
        "image_url": garment.image_url,
        "category": garment.category,
        "color": garment.color,
        "fabric": garment.fabric,
        "style": garment.style,
        "tags": garment.tags,
        "is_new": garment.is_new,
        "uploaded_at": garment.uploaded_at,
    }


# ──────────────────────────────────────────────────────────────────────────────
# GET /garments
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/")
async def get_wardrobe(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    query = select(Garment).where(
        Garment.user_id == current_user.id
    )

    if category:
        query = query.where(
            Garment.category == category
        )

    result = await db.execute(query)

    garments = result.scalars().all()

    return [
        {
            "id": g.id,
            "image_url": g.image_url,
            "category": g.category,
            "color": g.color,
            "fabric": g.fabric,
            "style": g.style,
            "tags": g.tags,
            "is_new": g.is_new,
            "times_worn": g.times_worn,
            "last_worn": g.last_worn,
            "uploaded_at": g.uploaded_at,
        }
        for g in garments
    ]
# ──────────────────────────────────────────────────────────────────────────────
# GET /garments/{garment_id}
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/{garment_id}")
async def get_garment(
    garment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    garment = await get_garment_or_404(
        garment_id,
        current_user.id,
        db
    )

    return {
        "id": garment.id,
        "image_url": garment.image_url,
        "category": garment.category,
        "color": garment.color,
        "fabric": garment.fabric,
        "style": garment.style,
        "tags": garment.tags,
        "is_new": garment.is_new,
        "times_worn": garment.times_worn,
        "last_worn": garment.last_worn,
        "uploaded_at": garment.uploaded_at,
    }


# ──────────────────────────────────────────────────────────────────────────────
# PUT /garments/{garment_id}
# ──────────────────────────────────────────────────────────────────────────────

@router.put("/{garment_id}")
async def update_garment(
    garment_id: int,
    category: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    fabric: Optional[str] = Form(None),
    style: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    garment = await get_garment_or_404(
        garment_id,
        current_user.id,
        db
    )

    if category:
        garment.category = category

    if color:
        garment.color = color

    if fabric:
        garment.fabric = fabric

    if style:
        garment.style = style

    if tags:
        try:
            garment.tags = json.loads(tags)
        except Exception:
            pass

    await db.commit()
    await db.refresh(garment)

    return {
        "message": "Garment updated",
        "id": garment.id
    }


# ──────────────────────────────────────────────────────────────────────────────
# DELETE /garments/{garment_id}
# ──────────────────────────────────────────────────────────────────────────────

@router.delete("/{garment_id}")
async def delete_garment(
    garment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    garment = await get_garment_or_404(
        garment_id,
        current_user.id,
        db
    )

    delete_image(garment.public_id)

    await db.delete(garment)
    await db.commit()

    return {
        "message": "Garment deleted",
        "id": garment_id
    }