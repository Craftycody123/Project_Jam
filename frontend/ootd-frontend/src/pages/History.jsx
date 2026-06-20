import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("outfitHistory");

    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const deleteOutfit = (indexToDelete) => {
    const updatedHistory = history.filter(
      (_, index) => index !== indexToDelete
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "outfitHistory",
      JSON.stringify(updatedHistory)
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.top}>
        <p style={styles.label}>Saved Looks</p>
        <h2 style={styles.title}>Outfit History</h2>
        <p style={styles.subtitle}>
          Your saved outfit combinations appear here.
        </p>
      </div>

      {history.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3>No saved outfits yet</h3>
          <p>Go to Mannequin and save an outfit.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {history.map((outfit, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.header}>
                <div>
                  <p style={styles.small}>Look #{index + 1}</p>
                  <h3 style={styles.cardTitle}>Outfit {index + 1}</h3>
                </div>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteOutfit(index)}
                >
                  Delete
                </button>
              </div>

              <div style={styles.clothes}>
                {Object.entries(outfit).map(
                  ([type, item]) =>
                    item && (
                      <div key={type} style={styles.itemBox}>
                        <img
                          src={item.image_url}
                          alt={type}
                          style={styles.image}
                        />

                        <p style={styles.type}>{type}</p>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "var(--background)",
    color: "var(--foreground)",
  },

  top: {
    marginBottom: "28px",
  },

  label: {
    margin: 0,
    color: "var(--accent)",
    fontWeight: 700,
    letterSpacing: "0.04em",
  },

  title: {
    margin: "8px 0",
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: "42px",
    fontWeight: 600,
  },

  subtitle: {
    margin: 0,
    color: "var(--muted-foreground)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "var(--card)",
    color: "var(--card-foreground)",
    padding: "22px",
    borderRadius: "24px",
    border: "1px solid var(--border)",
    boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
  },

  emptyCard: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  small: {
    margin: 0,
    fontSize: "13px",
    color: "var(--muted-foreground)",
  },

  cardTitle: {
    margin: 0,
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: "24px",
  },

  deleteBtn: {
    background: "var(--accent)",
    color: "var(--accent-foreground)",
    border: "none",
    padding: "9px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: 700,
  },

  clothes: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  itemBox: {
    background: "var(--secondary)",
    borderRadius: "18px",
    padding: "12px",
    textAlign: "center",
    minWidth: "120px",
  },

  image: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
    filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.18))",
  },

  type: {
    margin: "8px 0 0",
    textTransform: "capitalize",
    fontWeight: 700,
  },
};