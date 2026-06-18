import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import GarmentCard from "../components/GarmentCard";

export default function Wardrobe() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGarments();
  }, []);

  const fetchGarments = async () => {
    try {
      const response = await axiosInstance.get("/garments");
      setGarments(response.data);
    } catch (error) {
      console.error("Failed to fetch garments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>Loading wardrobe...</h3>;
  }

  return (
    <div>
      <h2>My Wardrobe</h2>

      {garments.length === 0 ? (
        <p>No garments uploaded yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {garments.map((item) => (
            <GarmentCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}