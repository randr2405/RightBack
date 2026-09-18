"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed.");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-black/10 shadow-sm p-8 w-full max-w-sm"
      >
        <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center mb-5">
          <Lock size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-black mb-1">
          RightBack <span className="text-red">Admin</span>
        </h1>
        <p className="text-sm text-black/50 mb-6">
          Enter the admin password to manage site settings.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/40 transition-all"
          autoFocus
        />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red mt-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 py-3 rounded-full border border-red text-black text-sm font-medium hover:bg-red hover:text-white transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </motion.form>
    </div>
  );
}