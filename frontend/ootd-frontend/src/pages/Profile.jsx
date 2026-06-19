import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import AppNav from "../components/AppNav";

const BODY_TYPES = ["slim", "athletic", "average", "curvy", "plus"];

export default function Profile() {
  const { logout } = useAuth();
  const [form, setForm] = useState({ height: "", bodyType: "", location: "", stylePreferences: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axiosInstance.get("/user/profile")
      .then((res) => setForm({
        height: res.data.height || "",
        bodyType: res.data.bodyType || "",
        location: res.data.location || "",
        stylePreferences: res.data.stylePreferences || "",
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    try {
      await axiosInstance.put("/user/profile", form);
      setMessage({ type: "success", text: "Profile updated!" });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Update failed." });
    } finally { setSaving(false); }
  };

  const input = "w-full rounded-lg border border-border bg-card px-3 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none";

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background">
        <AppNav />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AppNav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
          <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Your details</span>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold">Profile</h1>
              <p className="mt-2 text-muted-foreground">Tell us about your style so Atelier can dress you well.</p>
            </div>
            <button onClick={logout} className="text-sm font-medium text-muted-foreground hover:text-red-600">Logout</button>
          </div>

          {message && (
            <div className={`mt-6 p-3 rounded-lg text-sm border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Height (cm)</label>
              <input type="number" name="height" value={form.height} onChange={handleChange} className={input} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Body type</label>
              <select name="bodyType" value={form.bodyType} onChange={handleChange} className={input}>
                <option value="">Select…</option>
                {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} className={input} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Style preferences</label>
              <textarea name="stylePreferences" rows={4} value={form.stylePreferences} onChange={handleChange}
                placeholder="e.g. minimalist, streetwear, vintage…" className={input} />
            </div>

            <button type="submit" disabled={saving}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 transition">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
