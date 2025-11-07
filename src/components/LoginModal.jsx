import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoginModal({ isOpen, onClose, onSignupClick, setUser }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("https://foodo-app-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.identifier, 
          password: form.password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
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
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-2xl shadow-2xl border border-black/10 z-50"
      >
        <form onSubmit={onSubmit} className="p-8 space-y-5">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-lg"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-semibold block mb-2">Email</label>
            <input
              type="email"
              name="identifier"
              value={form.identifier}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-black/30 px-4 py-3"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-black/30 px-4 py-3"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <div className="my-3 h-px bg-black/10" />

          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:5000/api/auth/google";
            }}
            className="w-full flex items-center justify-center gap-3 border border-black/20 rounded-lg py-3 hover:bg-black/5 active:translate-y-px transition-all duration-300 ease-out"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Sign in with Google</span>
          </button>

          <button
            type="button"
            onClick={onSignupClick}
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-lg py-3"
          >
            Create new account
          </button>
        </form>
      </motion.section>
    </AnimatePresence>
  );
}
