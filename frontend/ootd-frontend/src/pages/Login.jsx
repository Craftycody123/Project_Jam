import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate({ to: '/profile' });
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500 mb-6">Sign in to your OOTD account</p>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password" name="password" required value={form.password} onChange={handleChange}
              className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600">
          No account?{' '}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
