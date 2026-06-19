import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import AppNav from "../components/AppNav";

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Dresses", "Shoes"];

// Fallback seed so the page looks alive before your backend is wired up.
const SEED = [
  { id: "1", name: "Crisp Cotton Shirt", category: "Tops", color: "White", fabric: "Cotton", style: "Classic", image: "" , addedAt: Date.now() - 4 * 864e5 },
  { id: "2", name: "Indigo Straight Jeans", category: "Bottoms", color: "Blue", fabric: "Denim", style: "Casual", image: "", addedAt: Date.now() - 30 * 864e5 },
  { id: "3", name: "Camel Trench Coat", category: "Outerwear", color: "Camel", fabric: "Cotton", style: "Elegant", image: "", addedAt: Date.now() - 2 * 864e5 },
  { id: "4", name: "Little Black Dress", category: "Dresses", color: "Black", fabric: "Silk", style: "Evening", image: "", addedAt: Date.now() - 60 * 864e5 },
  { id: "5", name: "White Leather Sneakers", category: "Shoes", color: "White", fabric: "Leather", style: "Minimal", image: "", addedAt: Date.now() - 10 * 864e5 },
  { id: "6", name: "Olive Wool Blazer", category: "Outerwear", color: "Olive", fabric: "Wool", style: "Tailored", image: "", addedAt: Date.now() - 1 * 864e5 },
];

const isNew = (g) => Date.now() - (g.addedAt || 0) < 7 * 864e5;

export default function Wardrobe() {
  const [garments, setGarments] = useState(SEED);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axiosInstance.get("/wardrobe")
      .then((res) => { if (Array.isArray(res.data) && res.data.length) setGarments(res.data); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? garments : garments.filter((g) => g.category === filter)),
    [garments, filter]
  );
  const newCount = garments.filter(isNew).length;

  return (
    <div className="min-h-screen flex bg-background">
      <AppNav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
          <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Your Wardrobe</span>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold leading-tight">Everything you own</h1>
              <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                {garments.length} pieces catalogued{newCount ? ` · ${newCount} added recently` : ""}.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? garments.length : garments.filter((g) => g.category === cat).length;
              const active = filter === cat;
              return (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    active ? "border-primary bg-primary text-primary-foreground"
                           : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}>
                  {cat}<span className="ml-1.5 text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          {filtered.length > 0 ? (
            <div className="perspective-near mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((g, i) => <GarmentCard key={g.id} garment={g} isNew={isNew(g)} index={i} />)}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="font-serif text-xl font-semibold">Nothing here yet</p>
              <p className="mt-2 max-w-xs text-muted-foreground">No {filter.toLowerCase()} in your wardrobe.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function GarmentCard({ garment, isNew, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl border border-border bg-card p-3 shadow-sm hover:shadow-xl transition-shadow"
    >
      {isNew && (
        <span className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow">
          <Sparkle className="w-3 h-3" /> New
        </span>
      )}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
        {garment.image ? (
          <img src={garment.image} alt={garment.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">{garment.category}</div>
        )}
      </div>
      <div className="px-1 pt-3 pb-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-medium">{garment.name}</h3>
          <span className="shrink-0 text-xs text-muted-foreground">{garment.category}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[garment.color, garment.fabric, garment.style].filter(Boolean).map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
