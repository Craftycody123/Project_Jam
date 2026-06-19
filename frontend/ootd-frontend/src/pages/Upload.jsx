import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import AppNav from "../components/AppNav";
export default function Upload() {
const [image, setImage] = useState(null);

const [form, setForm] = useState({
category: "top",
color: "",
fabric: "light",
style: "casual",
tags: "",
});

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

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
  setLoading(true);
  setMessage("");

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

  const response = await axiosInstance.post(
    "/garments/upload",
    data
  );

  console.log(response.data);

  setMessage("Cloth uploaded successfully");

  setImage(null);

  setForm({
    category: "top",
    color: "",
    fabric: "light",
    style: "casual",
    tags: "",
  });
} catch (err) {
  console.error(err);
  setMessage("Upload failed");
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex bg-background">
<AppNav />
<main className="flex-1 p-6" style={{ textAlign: "center" }}>
<h1 className="title">Upload Garment</h1>
<form
  className="card"
  onSubmit={handleUpload}
  style={{
    maxWidth: "700px",
    margin: "0 auto",
  }}
>
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
  <option value="">Select Category</option>
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
  <option value="">Select Fabric</option>
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
  <option value="">Select Style</option>
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

    <button
      className="btn"
      type="submit"
      disabled={loading}
      style={{ marginTop: "15px" }}
    >
      {loading ? "Uploading..." : "Upload"}
    </button>

    {message && (
      <p style={{ marginTop: "10px" }}>
        {message}
      </p>
    )}
  </form>
  


</main>
</div>
);


}
