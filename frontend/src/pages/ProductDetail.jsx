import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(() => JSON.parse(localStorage.getItem("novaFavorites") || "[]"));
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).catch(() => setError("This piece could not be found.")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="bg-cream min-h-screen px-6 pt-40"><div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10"><div className="aspect-square rounded-xl bg-white animate-pulse" /><div className="space-y-5"><div className="h-4 w-24 rounded bg-white animate-pulse" /><div className="h-12 w-3/4 rounded bg-white animate-pulse" /><div className="h-5 w-32 rounded bg-white animate-pulse" /></div></div></div>;
  if (error || !product) return <div className="bg-cream min-h-screen px-6 pt-40 text-center"><h1 className="font-serif text-3xl mb-3">{error || "Product unavailable"}</h1><Link to="/products" className="text-gold underline">Return to collection →</Link></div>;

  const handleAdd = async () => {
    if (!user) return navigate("/login");
    try {
      await addToCart(product._id, qty);
      setMsg("Added to cart");
    } catch (addError) {
      setMsg(addError.response?.data?.message || "Could not add this piece");
    }
    setTimeout(() => setMsg(""), 2000);
  };

  const toggleFavorite = () => {
    const nextFavorites = favorite.includes(product._id) ? favorite.filter((item) => item !== product._id) : [...favorite, product._id];
    setFavorite(nextFavorites);
    localStorage.setItem("novaFavorites", JSON.stringify(nextFavorites));
  };

  const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85"];
  const price = product.discountPrice || product.price;

  return (
    <div className="bg-cream min-h-screen px-6 pt-36 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-xs text-charcoal/50 mb-8"><Link to="/products" className="hover:text-gold">Collection</Link><span className="px-2">/</span>{product.name}</div>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
          <div className="grid grid-cols-[76px_1fr] gap-4">
            <div className="flex flex-col gap-3">
              {images.map((image, index) => <button type="button" key={image} onClick={() => setActiveImage(index)} className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${activeImage === index ? "border-gold" : "border-transparent"}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = "https://placehold.co/200x200/eee9df/1C1A17?text=Nova"; }} /></button>)}
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white border border-black/10 shadow-sm"><img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = "https://placehold.co/1000x1000/eee9df/1C1A17?text=Nova+Living"; }} />{product.discountPrice && <span className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1 text-xs font-medium">SALE</span>}</div>
          </div>
          <div className="pt-2">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs tracking-[0.25em] text-gold mb-3">{product.category?.name || "NOVA COLLECTION"}</p><h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">{product.name}</h1></div><button type="button" onClick={toggleFavorite} aria-label={favorite.includes(product._id) ? "Remove from favorites" : "Add to favorites"} className={`h-11 w-11 shrink-0 rounded-full border text-xl transition-colors ${favorite.includes(product._id) ? "border-gold bg-gold text-charcoal" : "border-black/10 hover:border-gold"}`}>♡</button></div>
            <div className="flex items-center gap-3 mb-6"><p className="text-2xl font-medium">₹{price.toLocaleString("en-IN")}</p>{product.discountPrice && <p className="text-sm text-charcoal/40 line-through">₹{product.price.toLocaleString("en-IN")}</p>}</div>
            <p className="text-charcoal/70 leading-relaxed mb-7">{product.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-8">{[["Material", product.material], ["Dimensions", product.dimensions], ["Colour", product.color], ["Availability", product.stock > 0 ? `${product.stock} in stock` : "Out of stock"]].filter((item) => item[1]).map(([label, value]) => <div key={label} className="rounded-lg border border-black/10 bg-white px-4 py-3"><p className="text-[11px] uppercase tracking-wider text-charcoal/45">{label}</p><p className="text-sm mt-1">{value}</p></div>)}</div>
            <div className="flex flex-col sm:flex-row gap-3 mb-4"><div className="flex items-center justify-between rounded-full border border-black/15 bg-white px-2 py-1 sm:w-32"><button type="button" aria-label="Decrease quantity" className="h-9 w-9" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span className="text-sm">{qty}</span><button type="button" aria-label="Increase quantity" className="h-9 w-9" onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}>+</button></div><button onClick={handleAdd} disabled={product.stock === 0} className="flex-1 rounded-full bg-charcoal px-8 py-3.5 text-sm font-medium text-white hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-40">{product.stock === 0 ? "Out of stock" : "Add to cart →"}</button></div>
            {msg && <p className={`text-sm mb-6 ${msg.includes("Could") ? "text-red-600" : "text-green-600"}`}>{msg}</p>}
            <div className="border-t border-black/10 pt-6 grid grid-cols-3 gap-3 text-center text-xs text-charcoal/60"><div><span className="block text-gold text-lg mb-1">◇</span>Secure checkout</div><div><span className="block text-gold text-lg mb-1">↺</span>Easy support</div><div><span className="block text-gold text-lg mb-1">⌂</span>Made for living</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
