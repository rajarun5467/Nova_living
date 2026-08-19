import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-40 pb-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-gold underline">Browse the collection →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
      <h1 className="font-serif text-3xl mb-8">Shopping Cart</h1>
      <div className="space-y-6 mb-10">
        {cart.items.map((item) => (
          <div key={item.product._id} className="flex items-center gap-4 border-b border-black/10 pb-6">
            <img src={item.product.images?.[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-serif">{item.product.name}</h3>
              <p className="text-sm text-charcoal/60">₹{item.price.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex items-center border border-black/10 rounded-full">
              <button className="px-3 py-1" onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}>-</button>
              <span className="px-2">{item.quantity}</span>
              <button className="px-3 py-1" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
            </div>
            <p className="w-24 text-right font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
            <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 text-sm">Remove</button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-full md:w-80">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-charcoal/60">
            <span>Shipping</span>
            <span>{totalPrice > 5000 ? "Free" : "₹299"}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-charcoal text-white py-3 rounded-full text-sm font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
