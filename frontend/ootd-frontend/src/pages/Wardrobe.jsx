
import { useEffect, useMemo, useState } from "react";
import { garmentAPI } from "../services/api";
import GarmentCard from "../components/GarmentCard";
import AppNav from "../components/AppNav";

const CATEGORIES = ["All", "top", "bottom", "outerwear", "dress"];

export default function Wardrobe() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = async () => {
    try {
      const res = await garmentAPI.getGarments();
      setGarments(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load wardrobe");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await garmentAPI.deleteGarment(id);

      setGarments((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const filteredGarments = useMemo(() => {
    if (filter === "All") return garments;

    return garments.filter(
      (item) =>
        item.category?.toLowerCase() ===
        filter.toLowerCase()
    );
  }, [garments, filter]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background">
        <AppNav />
        <div className="flex-1 flex items-center justify-center">
          <h2>Loading wardrobe...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AppNav />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8">

          <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
                Your Wardrobe
              </span>

              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold">
                Everything you own
              </h1>

              <p className="mt-2 text-muted-foreground">
                {garments.length} pieces catalogued
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? garments.length
                  : garments.filter(
                      (g) =>
                        g.category?.toLowerCase() ===
                        cat.toLowerCase()
                    ).length;

              const active = filter === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {cat}
                  <span className="ml-1.5 text-xs opacity-70">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredGarments.length === 0 ? (
            <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="font-serif text-xl font-semibold">
                Nothing here yet
              </p>

              <p className="mt-2 text-muted-foreground">
                Upload some clothes to build your wardrobe.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {filteredGarments.map((item) => (
                <GarmentCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

