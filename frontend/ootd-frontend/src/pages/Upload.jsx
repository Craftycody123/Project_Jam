import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function Upload() {
const [file, setFile] = useState(null);
const [preview, setPreview] = useState("");

const [category, setCategory] = useState("");
const [color, setColor] = useState("");
const [fabric, setFabric] = useState("");
const [style, setStyle] = useState("");

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const handleFileChange = (e) => {
const selectedFile = e.target.files[0];


if (!selectedFile) return;

setFile(selectedFile);
setPreview(URL.createObjectURL(selectedFile));


};

const handleUpload = async () => {
if (!file) {
setMessage("Please select an image.");
return;
}


try {
  setLoading(true);
  setMessage("");

  const formData = new FormData();

  formData.append("file", file);
  formData.append("category", category);
  formData.append("color", color);
  formData.append("fabric", fabric);
  formData.append("style", style);
  formData.append("tags", "[]");

  const response = await axiosInstance.post(
    "/garments/upload",
    formData
  );

  console.log(response.data);

  setMessage("Upload successful!");

  setFile(null);
  setPreview("");
  setCategory("");
  setColor("");
  setFabric("");
  setStyle("");
} catch (error) {
  console.error(error);
  setMessage("Upload failed.");
} finally {
  setLoading(false);
}


};

return ( <div> <h2>Upload Outfit</h2>


  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
  />

  {preview && (
    <img
      src={preview}
      alt="Preview"
      width="200"
    />
  )}

  <input
    type="text"
    placeholder="Category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  />

  <input
    type="text"
    placeholder="Color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
  />

  <input
    type="text"
    placeholder="Fabric"
    value={fabric}
    onChange={(e) => setFabric(e.target.value)}
  />

  <input
    type="text"
    placeholder="Style"
    value={style}
    onChange={(e) => setStyle(e.target.value)}
  />

  <button
    onClick={handleUpload}
    disabled={loading}
  >
    {loading ? "Uploading..." : "Upload"}
  </button>

  {message && <p>{message}</p>}
</div>


);
}
