export default function OutfitSlider({
  current,
  prev,
  next,
}) {
  return (
    <div>
      <button onClick={prev}>
        ⬅ Previous
      </button>

      <span
        style={{
          margin: "0 20px",
        }}
      >
        Outfit #{current + 1}
      </span>

      <button onClick={next}>
        Next ➡
      </button>
    </div>
  );
}