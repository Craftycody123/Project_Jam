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
      <h2 style={styles.title}>Outfit History</h2>

      {history.length === 0 ? (
        <p>No saved outfits yet</p>
      ) : (
        history.map((outfit, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.header}>
              <h3>Outfit {index + 1}</h3>

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

                      <p>{type}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  clothes: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "10px",
  },

  itemBox: {
    textAlign: "center",
  },

  image: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
    filter: "drop-shadow(0 5px 8px rgba(0,0,0,0.2))",
  },
};