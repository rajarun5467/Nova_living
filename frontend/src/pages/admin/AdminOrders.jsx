import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => { setLoading(true); return api.get("/orders").then(({ data }) => setOrders(data)).finally(() => setLoading(false)); };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 mb-8"><div><Link to="/admin" className="text-xs text-charcoal/45 hover:text-gold">← Overview</Link><p className="text-xs tracking-[0.22em] text-gold mt-5 mb-3">FULFILMENT</p><h1 className="font-serif text-4xl md:text-5xl">Manage orders</h1></div><p className="hidden sm:block text-xs text-charcoal/45">{orders.length} orders</p></div>
      <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm min-w-[680px]">
          <thead className="bg-cream text-left">
            <tr>
              <th className="p-4 font-medium text-charcoal/70">Order ID</th>
              <th className="p-4 font-medium text-charcoal/70">Customer</th>
              <th className="p-4 font-medium text-charcoal/70">Total</th>
              <th className="p-4 font-medium text-charcoal/70">Status</th>
              <th className="p-4 font-medium text-charcoal/70">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-8 text-center text-charcoal/50">Loading orders...</td></tr> : orders.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-charcoal/50">No orders yet.</td></tr> : orders.map((o) => (
              <tr key={o._id} className="border-t border-black/5 hover:bg-cream/30 transition-colors">
                <td className="p-4 font-medium text-charcoal">#{o._id.slice(-6)}</td>
                <td className="p-4 text-charcoal/60">{o.user?.name}</td>
                <td className="p-4 font-medium text-charcoal">₹{o.totalPrice.toLocaleString("en-IN")}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-gold cursor-pointer ${statusColors[o.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-charcoal/60">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
