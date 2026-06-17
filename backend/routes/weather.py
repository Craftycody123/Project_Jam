from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/weather", tags=["Weather"])

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


def map_weather(data: dict) -> str:
    temp       = data["main"]["temp"]
    weather_id = data["weather"][0]["id"]

    if 500 <= weather_id <= 531:
        return "rainy"
    if temp > 30:
        return "hot"
    elif temp < 15:
        return "cold"
    else:
        return "cloudy"


@router.get("/")
async def get_weather(lat: float, lon: float):
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch weather data")

    data        = response.json()
    label       = map_weather(data)
    temperature = data["main"]["temp"]
    description = data["weather"][0]["description"]

    return {
        "label":       label,
        "temperature": temperature,
        "description": description,
    }