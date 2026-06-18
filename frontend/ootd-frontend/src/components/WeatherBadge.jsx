export default function WeatherBadge({ weather, temperature, description }) {
  return (
    <div style={styles.badge}>
      <span style={styles.icon}>🌤</span>

      <div>
        <strong>{weather}</strong>

        <p style={styles.text}>
          {temperature}°C
          {description ? ` • ${description}` : ""}
        </p>
      </div>
    </div>
  );
}

const styles = {
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    background: "#fce7f3",
    color: "#831843",
    padding: "12px 18px",
    borderRadius: "18px",
    boxShadow: "0 6px 15px rgba(236,72,153,0.18)",
    fontWeight: "600",
    marginBottom: "18px",
  },

  icon: {
    fontSize: "24px",
  },

  text: {
    margin: 0,
    fontSize: "13px",
    color: "#9d174d",
  },
};