import {mockRecommendations } from "../utils/mockData";
import WeatherBadge from "../components/WeatherBadge";

export default function Recommendations() {
  return (
    <div>
      <h2>Today's Recommendation</h2>

      <WeatherBadge
        weather="Cloudy"
        temperature="28°C"
      />

      {mockRecommendations.map((r) => (
        <div key={r.id}>
          <h3>{r.occasion}</h3>

          <ul>
            {r.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <button>👍 Like</button>
          <button>👎 Dislike</button>
        </div>
      ))}
    </div>
  );
}