export default function GarmentCard({ item, onDelete }) {
  return (
    <div style={styles.card}>
      <img
        src={item.image_url}
        alt={item.category}
        style={styles.image}
      />

      <h3 style={styles.title}>
        {item.category}
      </h3>

      <p>
        <strong>Color:</strong> {item.color}
      </p>

      <p>
        <strong>Fabric:</strong> {item.fabric}
      </p>

      <p>
        <strong>Style:</strong> {item.style}
      </p>

      {item.is_new && (
        <span style={styles.badge}>
          NEW
        </span>
      )}

      <div style={styles.buttons}>
        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(item.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--card)",
    borderRadius: "20px",
    padding: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,.1)",
    textAlign: "center",
    position: "relative",
    border: "1px solid var(--border)",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "contain",
    borderRadius: "15px",
  },

  title: {
    textTransform: "capitalize",
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: "22px",
    marginBottom: "10px",
  },

  badge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "var(--accent)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "600",
  },

  buttons: {
    marginTop: "15px",
  },

  deleteBtn: {
    width: "100%",
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};