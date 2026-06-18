import { useEffect, useState } from "react";
import { recommendationAPI, weatherAPI } from "../services/api";
import WeatherBadge from "../components/WeatherBadge";

export default function Mannequin() {
  const [currentOutfit, setCurrentOutfit] = useState({
    top: null,
    bottom: null,
    outerwear: null,
    dress: null,
  });

  const [savedOutfits, setSavedOutfits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [occasion, setOccasion] = useState("college");
  const [weather, setWeather] = useState("cloudy");
  const [weatherData, setWeatherData] = useState(null);

  const layers = {
    bottom: 1,
    dress: 2,
    top: 3,
    outerwear: 4,
  };

  useEffect(() => {
    const saved = localStorage.getItem("currentOutfit");
    if (saved) {
      setCurrentOutfit(JSON.parse(saved));
    }

    const history = localStorage.getItem("outfitHistory");
    if (history) {
      setSavedOutfits(JSON.parse(history));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await weatherAPI.getWeather(
            position.coords.latitude,
            position.coords.longitude
          );

          setWeatherData(res.data);
          setWeather(res.data.label);
        } catch (err) {
          console.log(err);
        }
      },
      (err) => {
        console.log("Location permission denied", err);
      }
    );
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const item = JSON.parse(data);

    setCurrentOutfit((prev) => {
      const updated = {
        ...prev,
        [item.category]: item,
      };

      localStorage.setItem("currentOutfit", JSON.stringify(updated));
      return updated;
    });
  };

  const applyRecommendation = async () => {
    try {
      const res = await recommendationAPI.generateRecommendation({
        occasion,
        weather,
      });

      const items = res.data.items || [];

      const outfit = {
        top: items.find((i) => i.category === "top") || null,
        bottom: items.find((i) => i.category === "bottom") || null,
        outerwear:
          items.find(
            (i) => i.category === "outerwear" || i.category === "outer"
          ) || null,
        dress: items.find((i) => i.category === "dress") || null,
      };

      setCurrentOutfit(outfit);
      localStorage.setItem("currentOutfit", JSON.stringify(outfit));

      alert("Recommendation applied to mannequin");
    } catch (err) {
      console.log(err);
      alert("Recommendation failed");
    }
  };

  const saveOutfit = () => {
    const updated = [...savedOutfits, currentOutfit];

    setSavedOutfits(updated);
    setCurrentIndex(updated.length - 1);

    localStorage.setItem("outfitHistory", JSON.stringify(updated));

    alert("Outfit saved");
  };

  const nextOutfit = () => {
    if (currentIndex < savedOutfits.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setCurrentOutfit(savedOutfits[next]);
      localStorage.setItem(
        "currentOutfit",
        JSON.stringify(savedOutfits[next])
      );
    }
  };

  const previousOutfit = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setCurrentOutfit(savedOutfits[prev]);
      localStorage.setItem(
        "currentOutfit",
        JSON.stringify(savedOutfits[prev])
      );
    }
  };

  const clothes = Object.entries(currentOutfit)
    .filter(([_, item]) => item)
    .sort(([a], [b]) => layers[a] - layers[b]);

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h1 className="title">2D AI Mannequin</h1>

      {weatherData && (
        <WeatherBadge
          weather={weatherData.label}
          temperature={weatherData.temperature}
          description={weatherData.description}
        />
      )}

      <div style={styles.controls}>
        <select
          className="input"
          style={styles.smallInput}
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        >
          <option value="college">College</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="party">Party</option>
          <option value="sports">Sports</option>
        </select>

        <select
          className="input"
          style={styles.smallInput}
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
        >
          <option value="cloudy">Cloudy</option>
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
          <option value="rainy">Rainy</option>
        </select>

        <button className="btn" onClick={applyRecommendation}>
          ✨ Recommendation
        </button>

        <button className="btn" onClick={saveOutfit}>
          💾 Save Outfit
        </button>

        <button className="btn" onClick={previousOutfit}>
          ⬅ Previous
        </button>

        <button className="btn" onClick={nextOutfit}>
          Next ➡
        </button>
      </div>

      <div
        style={styles.mannequin}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div style={styles.head}></div>
        <div style={styles.body}></div>
        <div style={styles.legLeft}></div>
        <div style={styles.legRight}></div>

        {clothes.length === 0 && (
          <p style={styles.hint}>Click a garment or apply recommendation</p>
        )}

        {clothes.map(([type, item]) => (
          <img
            key={type}
            src={item.image_url}
            alt={type}
            style={{
              ...styles.cloth,
              zIndex: layers[type],
              top:
                type === "bottom"
                  ? 245
                  : type === "outerwear"
                  ? 120
                  : type === "dress"
                  ? 135
                  : 105,
              width:
                type === "bottom"
                  ? "150px"
                  : type === "dress"
                  ? "160px"
                  : "145px",
            }}
          />
        ))}
      </div>

      <p>
        Outfit: {savedOutfits.length === 0 ? 0 : currentIndex + 1}/
        {savedOutfits.length}
      </p>
    </div>
  );
}

const styles = {
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  smallInput: {
    maxWidth: "180px",
    marginTop: 0,
  },

  mannequin: {
    width: "320px",
    height: "570px",
    margin: "auto",
    position: "relative",
    background: "linear-gradient(#fff, #fce7f3)",
    border: "3px dashed #ec4899",
    borderRadius: "90px",
    boxShadow: "0 10px 25px rgba(236,72,153,.25)",
  },

  head: {
    width: "60px",
    height: "60px",
    background: "#ffd2a6",
    borderRadius: "50%",
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  body: {
    width: "115px",
    height: "175px",
    background: "#f9a8d4",
    position: "absolute",
    top: "100px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "30px",
  },

  legLeft: {
    width: "30px",
    height: "165px",
    background: "#f472b6",
    position: "absolute",
    bottom: "35px",
    left: "38%",
    borderRadius: "20px",
  },

  legRight: {
    width: "30px",
    height: "165px",
    background: "#f472b6",
    position: "absolute",
    bottom: "35px",
    right: "38%",
    borderRadius: "20px",
  },

  cloth: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    objectFit: "contain",
    transition: "0.4s",
    filter: "drop-shadow(0 5px 8px rgba(0,0,0,.25))",
  },

  hint: {
    position: "absolute",
    top: "280px",
    width: "100%",
    color: "#9d174d",
    fontWeight: "600",
    fontSize: "14px",
  },
};