export default function GarmentCard({ item, onDelete }) {
  const addToMannequin = () => {
    const outfit =
      JSON.parse(localStorage.getItem("currentOutfit")) || {
        top: null,
        bottom: null,
        outerwear: null,
        dress: null,
      };

    outfit[item.category] = item;

    localStorage.setItem(
      "currentOutfit",
      JSON.stringify(outfit)
    );

    alert(`${item.category} added to mannequin`);
  };

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
          style={styles.addBtn}
          onClick={addToMannequin}
        >
          Add To Mannequin
        </button>

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
    background: "#fff",
    borderRadius: "20px",
    padding: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,.1)",
    textAlign: "center",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "contain",
    borderRadius: "15px",
  },

  title: {
    textTransform: "capitalize",
  },

  badge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#ec4899",
    color: "white",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "600",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  addBtn: {
    flex: 1,
    background: "#ec4899",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
  },
};