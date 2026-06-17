export default function GarmentCard({ item }) {

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify(item)
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={styles.card}
    >
      <img src={item.image_url} alt={item.category} style={styles.img} />
      <p>{item.category}</p>
      <p>{item.color}</p>
    </div>
  );
}

const styles = {
  card: {
    padding: "10px",
    background: "#fff",
    borderRadius: "10px",
    cursor: "grab"
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover"
  }
};