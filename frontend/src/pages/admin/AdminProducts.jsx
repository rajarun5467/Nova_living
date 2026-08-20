import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const emptyForm = { name: "", description: "", price: "", stock: "", category: "", material: "", images: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageInput, setImageInput] = useState("");

  const loadProducts = () => api.get("/products?limit=1000").then(({ data }) => setProducts(data.products));

  useEffect(() => {
    loadProducts();
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageInput("");
  };

  const compressImage = (file, maxDim = 600, quality = 0.5) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (form.images.length + files.length > 4) {
      setError("Maximum 4 images allowed.");
      return;
    }

    setUploading(true);
    setError("");
    const newImages = [];

    for (const file of files) {
      const compressed = await compressImage(file);
      newImages.push(compressed);
    }

    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addImageUrls = () => {
    if (!imageInput.trim()) return;
    const urls = imageInput.split(",").map((s) => s.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    setImageInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const wasEditing = Boolean(editingId);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images,
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      loadProducts();
      setMessage(wasEditing ? "Product updated successfully." : "Product added successfully.");
      window.setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      setError(
        status === 413
          ? "Images ka total size bahut bada hai. Chhoti images use karein ya image URLs paste karein."
          : serverMessage || "Product save nahi ho saka. Backend connection aur admin login check karein."
      );
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category?._id || p.category,
      material: p.material || "",
      images: p.images || [],
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 mb-8"><div><Link to="/admin" className="text-xs text-charcoal/45 hover:text-gold">← Overview</Link><p className="text-xs tracking-[0.22em] text-gold mt-5 mb-3">CATALOGUE</p><h1 className="font-serif text-4xl md:text-5xl">Manage products</h1></div><p className="hidden sm:block text-xs text-charcoal/45">{products.length} pieces</p></div>
      {message && <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8 border border-black/5 shadow-sm grid md:grid-cols-2 gap-4 mb-10">
        <input name="name" placeholder="Product Name" required value={form.name} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-colors" />
        <select name="category" required value={form.category} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-colors">
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input name="price" type="number" placeholder="Price (₹)" required value={form.price} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-colors" />
        <input name="stock" type="number" placeholder="Stock Quantity" required value={form.stock} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-colors" />
        <input name="material" placeholder="Material (e.g., Wood, Leather)" value={form.material} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-colors" />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal mb-2">Product Images</label>
          <div className="flex gap-4 mb-3">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="flex-1 border border-black/10 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-cream file:text-charcoal hover:file:bg-gold hover:file:text-charcoal cursor-pointer"
            />
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Image ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-black/10" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Paste image URLs (comma separated)"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="flex-1 border border-black/10 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={addImageUrls}
              className="bg-cream text-charcoal border border-black/10 px-5 rounded-full text-sm font-medium hover:bg-gold hover:text-charcoal transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        <textarea name="description" placeholder="Product Description" required value={form.description} onChange={handleChange} className="border border-black/10 rounded-lg px-4 py-3 md:col-span-2 focus:border-gold focus:outline-none transition-colors resize-none" rows={4} />
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={uploading} className="bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50">
            {uploading ? "Uploading..." : (editingId ? "Update Product" : "Add Product")}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="border border-black/10 px-6 py-2.5 rounded-full text-sm hover:border-gold transition-colors">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm min-w-[680px]">
          <thead className="bg-cream text-left">
            <tr>
              <th className="p-4 font-medium text-charcoal/70">Product</th>
              <th className="p-4 font-medium text-charcoal/70">Category</th>
              <th className="p-4 font-medium text-charcoal/70">Price</th>
              <th className="p-4 font-medium text-charcoal/70">Stock</th>
              <th className="p-4 font-medium text-charcoal/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-black/5 hover:bg-cream/30 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-charcoal">{p.name}</div>
                  {p.images?.[0] && <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg mt-2" />}
                </td>
                <td className="p-4 text-charcoal/60">{p.category?.name}</td>
                <td className="p-4 font-medium text-charcoal">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.stock > 10 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {p.stock} in stock
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(p)} className="text-gold hover:text-charcoal transition-colors font-medium">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="ml-4 text-red-500 hover:text-red-700 transition-colors font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
