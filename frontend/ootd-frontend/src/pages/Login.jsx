import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shirt, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/wardrobe");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-background">
      <div className="hidden lg:flex w-1/2 relative items-end p-10 bg-[oklch(0.3_0.04_50)]">
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.03_48)] via-transparent to-[oklch(0.22_0.03_48)]/40" />
        <div className="relative">
          <p className="font-serif text-3xl font-semibold leading-tight text-[oklch(0.96_0.02_85)] max-w-sm">
            “The best outfit is the one you forgot you owned.”
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

          <h1 className="font-serif text-3xl font-semibold leading-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to step back into your closet.</p>

          {serverError && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email" name="email" required value={form.email} onChange={handleChange}
                placeholder="you@atelier.app"
                className="w-full rounded-lg border border-border bg-card px-3 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password" name="password" required value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-card px-3 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
              />
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 transition">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New to Atelier?{" "}
            <Link to="/signup" className="font-medium text-accent hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
