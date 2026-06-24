import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import AppNav from "../components/AppNav";

const BODY_TYPES = [
  "hourglass",
  "pear",
  "apple",
  "rectangle",
  "inverted-triangle",
  "slim",
  "athletic",
  "average",
  "curvy",
  "plus",
];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.2em] text-[#3B2F25]/70 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // OLD FIELDS
    name: "",
    age: "",
    gender: "female",
    height: "",
    weight: "",
    body_type: "hourglass",

    // NEW FIELDS
    bodyType: "",
    location: "",
    stylePreferences: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/profile");

        if (data) {
          setForm((f) => ({
            ...f,

            // OLD DATA
            name: data.name || "",
            age: data.age || "",
            gender: data.gender || "female",
            height: data.height || "",
            weight: data.weight || "",
            body_type: data.body_type || "hourglass",

            // NEW DATA
            bodyType: data.bodyType || "",
            location: data.location || "",
            stylePreferences: data.stylePreferences || "",
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await axiosInstance.post("/profile", {
        ...form,

        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-lg bg-[#F5EFE4] border border-[#3B2F25]/20 text-[#3B2F25] focus:outline-none focus:border-[#C7693D] focus:ring-2 focus:ring-[#C7693D]/20";

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#F5EFE4]">
        <AppNav />

        <div className="flex-1 flex items-center justify-center text-[#5B4329] text-lg">
          Loading profile…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F5EFE4]">
      <AppNav />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10">

          {/* HEADER */}
          <div className="border-b border-[#3B2F25]/10 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C7693D]">
                YOUR DETAILS
              </span>

              <h1
                className="mt-2 text-[#3B2F25] text-4xl sm:text-5xl"
                style={{
                  fontFamily: "Fraunces, serif",
                }}
              >
                Profile
              </h1>

              <p className="mt-3 text-[#5B4329]/80">
                Tell Atelier more about your body, preferences, and style.
              </p>
            </div>

            <button
              onClick={logout}
              className="text-sm font-medium text-[#5B4329] hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* ALERTS */}
          {error && (
            <div className="mt-6 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 p-3 rounded-lg bg-green-100 text-green-800 border border-green-200 text-sm">
              {message}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={onSubmit}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white/70 backdrop-blur rounded-3xl shadow-xl p-8 border border-[#3B2F25]/10"
          >

            {/* NAME */}
            <Field label="Name">
              <input
                className={inputCls}
                value={form.name}
                onChange={update("name")}
                required
              />
            </Field>

            {/* AGE */}
            <Field label="Age">
              <input
                type="number"
                className={inputCls}
                value={form.age}
                onChange={update("age")}
                required
              />
            </Field>

            {/* GENDER */}
            <div className="md:col-span-2">
              <span className="block text-xs uppercase tracking-[0.2em] text-[#3B2F25]/70 mb-2">
                Gender
              </span>

              <div className="flex gap-6">
                {["female", "male"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={update("gender")}
                      className="accent-[#C7693D]"
                    />

                    <span className="capitalize text-[#3B2F25]">
                      {g}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* HEIGHT */}
            <Field label="Height (cm)">
              <input
                type="number"
                className={inputCls}
                value={form.height}
                onChange={update("height")}
                required
              />
            </Field>

            {/* WEIGHT */}
            <Field label="Weight (kg)">
              <input
                type="number"
                className={inputCls}
                value={form.weight}
                onChange={update("weight")}
                required
              />
            </Field>

            {/* BODY TYPE */}
            <div className="md:col-span-2">
              <Field label="Body Type">
                <select
                  className={inputCls}
                  value={form.body_type}
                  onChange={update("body_type")}
                >
                  {BODY_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* LOCATION */}
            <Field label="Location">
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className={inputCls}
                placeholder="Your city"
              />
            </Field>

            {/* STYLE PREFS */}
            <div className="md:col-span-2">
              <Field label="Style Preferences">
                <textarea
                  name="stylePreferences"
                  rows={4}
                  value={form.stylePreferences}
                  onChange={handleChange}
                  placeholder="Minimalist, streetwear, vintage, chic..."
                  className={inputCls}
                />
              </Field>
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex flex-wrap gap-4 mt-4">

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-full bg-[#3B2F25] text-[#F5EFE4] tracking-[0.2em] text-sm font-medium hover:bg-[#C7693D] transition disabled:opacity-60"
              >
                {saving ? "SAVING…" : "SAVE PROFILE"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/wardrobe")}
                className="px-6 py-3 rounded-full border border-[#3B2F25] text-[#3B2F25] tracking-[0.2em] text-sm font-medium hover:bg-[#3B2F25] hover:text-[#F5EFE4] transition"
              >
                GO TO WARDROBE →
              </button>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}