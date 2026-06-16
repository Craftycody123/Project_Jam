export default function WeatherBadge({
  weather,
  temperature,
}) {
  return (
    <div
      style={{
        background: "#eee",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      🌤 {weather} | {temperature}
    </div>
  );
}