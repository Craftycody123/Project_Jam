import { mockGarments } from "../utils/mockData";
import GarmentCard from "../components/GarmentCard";

export default function Wardrobe() {
  return (
    <div>
      <h2>My Wardrobe</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        {mockGarments.map((item) => (
          <GarmentCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}