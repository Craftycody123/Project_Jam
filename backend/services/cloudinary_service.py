import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image(file) -> dict:
    """
    Upload image to Cloudinary.
    Returns dict with image_url and public_id.
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder="ootd/garments",
            resource_type="image"
        )
        return {
            "image_url": result["secure_url"],
            "public_id": result["public_id"]
        }
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {str(e)}")


def delete_image(public_id: str) -> bool:
    """
    Delete image from Cloudinary using public_id.
    Returns True if successful.
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        raise Exception(f"Cloudinary delete failed: {str(e)}")