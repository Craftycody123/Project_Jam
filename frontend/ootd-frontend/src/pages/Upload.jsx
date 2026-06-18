import { useState } from "react";
import { garmentAPI } from "../services/api";

export default function Upload() {
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    category: "top",
    color: "",
    fabric: "light",
    style: "casual",
    tags: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      const data = new FormData();

      data.append("file", image);
      data.append("category", form.category);
      data.append("color", form.color);
      data.append("fabric", form.fabric);
      data.append("style", form.style);

      data.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );

      await garmentAPI.uploadGarment(data);

      alert("Cloth uploaded successfully");

      setImage(null);

      setForm({
        category: "top",
        color: "",
        fabric: "light",
        style: "casual",
        tags: "",
      });
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="page">
      <h1 className="title">Upload Outfit</h1>

      <form className="card" onSubmit={handleUpload}>
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <select
          className="input"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="outerwear">Outerwear</option>
          <option value="dress">Dress</option>
        </select>

        <input
          className="input"
          name="color"
          placeholder="Color e.g. black, blue, white"
          value={form.color}
          onChange={handleChange}
        />

        <select
          className="input"
          name="fabric"
          value={form.fabric}
          onChange={handleChange}
        >
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </select>

        <select
          className="input"
          name="style"
          value={form.style}
          onChange={handleChange}
        >
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="party">Party</option>
          <option value="sports">Sports</option>
        </select>

        <input
          className="input"
          name="tags"
          placeholder="Tags: summer, college, light"
          value={form.tags}
          onChange={handleChange}
        />

        <button className="btn" style={{ marginTop: "15px" }}>
          Upload Cloth
        </button>
      </form>
    </div>
  );
}