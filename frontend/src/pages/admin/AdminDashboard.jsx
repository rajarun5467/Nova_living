import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = () => {
    setLoading(true);
    setError("");
    (async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get("/products?limit=1000"),
          api.get("/orders"),
        ]);
        const revenue = orderRes.data.reduce((s, o) => s + o.totalPrice, 0);
        setStats({ products: prodRes.data.total, orders: orderRes.data.length, revenue });
      } catch (err) {
        setError("Unable to load your latest store metrics.");
      } finally {
        setLoading(false);
      }
    })();
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div><p className="text-xs tracking-[0.22em] text-gold mb-3">OVERVIEW</p><h1 className="font-serif text-4xl md:text-5xl">Good morning, Admin.</h1><p className="text-sm text-charcoal/55 mt-3">Here&apos;s what&apos;s happening across Nova Living.</p></div>
        <button type="button" onClick={loadStats} className="self-start rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs hover:border-gold hover:text-gold transition-colors">↻ Refresh data</button>
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Total Products", value: stats.products, note: "Active pieces in your collection", icon: "🛋️" },
          { label: "Total Orders", value: stats.orders, note: "Orders placed by customers", icon: "📦" },
          { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, note: "Across all orders", icon: "💰" },
        ].map((item) => <div key={item.label} className="rounded-xl border border-black/5 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-4"><p className="text-xs uppercase tracking-wider text-charcoal/45">{item.label}</p><span className="text-2xl">{item.icon}</span></div><p className={`font-serif text-4xl ${loading ? "animate-pulse text-charcoal/20" : ""}`}>{loading ? "--" : item.value}</p><p className="text-xs text-charcoal/45 mt-3">{item.note}</p></div>)}
      </div>

      <div className="rounded-xl bg-charcoal p-7 md:p-9 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6"><div><p className="text-xs tracking-[0.2em] text-gold mb-3">STORE MANAGEMENT</p><h2 className="font-serif text-3xl">Keep the collection moving.</h2><p className="text-sm text-white/60 mt-2">Update inventory or move an order forward from here.</p></div><div className="flex flex-wrap gap-3"><Link to="/admin/products" className="rounded-full bg-gold px-5 py-3 text-xs font-medium text-charcoal hover:bg-white transition-colors">Manage products →</Link><Link to="/admin/orders" className="rounded-full border border-white/20 px-5 py-3 text-xs font-medium hover:bg-white hover:text-charcoal transition-colors">Review orders →</Link></div></div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 text-sm">
        <div className="rounded-xl border border-black/5 bg-white p-6"><p className="text-gold text-lg mb-4">01</p><h3 className="font-serif text-xl">Products</h3><p className="text-charcoal/55 mt-2 leading-relaxed">Add new pieces, update details and keep stock accurate.</p></div>
        <div className="rounded-xl border border-black/5 bg-white p-6"><p className="text-gold text-lg mb-4">02</p><h3 className="font-serif text-xl">Orders</h3><p className="text-charcoal/55 mt-2 leading-relaxed">Track fulfilment and keep customers informed.</p></div>
        <div className="rounded-xl border border-black/5 bg-white p-6"><p className="text-gold text-lg mb-4">03</p><h3 className="font-serif text-xl">Storefront</h3><p className="text-charcoal/55 mt-2 leading-relaxed">Preview the customer experience whenever you need.</p></div>
        </div>
    </div>
  );
}
