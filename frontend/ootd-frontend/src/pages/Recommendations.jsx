import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import WeatherBadge from "../components/WeatherBadge";

export default function Recommendations() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecommendation = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/recommendations/generate",
        {
          occasion: "Casual",
          weather: "Cloudy",
        }
      );

      setRecommendation(response.data);
    } catch (error) {
      console.error("Failed to generate recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Today's Recommendation</h2>

      <WeatherBadge
        weather="Cloudy"
        temperature="28°C"
      />

      <button onClick={generateRecommendation}>
        Generate Outfit
      </button>

      {loading && <p>Generating...</p>}

      {recommendation && (
        <div>
          <h3>
            {recommendation.occasion} • {recommendation.weather}
          </h3>

          {recommendation.items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <img
                src={item.image_url}
                alt={item.category}
                width="150"
              />

              <p>Category: {item.category}</p>
              <p>Color: {item.color}</p>
              <p>Style: {item.style}</p>

              <button>👍 Like</button>
              <button>👎 Dislike</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}