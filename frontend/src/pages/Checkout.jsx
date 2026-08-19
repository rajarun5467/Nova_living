import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { cart, totalPrice, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/orders", { shippingAddress: form, paymentMethod });
      await fetchCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return <div className="pt-40 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="font-serif text-3xl mb-8">Checkout</h1>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input name="street" placeholder="Street Address" value={form.street} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3 col-span-2" />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3" />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3" />
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3" />
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3" />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Payment Method</p>
          <div className="flex gap-3">
            {["COD", "Card", "UPI"].map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`px-4 py-2 rounded-full text-sm border ${paymentMethod === m ? "bg-charcoal text-white border-charcoal" : "border-black/10"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 pt-4 mb-6 flex justify-between font-medium">
        <span>Total</span>
        <span>₹{(totalPrice > 5000 ? totalPrice : totalPrice + 299).toLocaleString("en-IN")}</span>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={placeOrder}
        disabled={loading}
        className="w-full bg-gold text-charcoal py-3 rounded-full text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
