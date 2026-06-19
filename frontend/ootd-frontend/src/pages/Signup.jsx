import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shirt, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (form.password !== form.confirm) return setServerError("Passwords do not match");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/login");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full rounded-lg border border-border bg-card px-3 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none";

  return (
    <main className="min-h-screen flex bg-background">
      <div className="hidden lg:flex w-1/2 relative items-end p-10 bg-[oklch(0.3_0.04_50)]">
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.03_48)] via-transparent to-[oklch(0.22_0.03_48)]/40" />
        <div className="relative">
          <p className="font-serif text-3xl font-semibold leading-tight text-[oklch(0.96_0.02_85)] max-w-sm">
            Step inside a closet that knows you.
          </p>
          <p className="mt-3 text-sm text-[oklch(0.82_0.02_85)]">Atelier — your wardrobe, organized.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <span className="flex w-9 h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shirt className="w-5 h-5" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight">Atelier</span>
          </Link>

          <h1 className="font-serif text-3xl font-semibold leading-tight">Create your wardrobe</h1>
          <p className="mt-2 text-muted-foreground">A few details and your closet is ready to fill.</p>

          {serverError && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Full name</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} className={input} placeholder="Maya Hart" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className={input} placeholder="you@atelier.app" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} className={input} placeholder="••••••••" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Confirm password</label>
              <input type="password" name="confirm" required value={form.confirm} onChange={handleChange} className={input} placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 transition">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
