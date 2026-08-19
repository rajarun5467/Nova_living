import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/myorders").then(({ data }) => setOrders(data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
      <h1 className="font-serif text-3xl mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-charcoal/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/orders/${o._id}`} className="block border border-black/10 rounded-lg p-5 hover:shadow-sm">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Order #{o._id.slice(-6)}</span>
                <span className="text-charcoal/60">{new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="px-2 py-1 rounded-full bg-cream text-xs">{o.status}</span>
                <span className="font-medium">₹{o.totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
