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
            styles={styles}
          />

          <ClothSection
            title="Pant / Bottom"
            item={currentBottom}
            count={bottoms.length}
            empty="No pants/bottoms available"
            onNext={() => setBottomIndex((p) => (p + 1) % bottoms.length)}
            onSelect={() => setSelectedBottom(currentBottom)}
            styles={styles}
          />

          <ClothSection
            title="Dress"
            item={currentDress}
            count={dresses.length}
            empty="No dresses available"
            onNext={() => setDressIndex((p) => (p + 1) % dresses.length)}
            onSelect={() => setSelectedDress(currentDress)}
            styles={styles}
          />

          <ClothSection
            title="Outerwear"
            item={currentOuterwear}
            count={outerwears.length}
            empty="No outerwear available"
            onNext={() => setOuterwearIndex((p) => (p + 1) % outerwears.length)}
            onSelect={() => setSelectedOuterwear(currentOuterwear)}
            styles={styles}
          />
        </div>

        <section style={styles.previewCard}>
          <p style={styles.kicker}>Preview</p>
          <h2 style={styles.sectionTitle}>Selected Outfit</h2>

          <div style={styles.previewStack}>
            {selectedDress ? (
              <PreviewItem item={selectedDress} label="Dress" styles={styles} />
            ) : (
              <>
                {selectedTop && (
                  <PreviewItem item={selectedTop} label="Top" styles={styles} />
                )}

                {selectedTop && selectedBottom && <div style={styles.arrow}>↓</div>}

                {selectedBottom && (
                  <PreviewItem item={selectedBottom} label="Bottom" styles={styles} />
                )}
              </>
            )}

            {selectedOuterwear && (
              <>
                <div style={styles.arrow}>+</div>
                <PreviewItem item={selectedOuterwear} label="Outerwear" styles={styles} />
              </>
            )}

            {!canView && <p style={styles.emptyText}>Select garments to preview</p>}
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

function ClothSection({ title, item, count, empty, onNext, onSelect, styles }) {
  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>{title}</h2>

      {item ? (
        <>
          <div style={styles.imageBox}>
            <img src={item.image_url} alt={title} style={styles.garmentImage} />
          </div>

          <p style={styles.meta}>
            {item.category} • {item.color} • {item.fabric} • {item.style}
          </p>

          <p style={styles.countText}>
            {count} item{count === 1 ? "" : "s"} available
          </p>

          <div style={styles.buttonRow}>
            <button style={styles.secondaryBtn} onClick={onNext}>
              Next
            </button>

            <button style={styles.primaryBtn} onClick={onSelect}>
              Select
            </button>
          </div>
        </>
      ) : (
        <p style={styles.emptyText}>{empty}</p>
      )}
    </section>
  );
}

function PreviewItem({ item, label, styles }) {
  return (
    <div style={styles.previewItem}>
      <img src={item.image_url} alt={label} style={styles.previewImage} />
      <p style={styles.previewLabel}>{label}</p>
    </div>
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
  },

  sectionTitle: {
    margin: "0 0 18px",
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

  previewStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    marginTop: "18px",
  },

  previewItem: {
    textAlign: "center",
  },

  previewImage: {
    width: "180px",
    height: "190px",
    objectFit: "contain",
    borderRadius: "18px",
    background: "var(--secondary)",
    padding: "12px",
    filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.16))",
  },

  previewLabel: {
    margin: "8px 0 0",
    fontWeight: 700,
    color: "var(--muted-foreground)",
  },

  arrow: {
    fontSize: "28px",
    color: "var(--accent)",
    fontWeight: 700,
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

  emptyText: {
    color: "var(--muted-foreground)",
    fontWeight: 600,
  },
};