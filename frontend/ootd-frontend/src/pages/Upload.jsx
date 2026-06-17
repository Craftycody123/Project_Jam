import { useState } from "react";

export default function Upload() {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [fabric, setFabric] = useState("");
  const [style, setStyle] = useState("");

  return (
    <div>
      <h2>Upload Outfit</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(
            URL.createObjectURL(e.target.files[0])
          )
        }
      />

      {image && (
        <img
          src={image}
          alt="preview"
          width="200"
        />
      )}

      <input
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      <input
        placeholder="Color"
        value={color}
        onChange={(e) =>
          setColor(e.target.value)
        }
      />

      <input
        placeholder="Fabric"
        value={fabric}
        onChange={(e) =>
          setFabric(e.target.value)
        }
      />

      <input
        placeholder="Style"
        value={style}
        onChange={(e) =>
          setStyle(e.target.value)
        }
      />

      <button>Upload</button>
    </div>
  );
}