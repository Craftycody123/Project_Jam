import { useEffect, useState } from "react";
import { garmentAPI } from "../services/api";
import AppNav from "../components/AppNav";

export default function OutfitBuilder() {
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [dresses, setDresses] = useState([]);
  const [outerwears, setOuterwears] = useState([]);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [dressIndex, setDressIndex] = useState(0);
  const [outerwearIndex, setOuterwearIndex] = useState(0);

  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedDress, setSelectedDress] = useState(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState(null);

  const normalize = (category) => {
    const c = category?.toLowerCase().trim();

    if (["top", "shirt", "tshirt", "t-shirt", "blouse", "kurti"].includes(c)) {
      return "top";
    }

    if (["bottom", "pant", "pants", "trouser", "trousers", "jeans", "skirt"].includes(c)) {
      return "bottom";
    }

    if (["dress", "gown", "frock"].includes(c)) {
      return "dress";
    }

    if (["outer", "outerwear", "jacket", "coat", "blazer", "hoodie"].includes(c)) {
      return "outerwear";
    }

    return c;
  };

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = async () => {
    try {
      const res = await garmentAPI.getGarments();

      const all = res.data.map((g) => ({
        ...g,
        normalizedCategory: normalize(g.category),
      }));

      setTops(all.filter((g) => g.normalizedCategory === "top"));
      setBottoms(all.filter((g) => g.normalizedCategory === "bottom"));
      setDresses(all.filter((g) => g.normalizedCategory === "dress"));
      setOuterwears(all.filter((g) => g.normalizedCategory === "outerwear"));
    } catch (err) {
      console.error(err);
      alert("Failed to load garments");
    }
  };

  const currentTop = tops[topIndex] || null;
  const currentBottom = bottoms[bottomIndex] || null;
  const currentDress = dresses[dressIndex] || null;
  const currentOuterwear = outerwears[outerwearIndex] || null;

  const viewOnMannequin = () => {
    const outfit = {
      top: selectedDress ? null : selectedTop,
      bottom: selectedDress ? null : selectedBottom,
      dress: selectedDress,
      outerwear: selectedOuterwear,
    };

    localStorage.setItem("currentOutfit", JSON.stringify(outfit));
    window.location.href = "/mannequin";
  };

  const canView = selectedDress || selectedTop || selectedBottom || selectedOuterwear;

  return (
    <div className="min-h-screen flex bg-background">
      <AppNav />

      <main style={styles.page}>
        <div style={styles.header}>
          <p style={styles.kicker}>Style Studio</p>
          <h1 style={styles.title}>Outfit Builder</h1>
          <p style={styles.subtitle}>
            Mix tops, pants, dresses, and outerwear from your wardrobe.
          </p>
        </div>

        <div style={styles.builderGrid}>
          <ClothSection
            title="Top"
            item={currentTop}
            count={tops.length}
            empty="No tops available"
            onNext={() => setTopIndex((p) => (p + 1) % tops.length)}
            onSelect={() => setSelectedTop(currentTop)}
            onDeselect={() => setSelectedTop(null)}
            isSelected={selectedTop && selectedTop.id === currentTop?.id}
            disabled={!!selectedDress}
            styles={styles}
          />

          <ClothSection
            title="Pant / Bottom"
            item={currentBottom}
            count={bottoms.length}
            empty="No pants/bottoms available"
            onNext={() => setBottomIndex((p) => (p + 1) % bottoms.length)}
            onSelect={() => setSelectedBottom(currentBottom)}
            onDeselect={() => setSelectedBottom(null)}
            isSelected={selectedBottom && selectedBottom.id === currentBottom?.id}
            disabled={!!selectedDress}
            styles={styles}
          />

          <ClothSection
            title="Dress"
            item={currentDress}
            count={dresses.length}
            empty="No dresses available"
            onNext={() => setDressIndex((p) => (p + 1) % dresses.length)}
            onSelect={() => {
              setSelectedDress(currentDress);
              setSelectedTop(null);
              setSelectedBottom(null);
            }}
            onDeselect={() => setSelectedDress(null)}
            isSelected={selectedDress && selectedDress.id === currentDress?.id}
            styles={styles}
          />

          <ClothSection
            title="Outerwear"
            item={currentOuterwear}
            count={outerwears.length}
            empty="No outerwear available"
            onNext={() => setOuterwearIndex((p) => (p + 1) % outerwears.length)}
            onSelect={() => setSelectedOuterwear(currentOuterwear)}
            onDeselect={() => setSelectedOuterwear(null)}
            isSelected={selectedOuterwear && selectedOuterwear.id === currentOuterwear?.id}
            styles={styles}
          />
        </div>

        <section style={styles.previewCard}>
          <p style={styles.kicker}>Preview</p>
          <h2 style={styles.sectionTitle}>Selected Outfit</h2>

          {/* OVERLAPPING MANNEQUIN-STYLE PREVIEW */}
          <div style={styles.mannequinBox}>
            {selectedDress ? (
              <img
                src={selectedDress.image_url}
                alt="dress"
                style={styles.regionDress}
              />
            ) : (
              <>
                {selectedTop && (
                  <img
                    src={selectedTop.image_url}
                    alt="top"
                    style={styles.regionTop}
                  />
                )}

                {selectedBottom && (
                  <img
                    src={selectedBottom.image_url}
                    alt="bottom"
                    style={styles.regionBottom}
                  />
                )}
              </>
            )}

            {selectedOuterwear && (
              <img
                src={selectedOuterwear.image_url}
                alt="outerwear"
                style={styles.regionOuterwear}
              />
            )}

            {!canView && (
              <p style={styles.mannequinEmptyText}>Select garments to preview</p>
            )}
          </div>

          {canView && (
            <button style={styles.viewBtn} onClick={viewOnMannequin}>
              View On Mannequin →
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

function ClothSection({ title, item, count, empty, onNext, onSelect, onDeselect, isSelected, disabled, styles }) {
  return (
    <section style={{ ...styles.card, ...(isSelected ? styles.cardSelected : {}), ...(disabled ? styles.cardDisabled : {}) }}>
      <div style={styles.cardHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {isSelected && <span style={styles.selectedBadge}>✓ Selected</span>}
        {disabled && <span style={styles.disabledBadge}>Dress active</span>}
      </div>

      {item ? (
        <>
          <div style={{ ...styles.imageBox, ...(disabled ? styles.imageBoxDisabled : {}) }}>
            <img src={item.image_url} alt={title} style={{ ...styles.garmentImage, ...(disabled ? { opacity: 0.35 } : {}) }} />
          </div>

          <p style={styles.meta}>
            {item.category} • {item.color} • {item.fabric} • {item.style}
          </p>

          <p style={styles.countText}>
            {count} item{count === 1 ? "" : "s"} available
          </p>

          <div style={styles.buttonRow}>
            <button style={styles.secondaryBtn} onClick={onNext} disabled={disabled}>
              Next
            </button>

            {isSelected ? (
              <button style={styles.deselectBtn} onClick={onDeselect}>
                Remove
              </button>
            ) : (
              <button
                style={{ ...styles.primaryBtn, ...(disabled ? styles.primaryBtnDisabled : {}) }}
                onClick={onSelect}
                disabled={disabled}
              >
                Select
              </button>
            )}
          </div>
        </>
      ) : (
        <p style={styles.emptyText}>{empty}</p>
      )}
    </section>
  );
}

const styles = {
  page: {
    flex: 1,
    padding: "40px",
    background: "var(--background)",
    color: "var(--foreground)",
  },

  header: {
    marginBottom: "28px",
    textAlign: "left",
  },

  kicker: {
    margin: 0,
    color: "var(--accent)",
    fontWeight: 700,
    letterSpacing: "0.04em",
  },

  title: {
    margin: "8px 0",
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: "44px",
    fontWeight: 700,
  },

  subtitle: {
    margin: 0,
    color: "var(--muted-foreground)",
    maxWidth: "720px",
  },

  builderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    marginBottom: "28px",
  },

  card: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "border-color 0.2s",
  },

  cardSelected: {
    border: "2px solid var(--accent)",
    boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "18px",
  },

  selectedBadge: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--accent)",
    background: "var(--secondary)",
    borderRadius: "20px",
    padding: "3px 10px",
    letterSpacing: "0.03em",
  },

  sectionTitle: {
    margin: 0,
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: "28px",
    fontWeight: 600,
  },

  imageBox: {
    background: "var(--secondary)",
    borderRadius: "22px",
    padding: "18px",
    minHeight: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  garmentImage: {
    width: "210px",
    height: "230px",
    objectFit: "contain",
    filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.16))",
  },

  meta: {
    color: "var(--muted-foreground)",
    fontWeight: 600,
    textTransform: "capitalize",
  },

  countText: {
    fontSize: "13px",
    color: "var(--accent)",
    fontWeight: 700,
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "16px",
  },

  primaryBtn: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    border: "none",
    borderRadius: "14px",
    padding: "11px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "var(--secondary)",
    color: "var(--secondary-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "11px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  previewCard: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  // --- Overlapping mannequin-style preview (merged from the layered version) ---
  mannequinBox: {
    position: "relative",
    width: "320px",
    height: "560px",
    margin: "18px auto 0",
    border: "2px dashed var(--border)",
    borderRadius: "20px",
    background: "var(--secondary)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  regionTop: {
    position: "absolute",
    left: "50%",
    top: "10%",
    transform: "translateX(-50%)",
    width: "78%",
    height: "42%",
    objectFit: "contain",
    filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.16))",
    zIndex: 2,
  },

  regionBottom: {
    position: "absolute",
    left: "50%",
    top: "42%",
    transform: "translateX(-50%)",
    width: "72%",
    height: "50%",
    objectFit: "contain",
    filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.16))",
    zIndex: 1,
  },

  regionDress: {
    position: "absolute",
    left: "50%",
    top: "10%",
    transform: "translateX(-50%)",
    width: "78%",
    height: "82%",
    objectFit: "contain",
    filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.16))",
    zIndex: 2,
  },

  regionOuterwear: {
    position: "absolute",
    left: "50%",
    top: "8%",
    transform: "translateX(-50%)",
    width: "86%",
    height: "46%",
    objectFit: "contain",
    filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.2))",
    zIndex: 3,
  },

  mannequinEmptyText: {
    color: "var(--muted-foreground)",
    fontWeight: 600,
  },

  viewBtn: {
    marginTop: "24px",
    background: "var(--accent)",
    color: "var(--accent-foreground)",
    border: "none",
    borderRadius: "16px",
    padding: "13px 22px",
    fontWeight: 700,
    cursor: "pointer",
  },

  deselectBtn: {
    background: "transparent",
    color: "var(--muted-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "11px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  cardDisabled: {
    opacity: 0.6,
    pointerEvents: "none",
  },

  disabledBadge: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--muted-foreground)",
    background: "var(--secondary)",
    borderRadius: "20px",
    padding: "3px 10px",
    letterSpacing: "0.03em",
  },

  imageBoxDisabled: {
    filter: "grayscale(0.4)",
  },

  primaryBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },

  emptyText: {
    color: "var(--muted-foreground)",
    fontWeight: 600,
  },
};