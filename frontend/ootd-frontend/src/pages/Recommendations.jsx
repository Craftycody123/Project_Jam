import { mockGarments } from "../utils/mockData";
import WeatherBadge from "../components/WeatherBadge";

export default function Recommendations() {
  return (
    <div>
      <h2>Today's Recommendation</h2>

      <WeatherBadge
        weather="Cloudy"
        temperature="28°C"
      />

      {mockGarments.map((g) => (
        <div key={g.id}>
          <h3>{g.name}</h3>

          <ul>
            {g.items.map((item, i) => (
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