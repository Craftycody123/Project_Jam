import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/profile" );
    } catch (err) {
      setServerError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 via-stone-50 to-rose-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif tracking-tight text-stone-900">OOTD</h1>
          <p className="mt-2 text-sm text-stone-500 tracking-widest uppercase">Welcome back</p>
        </div>
        <div className="rounded-2xl bg-white shadow-xl shadow-stone-200/60 p-8 border border-stone-100">
          <h2 className="text-2xl font-semibold text-stone-900">Sign in</h2>
          <p className="mt-1 text-sm text-stone-500">Continue curating your style</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
              />
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
            </div>

            {serverError && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 text-white py-2.5 text-sm font-medium hover:bg-stone-800 disabled:opacity-60 transition"
            >
              {loading && <Spinner />}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            New to OOTD?{" "}
            <Link to="/signup" className="font-medium text-stone-900 underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
