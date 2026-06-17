import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { toast } from "sonner";

const BODY_TYPES = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    height: "",
    bodyType: "",
    location: "",
    stylePreferences: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/user/profile");
        setForm({
          height: data?.height || "",
          bodyType: data?.bodyType || "",
          location: data?.location || "",
          stylePreferences: Array.isArray(data?.stylePreferences)
            ? data.stylePreferences.join(", ")
            : data?.stylePreferences || "",
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        height: form.height,
        bodyType: form.bodyType,
        location: form.location,
        stylePreferences: form.stylePreferences
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await axiosInstance.put("/user/profile", payload);
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-rose-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-stone-900">Your Profile</h1>
            <p className="text-sm text-stone-500 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-stone-600 hover:text-stone-900 underline underline-offset-4"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl bg-white shadow-xl shadow-stone-200/60 p-8 border border-stone-100 space-y-5"
        >
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">Height (cm)</label>
            <input
              type="number"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              placeholder="170"
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">Body Type</label>
            <select
              value={form.bodyType}
              onChange={(e) => setForm({ ...form, bodyType: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
            >
              <option value="">Select body type</option>
              {BODY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Mumbai, India"
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Style Preferences <span className="text-stone-400">(comma-separated)</span>
            </label>
            <textarea
              value={form.stylePreferences}
              onChange={(e) => setForm({ ...form, stylePreferences: e.target.value })}
              placeholder="minimal, streetwear, boho"
              rows={3}
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 text-white py-2.5 text-sm font-medium hover:bg-stone-800 disabled:opacity-60 transition"
          >
            {saving && <Spinner />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
