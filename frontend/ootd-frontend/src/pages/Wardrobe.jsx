import { useEffect, useState } from "react";
import { garmentAPI } from "../services/api";
import GarmentCard from "../components/GarmentCard";

export default function Wardrobe() {
const [garments, setGarments] = useState([]);
const [loading, setLoading] = useState(true);

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

if (loading) {
return ( <div className="page"> <h2>Loading wardrobe...</h2> </div>
);
}

return ( <div className="page"> <h1 className="title">My Wardrobe</h1>


  {garments.length === 0 ? (
    <p>No clothes uploaded yet. Go to Upload page.</p>
  ) : (
    <div className="grid">
      {garments.map((item) => (
        <GarmentCard
          key={item.id}
          item={item}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )}
</div>


);
}
