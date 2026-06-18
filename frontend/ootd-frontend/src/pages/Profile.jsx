import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const BODY_TYPES = ['slim', 'athletic', 'average', 'curvy', 'plus'];

export default function Profile() {
  const { logout } = useAuth();
  const [form, setForm] = useState({ height: '', bodyType: '', location: '', stylePreferences: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axiosInstance.get('/profile')
      .then((res) => setForm({
        height: res.data.height || '',
        bodyType: res.data.bodyType || '',
        location: res.data.location || '',
        stylePreferences: res.data.stylePreferences || '',
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await axiosInstance.put('/profile', form);
      setMessage({ type: 'success', text: 'Profile updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your profile</h1>
            <p className="text-slate-500">Tell us about your style</p>
          </div>
          <button onClick={logout}
            className="text-sm text-slate-600 hover:text-red-600 font-medium">Logout</button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
            <input type="number" name="height" value={form.height} onChange={handleChange}
              className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Body type</label>
            <select name="bodyType" value={form.bodyType} onChange={handleChange}
              className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
              <option value="">Select…</option>
              {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Style preferences</label>
            <textarea name="stylePreferences" rows={4} value={form.stylePreferences} onChange={handleChange}
              placeholder="e.g. minimalist, streetwear, vintage…"
              className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 transition">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
