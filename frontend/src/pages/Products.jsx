import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || "");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    setLoading(true);
    setError("");
    api.get("/products", { params }).then(({ data }) => setProducts(data.products)).catch(() => setError("We couldn't load the collection right now.")).finally(() => setLoading(false));
  }, [category, keyword]);

  const submitSearch = (event) => {
    event.preventDefault();
    const nextParams = {};
    if (searchInput.trim()) nextParams.keyword = searchInput.trim();
    if (category) nextParams.category = category;
    setSearchParams(nextParams);
  };

  const chooseCategory = (nextCategory) => {
    const nextParams = {};
    if (keyword) nextParams.keyword = keyword;
    if (nextCategory) nextParams.category = nextCategory;
    setSearchParams(nextParams);
  };

  const visibleProducts = [...products].sort((first, second) => {
    if (sort === "price-low") return (first.discountPrice || first.price) - (second.discountPrice || second.price);
    if (sort === "price-high") return (second.discountPrice || second.price) - (first.discountPrice || first.price);
    if (sort === "name") return first.name.localeCompare(second.name);
    return 0;
  });

  return (
    <div className="bg-cream min-h-screen px-6 pt-36 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl bg-charcoal px-7 py-12 md:px-12 md:py-16 text-white mb-10">
          <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1400&q=80" alt="Nova Living furniture collection" className="absolute inset-0 h-full w-full object-cover opacity-35" onError={(event) => { event.currentTarget.src = "https://placehold.co/1400x500/302821/F4F1EC?text=Nova+Living+Collection"; }} />
          <div className="relative max-w-xl"><p className="text-xs tracking-[0.25em] text-gold mb-4">NOVA LIVING COLLECTION</p><h1 className="font-serif text-5xl md:text-6xl leading-tight mb-5">Objects with a sense of place.</h1><p className="text-white/75 max-w-md leading-relaxed">Furniture and decor pieces crafted for slower mornings, longer dinners and timeless living.</p></div>
        </div>

        <div className="flex flex-col gap-5 mb-10">
          <form onSubmit={submitSearch} className="flex flex-col sm:flex-row gap-3">
            <input type="search" placeholder="Search sofas, tables, lamps..." value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none focus:border-gold" aria-label="Search products" />
            <button className="rounded-full bg-charcoal px-7 py-3 text-sm font-medium text-white hover:bg-gold hover:text-charcoal transition-colors">Search collection</button>
          </form>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              <button type="button" onClick={() => chooseCategory("")} className={`rounded-full px-4 py-2 text-xs transition-colors ${!category ? "bg-charcoal text-white" : "bg-white border border-black/10 hover:border-gold"}`}>All pieces</button>
              {categories.map((item) => <button type="button" key={item._id} onClick={() => chooseCategory(item._id)} className={`rounded-full px-4 py-2 text-xs transition-colors ${category === item._id ? "bg-charcoal text-white" : "bg-white border border-black/10 hover:border-gold"}`}>{item.name}</button>)}
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full md:w-44 rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs outline-none focus:border-gold" aria-label="Sort products"><option value="featured">Sort: Featured</option><option value="name">Sort: Name</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option></select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5"><p className="text-sm text-charcoal/60">{loading ? "Finding pieces..." : `${products.length} pieces to explore`}{keyword ? ` for “${keyword}”` : ""}</p>{(keyword || category) && <button type="button" onClick={() => { setSearchInput(""); setSearchParams({}); }} className="text-xs text-gold hover:underline">Clear filters</button>}</div>
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div> : loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[0.82] rounded-xl bg-white animate-pulse" />)}</div> : visibleProducts.length === 0 ? <div className="rounded-xl bg-white border border-black/10 p-12 text-center"><h2 className="font-serif text-2xl mb-2">No pieces found</h2><p className="text-sm text-charcoal/60 mb-5">Try a different search or clear your filters.</p><button type="button" onClick={() => { setSearchInput(""); setSearchParams({}); }} className="rounded-full bg-charcoal px-6 py-3 text-sm text-white">Show all pieces</button></div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </div>
    </div>
  );
}
