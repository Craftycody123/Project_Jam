import { useEffect, useState } from "react";
import { garmentAPI } from "../services/api";

export default function OutfitBuilder() {
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);

  const loadGarments = async () => {
    try {
      const res = await garmentAPI.getGarments();

      const topsOnly = res.data.filter(
        (g) => g.category?.toLowerCase() === "top"
      );

      const bottomsOnly = res.data.filter(
        (g) => g.category?.toLowerCase() === "bottom"
      );

      setTops(topsOnly);
      setBottoms(bottomsOnly);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGarments();
  }, []);

  const currentTop = tops.length > 0 ? tops[topIndex] : null;
  const currentBottom = bottoms.length > 0 ? bottoms[bottomIndex] : null;

  const nextTop = () => {
    if (tops.length === 0) return;
    setTopIndex((prev) => (prev + 1) % tops.length);
  };

  const nextBottom = () => {
    if (bottoms.length === 0) return;
    setBottomIndex((prev) => (prev + 1) % bottoms.length);
  };

  const selectTop = () => {
    if (currentTop) setSelectedTop(currentTop);
  };

  const selectBottom = () => {
    if (currentBottom) setSelectedBottom(currentBottom);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Outfit Builder</h1>

      {/* TOP SECTION */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Top</h2>

        {currentTop ? (
          <div>
            <img
              src={currentTop.image_url}
              alt="top"
              style={{ width: "200px", borderRadius: "10px" }}
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={nextTop}>Next Top</button>
              <button onClick={selectTop} style={{ marginLeft: "10px" }}>
                Select Top
              </button>
            </div>
          </div>
        ) : (
          <p>No tops available</p>
        )}
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Bottom</h2>

        {currentBottom ? (
          <div>
            <img
              src={currentBottom.image_url}
              alt="bottom"
              style={{ width: "200px", borderRadius: "10px" }}
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={nextBottom}>Next Bottom</button>
              <button onClick={selectBottom} style={{ marginLeft: "10px" }}>
                Select Bottom
              </button>
            </div>
          </div>
        ) : (
          <p>No bottoms available</p>
        )}
      </div>

      <hr />

      {/* SELECTED OUTFIT PREVIEW (VERTICAL) */}
      <h3>Selected Outfit</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {selectedTop && (
          <img
            src={selectedTop.image_url}
            alt="selected top"
            width="160"
            style={{ borderRadius: "10px" }}
          />
        )}

        {selectedTop && selectedBottom && (
          <div style={{ fontSize: "24px" }}>↓</div>
        )}

        {selectedBottom && (
          <img
            src={selectedBottom.image_url}
            alt="selected bottom"
            width="160"
            style={{ borderRadius: "10px" }}
          />
        )}
      </div>

      {/* MANNEQUIN BUTTON */}
      {selectedTop && selectedBottom && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button>
            View On Mannequin →
          </button>
        </div>
      )}
    </div>
  );
}