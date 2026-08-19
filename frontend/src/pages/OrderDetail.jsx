import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => {});
  }, [id]);

  if (!order) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="font-serif text-3xl mb-2">Order #{order._id.slice(-6)}</h1>
      <p className="text-sm text-charcoal/60 mb-8">Status: <span className="font-medium">{order.status}</span></p>

      <div className="space-y-4 mb-8">
        {order.items.map((item) => (
          <div key={item.product} className="flex items-center gap-4 border-b border-black/10 pb-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-serif">{item.name}</p>
              <p className="text-sm text-charcoal/60">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-2">Shipping Address</h3>
        <p className="text-sm text-charcoal/60">
          {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}, {order.shippingAddress?.country}
        </p>
      </div>

      <div className="flex justify-between font-medium border-t border-black/10 pt-4">
        <span>Total</span>
        <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
