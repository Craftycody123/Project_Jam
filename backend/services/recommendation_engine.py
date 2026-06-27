from datetime import datetime, timedelta

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

OCCASION_STYLE = {
    "formal":  ["formal"],
    "casual":  ["casual", "formal", "party"],
    "party":   ["party", "formal"],
    "sports":  ["sports"],
    "college": ["casual", "sports"],
    "work":    ["formal", "casual"],
}

OCCASION_FABRIC = {
    "formal":  ["medium", "heavy"],
    "casual":  ["light", "medium"],
    "party":   ["light", "medium"],
    "sports":  ["light"],
    "college": ["light", "medium"],
    "work":    ["light", "medium", "heavy"],
}

WEATHER_EXCLUDE_FABRIC = {
    "hot":    ["heavy"],
    "cold":   ["light"],
    "rainy":  ["light"],
    "cloudy": [],
}

WEATHER_EXCLUDE_STYLE = {
    "hot":    [],
    "cold":   ["sleeveless", "shorts"],
    "rainy":  [],
    "cloudy": [],
}

DRESS_OCCASIONS = ["party", "formal", "casual"]


def is_new_item(uploaded_at) -> bool:
    return (datetime.utcnow() - uploaded_at) < timedelta(days=7)


def colors_match(color1: str, color2: str) -> bool:
    c1 = color1.lower()
    c2 = color2.lower()
    return c2 in COLOR_HARMONY.get(c1, []) or c1 == c2


def score_garments(garments: list, feedback_map: dict, like_counts: dict) -> list:
    scored = []
    for g in garments:
        score = 0

        # Like count — most important signal
        score += like_counts.get(g.id, 0) * 2

        # Latest feedback
        fb = feedback_map.get(g.id)
        if fb == "like":
            score += 1
        elif fb == "dislike":
            score -= 2  # penalise dislikes more

        # Newness bonus
        if is_new_item(g.uploaded_at):
            score += 2

        # Never worn bonus
        if g.times_worn == 0:
            score += 1

        scored.append((score, g))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [g for _, g in scored]


def generate_recommendation(
    garments:     list,
    occasion:     str,
    weather:      str,
    feedback_map: dict,
    like_counts:  dict,
) -> list:

    occasion = occasion.lower()
    weather  = weather.lower()

    exclude_fabrics = WEATHER_EXCLUDE_FABRIC.get(weather, [])
    exclude_styles  = WEATHER_EXCLUDE_STYLE.get(weather, [])
    allowed_styles  = OCCASION_STYLE.get(occasion, ["casual"])
    allowed_fabrics = OCCASION_FABRIC.get(occasion, ["light", "medium"])

    # Step 1 — weather filter
    filtered = [
        g for g in garments
        if g.fabric.lower() not in exclude_fabrics
        and g.style.lower() not in exclude_styles
    ]

    # Step 2 — occasion filter
    filtered = [
        g for g in filtered
        if g.style.lower() in allowed_styles
        and g.fabric.lower() in allowed_fabrics
    ]

    if not filtered:
        # fallback — score full wardrobe
        return score_garments(garments, feedback_map, like_counts)[:3]

    # Step 3 — score
    scored = score_garments(filtered, feedback_map, like_counts)

    # Step 4 — dress only for appropriate occasions
    if occasion in DRESS_OCCASIONS:
        dresses = [g for g in scored if g.category.lower() == "dress"]
        if dresses:
            return [dresses[0]]

    # Step 5 — top + bottom with color harmony
    tops    = [g for g in scored if g.category.lower() == "top"]
    bottoms = [g for g in scored if g.category.lower() == "bottom"]

    if not tops or not bottoms:
        return scored[:3]

    best_top = tops[0]
    matching_bottoms = [b for b in bottoms if colors_match(best_top.color, b.color)]
    best_bottom = matching_bottoms[0] if matching_bottoms else bottoms[0]

    result = [best_top, best_bottom]

    # Step 6 — outerwear for cold/rainy
    if weather in ["cold", "rainy"]:
        outerwear = [g for g in scored if g.category.lower() == "outerwear"]
        if outerwear:
            result.append(outerwear[0])

    return result