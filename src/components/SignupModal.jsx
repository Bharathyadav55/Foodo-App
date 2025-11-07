import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SignupModal({ isOpen, onClose, onSwitchToLogin, setUser }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailOrPhone: "",
    password: "",
    dob: { day: "", month: "", year: "" },
    gender: "Female",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (["day", "month", "year"].includes(name)) {
      setForm((p) => ({ ...p, dob: { ...p.dob, [name]: value } }));
    } else setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("https://foodo-app-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token and set user
      localStorage.setItem("token", data.token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        photo: data.user.photo
      });

      onClose();
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"/>
      <motion.section initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="fixed inset-0 m-auto w-full max-w-2xl bg-white rounded-2xl border border-black/10 shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-semibold">Create a new account</h1>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-black/5">✕</button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="border rounded-lg px-3 py-2" name="firstName" placeholder="First name" onChange={onChange} required />
            <input className="border rounded-lg px-3 py-2" name="lastName" placeholder="Surname" onChange={onChange} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <select className="border rounded-lg px-3 py-2" name="day" onChange={onChange}>
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
            <select className="border rounded-lg px-3 py-2" name="month" onChange={onChange}>
              <option value="">Month</option>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (<option key={m} value={i + 1}>{m}</option>))}
            </select>
            <select className="border rounded-lg px-3 py-2" name="year" onChange={onChange}>
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => 2025 - i).map((y) => (<option key={y} value={y}>{y}</option>))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Female", "Male", "Custom"].map((g) => (
              <label key={g} className={`flex items-center justify-between gap-2 rounded-lg px-4 py-3 cursor-pointer shadow-[inset_0_0_0_1px_#000] hover:shadow-[inset_0_0_0_2px_#000] ${form.gender === g ? "bg-black text-white" : ""}`}>
                <span>{g}</span>
                <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={onChange} className="h-4 w-4 accent-black"/>
              </label>
            ))}
          </div>

          <input className="border rounded-lg px-3 py-2 w-full" name="emailOrPhone" type="email" placeholder="Email address" onChange={onChange} required />
          <input className="border rounded-lg px-3 py-2 w-full" type="password" name="password" placeholder="New password (min 6 characters)" onChange={onChange} minLength="6" required />

          <p className="text-sm text-gray-700">By clicking <strong>Sign Up</strong>, you agree to our Terms, Privacy Policy and Cookies Policy.</p>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="text-center">
            <button type="button" onClick={onSwitchToLogin} className="text-base underline underline-offset-4 hover:no-underline">
              Already have an account?
            </button>
          </div>
        </form>
      </motion.section>
    </AnimatePresence>
  );
}
