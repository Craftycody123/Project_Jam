from datetime import datetime, timedelta

# ─── Color Harmony Rules ────────────────────────────────────────────────────

COLOR_HARMONY = {
    "navy":    ["white", "beige", "grey", "cream"],
    "black":   ["white", "red", "pink", "gold", "grey"],
    "white":   ["navy", "black", "red", "blue", "beige", "grey", "olive", "pink"],
    "beige":   ["brown", "olive", "cream", "tan", "white", "navy"],
    "red":     ["black", "white", "navy", "denim"],
    "olive":   ["white", "khaki", "brown", "beige"],
    "grey":    ["white", "black", "navy", "pink"],
    "pink":    ["white", "grey", "black", "nude"],
    "brown":   ["beige", "cream", "white", "olive"],
    "blue":    ["white", "beige", "grey", "navy"],
    "floral":  ["white", "beige", "black", "nude"],
    "printed": ["white", "black", "beige", "grey"],
}

# ─── Occasion Rules ─────────────────────────────────────────────────────────

OCCASION_STYLE = {
    "formal":  ["formal"],
    "casual":  ["casual", "formal", "party"],
    "party":   ["party", "formal"],
    "sports":  ["sports"],
    "college": ["casual", "sports"],
}

OCCASION_FABRIC = {
    "formal":  ["medium", "heavy"],
    "casual":  ["light", "medium"],
    "party":   ["light", "medium"],
    "sports":  ["light"],
    "college": ["light", "medium"],
}

# ─── Weather Rules ──────────────────────────────────────────────────────────

WEATHER_EXCLUDE_FABRIC = {
    "hot":   ["heavy"],
    "cold":  ["light"],
    "rainy": ["light"],
    "cloudy": [],
}

WEATHER_EXCLUDE_CATEGORY = {
    "hot":   [],
    "cold":  ["sleeveless", "shorts"],
    "rainy": [],
    "cloudy": [],
}

# ─── Helpers ────────────────────────────────────────────────────────────────

def is_new_item(uploaded_at) -> bool:
    return (datetime.utcnow() - uploaded_at) < timedelta(days=7)


def colors_match(color1: str, color2: str) -> bool:
    c1 = color1.lower()
    c2 = color2.lower()
    compatible = COLOR_HARMONY.get(c1, [])
    return c2 in compatible or c1 == c2


def score_garments(garments: list, feedback_map: dict) -> list:
    """
    Score each garment based on feedback history and newness.
    feedback_map: { garment_id: "like" | "dislike" }
    Returns garments sorted by score descending.
    """
    scored = []
    for g in garments:
        score = 0
        fb = feedback_map.get(g.id)
        if fb == "like":
            score += 1
        elif fb == "dislike":
            score -= 1
        if is_new_item(g.uploaded_at):
            score += 2
        if g.times_worn == 0:
            score += 1
        scored.append((score, g))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [g for _, g in scored]


# ─── Main Engine ────────────────────────────────────────────────────────────

def generate_recommendation(garments: list, occasion: str, weather: str, feedback_map: dict) -> list:
    """
    Main recommendation function.

    Args:
        garments:     list of Garment ORM objects for the user
        occasion:     "formal" | "casual" | "party" | "sports" | "college"
        weather:      "hot" | "cold" | "rainy" | "cloudy"
        feedback_map: { garment_id: "like" | "dislike" }

    Returns:
        list of recommended Garment objects (1 top + 1 bottom OR 1 dress)
    """

    occasion  = occasion.lower()
    weather   = weather.lower()

    exclude_fabrics    = WEATHER_EXCLUDE_FABRIC.get(weather, [])
    exclude_categories = WEATHER_EXCLUDE_CATEGORY.get(weather, [])
    allowed_styles     = OCCASION_STYLE.get(occasion, ["casual"])
    allowed_fabrics    = OCCASION_FABRIC.get(occasion, ["light", "medium"])

    # ── Step 1: Weather filter ───────────────────────────────────────────────
    filtered = [
        g for g in garments
        if g.fabric.lower() not in exclude_fabrics
        and g.category.lower() not in exclude_categories
    ]

    # ── Step 2: Occasion filter ──────────────────────────────────────────────
    filtered = [
        g for g in filtered
        if g.style.lower() in allowed_styles
        and g.fabric.lower() in allowed_fabrics
    ]

    if not filtered:
        # fallback — return top 3 from full wardrobe scored
        return score_garments(garments, feedback_map)[:3]

    # ── Step 3: Score garments ───────────────────────────────────────────────
    scored = score_garments(filtered, feedback_map)

    # ── Step 4: Check if dress available ────────────────────────────────────
    dresses = [g for g in scored if g.category.lower() == "dress"]
    if dresses:
        return [dresses[0]]

    # ── Step 5: Pick top + bottom with color harmony ─────────────────────────
    tops    = [g for g in scored if g.category.lower() == "top"]
    bottoms = [g for g in scored if g.category.lower() == "bottom"]

    if not tops or not bottoms:
        return scored[:3]

    best_top = tops[0]

    # find best matching bottom by color harmony
    matching_bottoms = [
        b for b in bottoms
        if colors_match(best_top.color, b.color)
    ]

    best_bottom = matching_bottoms[0] if matching_bottoms else bottoms[0]

    # ── Step 6: Optionally add outerwear for cold/rainy ──────────────────────
    result = [best_top, best_bottom]

    if weather in ["cold", "rainy"]:
        outerwear = [g for g in scored if g.category.lower() == "outerwear"]
        if outerwear:
            result.append(outerwear[0])

    return result