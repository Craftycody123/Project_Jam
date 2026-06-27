from fastapi import APIRouter, Depends, HTTPException
import httpx
import os
import traceback
from dotenv import load_dotenv
import auth

load_dotenv()

router = APIRouter(prefix="/weather", tags=["Weather"])

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


def map_weather(data: dict) -> str:
    temp = data["main"]["temp"]
    weather_id = data["weather"][0]["id"]

    if 500 <= weather_id <= 531:
        return "rainy"
    elif temp > 30:
        return "hot"
    elif temp < 15:
        return "cold"
    else:
        return "cloudy"


@router.get("/")
async def get_weather(lat: float, lon: float):
    try:
        if not OPENWEATHER_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="Weather API key not configured"
            )

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": OPENWEATHER_API_KEY,
                    "units": "metric",
                },
            )

        print("Weather Status:", response.status_code)
        print("Weather Response:", response.text)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        data = response.json()

        return {
            "label": map_weather(data),
            "temperature": data["main"]["temp"],
            "description": data["weather"][0]["description"],
        }

    except HTTPException:
        raise

    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Unexpected weather service error"
        )


@router.get("/by-city")
async def get_weather_by_city(
    current_user=Depends(auth.get_current_user),
):
    try:
        print("========== WEATHER DEBUG ==========")
        print("User:", current_user.email)
        print("Location:", current_user.location)
        print("API Key Exists:", bool(OPENWEATHER_API_KEY))
        print("===================================")

        if not OPENWEATHER_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="Weather API key not configured"
            )

        city = current_user.location

        if not city:
            raise HTTPException(
                status_code=400,
                detail="No location set on profile"
            )

        async with httpx.AsyncClient(timeout=10) as client:
            geo_resp = await client.get(
                "https://api.openweathermap.org/geo/1.0/direct",
                params={
                    "q": city,
                    "limit": 1,
                    "appid": OPENWEATHER_API_KEY,
                },
            )

        print("Geo Status:", geo_resp.status_code)
        print("Geo Response:", geo_resp.text)

        if geo_resp.status_code != 200:
            raise HTTPException(
                status_code=geo_resp.status_code,
                detail=geo_resp.text,
            )

        geo_json = geo_resp.json()

        if not geo_json:
            raise HTTPException(
                status_code=404,
                detail=f"City '{city}' not found"
            )

        geo = geo_json[0]

        lat = geo["lat"]
        lon = geo["lon"]

        async with httpx.AsyncClient(timeout=10) as client:
            weather_resp = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": OPENWEATHER_API_KEY,
                    "units": "metric",
                },
            )

        print("Weather Status:", weather_resp.status_code)
        print("Weather Response:", weather_resp.text)

        if weather_resp.status_code != 200:
            raise HTTPException(
                status_code=weather_resp.status_code,
                detail=weather_resp.text,
            )

        weather = weather_resp.json()

        return {
            "label": map_weather(weather),
            "temperature": weather["main"]["temp"],
            "description": weather["weather"][0]["description"],
            "city": geo.get("name", city),
        }

    except HTTPException:
        raise

    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Unexpected weather service error"
        )