import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (!form.confirm) e.confirm = "Please confirm";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate({ to: "/login" });
    } catch (err) {
      setServerError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-medium text-stone-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition"
      />
      {errors[key] && <p className="mt-1 text-xs text-rose-600">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 via-stone-50 to-rose-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif tracking-tight text-stone-900">OOTD</h1>
          <p className="mt-2 text-sm text-stone-500 tracking-widest uppercase">Join the wardrobe</p>
        </div>
        <div className="rounded-2xl bg-white shadow-xl shadow-stone-200/60 p-8 border border-stone-100">
          <h2 className="text-2xl font-semibold text-stone-900">Create account</h2>
          <p className="mt-1 text-sm text-stone-500">Curate your style in minutes</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {field("name", "Name", "text", "Ishan")}
            {field("email", "Email", "email", "you@example.com")}
            {field("password", "Password", "password", "At least 6 characters")}
            {field("confirm", "Confirm password", "password", "Repeat password")}

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
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-stone-900 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
