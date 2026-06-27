import { useEffect, useState, useCallback } from "react";
import { garmentAPI, recommendationAPI, weatherAPI } from "../services/api";
import AppNav from "../components/AppNav";

const WEATHER_EMOJI = {
  hot: "☀️",
  cold: "🧥",
  rainy: "🌧️",
  cloudy: "☁️",
};

export default function OutfitBuilder() {
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [dresses, setDresses] = useState([]);
  const [outerwears, setOuterwears] = useState([]);

  const [occasion, setOccasion] = useState("college");

  const [weather, setWeather] = useState(null);
  const [weatherDesc, setWeatherDesc] = useState("");
  const [weatherTemp, setWeatherTemp] = useState(null);
  const [weatherCity, setWeatherCity] = useState("");
  const [weatherError, setWeatherError] = useState(false);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [dressIndex, setDressIndex] = useState(0);
  const [outerwearIndex, setOuterwearIndex] = useState(0);

  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedDress, setSelectedDress] = useState(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState(null);

  const [recommendationId, setRecommendationId] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const normalize = (category) => {
    const c = category?.toLowerCase().trim();

    if (
      ["top", "shirt", "tshirt", "t-shirt", "blouse", "kurti"].includes(c)
    ) {
      return "top";
    }

    if (
      [
        "bottom",
        "pant",
        "pants",
        "trouser",
        "trousers",
        "jeans",
        "skirt",
      ].includes(c)
    ) {
      return "bottom";
    }

    if (["dress", "gown", "frock"].includes(c)) {
      return "dress";
    }

    if (
      ["outer", "outerwear", "jacket", "coat", "blazer", "hoodie"].includes(c)
    ) {
      return "outerwear";
    }

    return c;
  };

  const loadWeather = useCallback(async () => {
    try {
      const res = await weatherAPI.getWeatherByCity();

      setWeather(res.data.label);
      setWeatherDesc(res.data.description);
      setWeatherTemp(res.data.temperature);
      setWeatherCity(res.data.city);
    } catch (err) {
      console.error("Weather fetch failed:", err);
      setWeatherError(true);
      setWeather("cloudy");
    }
  }, []);

  const loadGarments = useCallback(async () => {
    try {
      const res = await garmentAPI.getGarments();

      const all = res.data.map((g) => ({
        ...g,
        normalizedCategory: normalize(g.category),
      }));

      setTops(all.filter((g) => g.normalizedCategory === "top"));
      setBottoms(all.filter((g) => g.normalizedCategory === "bottom"));
      setDresses(all.filter((g) => g.normalizedCategory === "dress"));
      setOuterwears(
        all.filter((g) => g.normalizedCategory === "outerwear")
      );
    } catch (err) {
      console.error(err);
      alert("Failed to load garments");
    }
  }, []);

  useEffect(() => {
    loadGarments();
    loadWeather();
  }, [loadGarments, loadWeather]);

  const currentTop = tops[topIndex] || null;
  const currentBottom = bottoms[bottomIndex] || null;
  const currentDress = dresses[dressIndex] || null;
  const currentOuterwear = outerwears[outerwearIndex] || null;

  const clearRecommendation = () => {
    setRecommendationId(null);
    setIsManual(true);
    setFeedbackGiven(false);
  };

  const viewOnMannequin = () => {
    const outfit = {
      top: selectedDress ? null : selectedTop,
      bottom: selectedDress ? null : selectedBottom,
      dress: selectedDress,
      outerwear: selectedOuterwear,
    };

    localStorage.setItem("currentOutfit", JSON.stringify(outfit));
    window.location.href = "/mannequin";
  };

  const generateRecommendation = async () => {
    try {
      const res = await recommendationAPI.generateRecommendation({
        occasion,
        weather: weather || "cloudy",
      });

      setRecommendationId(res.data.id);
      setIsManual(false);
      setFeedbackGiven(false);

      const items = res.data.items;

      const foundDress =
        items.find((g) => normalize(g.category) === "dress") || null;

      setSelectedDress(foundDress);

      if (!foundDress) {
        setSelectedTop(
          items.find((g) => normalize(g.category) === "top") || null
        );

        setSelectedBottom(
          items.find((g) => normalize(g.category) === "bottom") || null
        );
      } else {
        setSelectedTop(null);
        setSelectedBottom(null);
      }

      setSelectedOuterwear(
        items.find((g) => normalize(g.category) === "outerwear") || null
      );
    } catch (err) {
      console.error("Recommendation failed:", err);
      alert("Couldn't generate recommendation");
    }
  };

  const submitFeedback = async (feedback) => {
    try {
      let payload;

      if (isManual) {
        const ids = [
          selectedTop?.id,
          selectedBottom?.id,
          selectedDress?.id,
          selectedOuterwear?.id,
        ].filter(Boolean);

        if (ids.length === 0) {
          alert("Select at least one garment first.");
          return;
        }

        payload = { garment_ids: ids, feedback };
      } else {
        if (!recommendationId) {
          alert("No recommendation to rate.");
          return;
        }

        payload = { recommendation_id: recommendationId, feedback };
      }

      const res = await recommendationAPI.submitFeedback(payload);

      if (res.data.success) {
        setFeedbackGiven(true);
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to submit feedback.");
    }
  };

  const canView =
    selectedDress ||
    selectedTop ||
    selectedBottom ||
    selectedOuterwear;

  const canRate = canView && (isManual || recommendationId);

  return (
    <div className="min-h-screen flex bg-background">
      <AppNav />

      <main style={styles.page}>
        <div style={styles.header}>
          <p style={styles.kicker}>Style Studio</p>

          <h1 style={styles.title}>Outfit Builder</h1>

          <p style={styles.subtitle}>
            Mix tops, pants, dresses, and outerwear from your wardrobe.
          </p>

          <div style={styles.weatherRow}>
            {weather === null ? (
              <span style={styles.weatherBadge}>
                🌐 Fetching weather...
              </span>
            ) : weatherError ? (
              <span
                style={{
                  ...styles.weatherBadge,
                  background: "var(--secondary)",
                }}
              >
                ⚠️ Weather unavailable — using default
              </span>
            ) : (
              <span style={styles.weatherBadge}>
                {WEATHER_EMOJI[weather]}{" "}
                {weather.charAt(0).toUpperCase() + weather.slice(1)}
                {weatherTemp !== null &&
                  ` · ${Math.round(weatherTemp)}°C`}
                {weatherDesc && ` · ${weatherDesc}`}
                {weatherCity && ` · ${weatherCity}`}
              </span>
            )}

            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              style={styles.occasionSelect}
            >
              <option value="college">🎓 College</option>
              <option value="work">💼 Work</option>
              <option value="party">🎉 Party</option>
              <option value="casual">👟 Casual</option>
              <option value="formal">👔 Formal</option>
            </select>
          </div>

          <button
            style={styles.recommendBtn}
            onClick={generateRecommendation}
            disabled={weather === null}
          >
            ✨ Recommend Outfit
          </button>
        </div>

        <div style={styles.builderGrid}>
          <ClothSection
            title="Top"
            item={currentTop}
            count={tops.length}
            empty="No tops available"
            onNext={() =>
              setTopIndex((p) => (p + 1) % tops.length)
            }
            onSelect={() => {
              setSelectedTop(currentTop);
              clearRecommendation();
            }}
            onDeselect={() => {
              setSelectedTop(null);
              clearRecommendation();
            }}
            isSelected={selectedTop?.id === currentTop?.id}
            disabled={!!selectedDress}
            styles={styles}
          />

          <ClothSection
            title="Pant / Bottom"
            item={currentBottom}
            count={bottoms.length}
            empty="No bottoms available"
            onNext={() =>
              setBottomIndex((p) => (p + 1) % bottoms.length)
            }
            onSelect={() => {
              setSelectedBottom(currentBottom);
              clearRecommendation();
            }}
            onDeselect={() => {
              setSelectedBottom(null);
              clearRecommendation();
            }}
            isSelected={selectedBottom?.id === currentBottom?.id}
            disabled={!!selectedDress}
            styles={styles}
          />

          <ClothSection
            title="Dress"
            item={currentDress}
            count={dresses.length}
            empty="No dresses available"
            onNext={() =>
              setDressIndex((p) => (p + 1) % dresses.length)
            }
            onSelect={() => {
              setSelectedDress(currentDress);
              setSelectedTop(null);
              setSelectedBottom(null);
              clearRecommendation();
            }}
            onDeselect={() => {
              setSelectedDress(null);
              clearRecommendation();
            }}
            isSelected={selectedDress?.id === currentDress?.id}
            styles={styles}
          />

          <ClothSection
            title="Outerwear"
            item={currentOuterwear}
            count={outerwears.length}
            empty="No outerwear available"
            onNext={() =>
              setOuterwearIndex((p) => (p + 1) % outerwears.length)
            }
            onSelect={() => {
              setSelectedOuterwear(currentOuterwear);
              clearRecommendation();
            }}
            onDeselect={() => {
              setSelectedOuterwear(null);
              clearRecommendation();
            }}
            isSelected={
              selectedOuterwear?.id === currentOuterwear?.id
            }
            styles={styles}
          />
        </div>

        <section style={styles.previewCard}>
          <p style={styles.kicker}>Preview</p>

          <h2 style={styles.sectionTitle}>Selected Outfit</h2>

          <div style={styles.previewContent}>
            <div style={styles.mannequinBox}>
              {selectedDress ? (
                <img
                  src={selectedDress.image_url}
                  alt="dress"
                  style={styles.regionDress}
                />
              ) : (
                <>
                  {selectedTop && (
                    <img
                      src={selectedTop.image_url}
                      alt="top"
                      style={styles.regionTop}
                    />
                  )}

                  {selectedBottom && (
                    <img
                      src={selectedBottom.image_url}
                      alt="bottom"
                      style={styles.regionBottom}
                    />
                  )}
                </>
              )}

              {selectedOuterwear && (
                <img
                  src={selectedOuterwear.image_url}
                  alt="outerwear"
                  style={styles.regionOuterwear}
                />
              )}

              {!canView && (
                <p style={styles.mannequinEmptyText}>
                  Select garments to preview
                </p>
              )}
            </div>

            <div style={styles.feedbackPanel}>
              <h3>Rate this Outfit</h3>

              <button
                style={styles.likeBtn}
                disabled={!canRate || feedbackGiven}
                onClick={() => submitFeedback("like")}
              >
                👍 Like
              </button>

              <button
                style={styles.dislikeBtn}
                disabled={!canRate || feedbackGiven}
                onClick={() => submitFeedback("dislike")}
              >
                👎 Dislike
              </button>

              {feedbackGiven && (
                <p style={styles.feedbackText}>
                  Thank you for your feedback!
                </p>
              )}

              {canView && (
                <button
                  style={styles.viewBtn}
                  onClick={viewOnMannequin}
                >
                  View On Mannequin →
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ClothSection({
  title,
  item,
  count,
  empty,
  onNext,
  onSelect,
  onDeselect,
  isSelected,
  disabled,
  styles,
}) {
  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>{title}</h2>

      {item ? (
        <>
          <div style={styles.imageBox}>
            <img
              src={item.image_url}
              alt={title}
              style={styles.garmentImage}
            />
          </div>

          <p style={styles.meta}>
            {item.category} • {item.color}
          </p>

          <div style={styles.buttonRow}>
            <button
              style={styles.secondaryBtn}
              onClick={onNext}
            >
              Next
            </button>

            {isSelected ? (
              <button
                style={styles.deselectBtn}
                onClick={onDeselect}
              >
                Remove
              </button>
            ) : (
              <button
                style={styles.primaryBtn}
                onClick={onSelect}
                disabled={disabled}
              >
                Select
              </button>
            )}
          </div>
        </>
      ) : (
        <p>{empty}</p>
      )}
    </section>
  );
}

const styles = {
  page: {
    flex: 1,
    padding: "40px",
  },

  header: {
    marginBottom: "30px",
  },

  kicker: {
    color: "var(--accent)",
    fontWeight: 700,
  },

  title: {
    fontSize: "42px",
    fontWeight: 700,
  },

  subtitle: {
    color: "var(--muted-foreground)",
  },

  weatherRow: {
    display: "flex",
    gap: "12px",
    marginTop: "14px",
    flexWrap: "wrap",
  },

  weatherBadge: {
    padding: "8px 14px",
    borderRadius: "18px",
    background: "var(--secondary)",
  },

  occasionSelect: {
    padding: "8px 12px",
    borderRadius: "12px",
  },

  recommendBtn: {
    marginTop: "18px",
    padding: "12px 24px",
    borderRadius: "14px",
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  builderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "20px",
    marginBottom: "28px",
  },

  card: {
    background: "white",
    borderRadius: "22px",
    padding: "20px",
  },

  sectionTitle: {
    fontSize: "24px",
    marginBottom: "14px",
  },

  imageBox: {
    minHeight: "240px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  garmentImage: {
    width: "200px",
    height: "220px",
    objectFit: "contain",
  },

  meta: {
    textAlign: "center",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "14px",
  },

  primaryBtn: {
    padding: "10px 16px",
  },

  secondaryBtn: {
    padding: "10px 16px",
  },

  deselectBtn: {
    padding: "10px 16px",
  },

  previewCard: {
    background: "white",
    borderRadius: "24px",
    padding: "24px",
  },

  previewContent: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },

  mannequinBox: {
    position: "relative",
    width: "320px",
    height: "560px",
  },

  regionTop: {
    position: "absolute",
    top: "10%",
    width: "100%",
    height: "40%",
    objectFit: "contain",
  },

  regionBottom: {
    position: "absolute",
    top: "42%",
    width: "100%",
    height: "48%",
    objectFit: "contain",
  },

  regionDress: {
    position: "absolute",
    top: "10%",
    width: "100%",
    height: "80%",
    objectFit: "contain",
  },

  regionOuterwear: {
    position: "absolute",
    top: "8%",
    width: "100%",
    height: "45%",
    objectFit: "contain",
  },

  mannequinEmptyText: {
    textAlign: "center",
  },

  feedbackPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    alignItems: "center",
  },

  likeBtn: {
    padding: "12px 20px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "14px",
  },

  dislikeBtn: {
    padding: "12px 20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "14px",
  },

  feedbackText: {
    fontWeight: 700,
  },

  viewBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "var(--accent)",
    color: "white",
  },
};