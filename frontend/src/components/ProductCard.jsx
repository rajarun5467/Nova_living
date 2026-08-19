import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const price = product.discountPrice || product.price;
  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-xl bg-black/5 mb-4 relative">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=85"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(event) => { event.currentTarget.src = "https://placehold.co/600x600/eee9df/1C1A17?text=Nova+Living"; }}
        />
        {product.discountPrice && (
          <div className="absolute top-3 left-3 bg-gold text-charcoal text-xs font-medium px-2 py-1 rounded-full">
            SALE
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">{product.name}</h3>
      <p className="text-sm text-charcoal/50 mt-1">{product.category?.name}</p>
      <div className="flex items-center gap-2 mt-2">
        <p className="text-base font-medium text-charcoal">₹{price.toLocaleString("en-IN")}</p>
        {product.discountPrice && (
          <p className="text-sm text-charcoal/40 line-through">₹{product.price.toLocaleString("en-IN")}</p>
        )}
      </div>
    </Link>
  );
}
