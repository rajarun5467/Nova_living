import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const loggedInUser = await login(email, password);
      navigate(loggedInUser.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-40 pb-20">
      <h1 className="font-serif text-3xl mb-8">Welcome Back</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-black/10 rounded-lg px-4 py-3" />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-black/10 rounded-lg px-4 py-3" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-charcoal text-white py-3 rounded-full text-sm font-medium">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-sm text-charcoal/60 mt-6">
        Don't have an account? <Link to="/signup" className="text-gold underline">Sign up</Link>
      </p>
      <p className="text-xs text-charcoal/40 mt-2">Admin demo: admin@novaliving.in / admin123</p>
    </div>
  );
}
