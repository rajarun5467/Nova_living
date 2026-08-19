import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-40 pb-20">
      <h1 className="font-serif text-3xl mb-8">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" required value={form.name} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-4 py-3" />
        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-4 py-3" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-4 py-3" />
        <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full border border-black/10 rounded-lg px-4 py-3" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-charcoal text-white py-3 rounded-full text-sm font-medium">
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
      <p className="text-sm text-charcoal/60 mt-6">
        Already have an account? <Link to="/login" className="text-gold underline">Login</Link>
      </p>
    </div>
  );
}
