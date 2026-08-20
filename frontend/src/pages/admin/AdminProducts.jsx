import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const emptyForm = { name: "", description: "", price: "", discountPrice: "", stock: "", category: "", material: "", color: "", dimensions: "", featured: false, images: [] };

const inputCls = "w-full border border-black/10 rounded-lg px-4 py-2.5 focus:border-gold focus:outline-none transition-colors text-sm";
const labelCls = "block text-xs font-medium text-charcoal/70 mb-1.5";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageInput, setImageInput] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editImageInput, setEditImageInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const modalRef = useRef(null);

  const loadProducts = useCallback(() => {
    api.get("/products?limit=1000").then(({ data }) => setProducts(data.products));
  }, []);

  useEffect(() => {
    loadProducts();
    api.get("/categories").then(({ data }) => setCategories(data));
  }, [loadProducts]);

  // ── Shared helpers ──

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

  // ── Add Product form (inline) ──

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageInput("");
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), images: form.images };
    try {
      await api.post("/products", payload);
      resetForm();
      loadProducts();
      setMessage("Product added successfully.");
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

  // ── Edit Modal ──

  const openEditModal = (p) => {
    setEditId(p._id);
    setEditForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || "",
      discountPrice: p.discountPrice || "",
      stock: p.stock || "",
      category: p.category?._id || p.category || "",
      material: p.material || "",
      color: p.color || "",
      dimensions: p.dimensions || "",
      featured: p.featured || false,
      images: p.images || [],
    });
    setEditImageInput("");
    setModalError("");
    setModalMsg("");
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setModalOpen(false);
    setEditId(null);
    setEditForm(emptyForm);
    setEditImageInput("");
    setModalError("");
    setModalMsg("");
  };

  // Escape key + body scroll lock
  useEffect(() => {
    if (!modalOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") closeEditModal();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const handleEditChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditForm({ ...editForm, [e.target.name]: val });
  };

  const handleEditImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (editForm.images.length + files.length > 4) {
      setModalError("Maximum 4 images allowed.");
      return;
    }
    setUploading(true);
    setModalError("");
    const newImages = [];
    for (const file of files) {
      const compressed = await compressImage(file);
      newImages.push(compressed);
    }
    setEditForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    setUploading(false);
  };

  const removeEditImage = (index) => {
    setEditForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addEditImageUrls = () => {
    if (!editImageInput.trim()) return;
    const urls = editImageInput.split(",").map((s) => s.trim()).filter(Boolean);
    setEditForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    setEditImageInput("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setUpdating(true);
    const payload = {
      ...editForm,
      price: Number(editForm.price),
      stock: Number(editForm.stock),
      discountPrice: editForm.discountPrice ? Number(editForm.discountPrice) : 0,
      images: editForm.images,
    };
    try {
      await api.put(`/products/${editId}`, payload);
      loadProducts();
      setModalMsg("Product updated successfully.");
      window.setTimeout(() => {
        closeEditModal();
        setMessage("Product updated successfully.");
        window.setTimeout(() => setMessage(""), 2500);
      }, 800);
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      setModalError(
        status === 413
          ? "Images too large. Use smaller images or URL instead."
          : serverMessage || "Update failed. Check connection and try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
    setMessage("Product deleted.");
    window.setTimeout(() => setMessage(""), 2500);
  };

  // ── Reusable form fields renderer ──

  const renderFormFields = (formData, onChange, imgUpload, imgRemove, imgInput, setImgInput, addUrls, uploadLabel) => (
    <>
      <div>
        <label className={labelCls}>Product Name</label>
        <input name="name" placeholder="Enter product name" required value={formData.name} onChange={onChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Category</label>
        <select name="category" required value={formData.category} onChange={onChange} className={inputCls}>
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Price (₹)</label>
        <input name="price" type="number" placeholder="e.g. 12999" required value={formData.price} onChange={onChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Sale / Discount Price (₹)</label>
        <input name="discountPrice" type="number" placeholder="e.g. 9999" value={formData.discountPrice} onChange={onChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Stock / Quantity</label>
        <input name="stock" type="number" placeholder="e.g. 25" required value={formData.stock} onChange={onChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Material</label>
        <input name="material" placeholder="e.g. Wood, Leather" value={formData.material} onChange={onChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Color</label>
        <input name="color" placeholder="e.g. Walnut, Cream" value={formData.color} onChange={onChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Dimensions</label>
        <input name="dimensions" placeholder="e.g. 120x60x45 cm" value={formData.dimensions} onChange={onChange} className={inputCls} />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Description</label>
        <textarea name="description" placeholder="Enter product description" required value={formData.description} onChange={onChange} className={`${inputCls} resize-none`} rows={4} />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Product Images</label>
        <div className="flex gap-3 mb-3">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={imgUpload}
            disabled={uploading}
            className="flex-1 border border-black/10 rounded-lg px-4 py-2.5 focus:border-gold focus:outline-none transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-cream file:text-charcoal hover:file:bg-gold hover:file:text-charcoal cursor-pointer text-sm"
          />
        </div>
        {formData.images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img} alt={`Image ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-black/10" />
                <button
                  type="button"
                  onClick={() => imgRemove(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste image URLs (comma separated)"
            value={imgInput}
            onChange={(e) => setImgInput(e.target.value)}
            className={inputCls}
          />
          <button
            type="button"
            onClick={addUrls}
            className="bg-cream text-charcoal border border-black/10 px-4 rounded-lg text-xs font-medium hover:bg-gold hover:text-charcoal transition-colors whitespace-nowrap"
          >
            Add URLs
          </button>
        </div>
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={onChange} className="w-4 h-4 accent-gold cursor-pointer" />
        <label htmlFor="featured" className="text-sm text-charcoal/70 cursor-pointer">Featured product</label>
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <Link to="/admin" className="text-xs text-charcoal/45 hover:text-gold">← Overview</Link>
          <p className="text-xs tracking-[0.22em] text-gold mt-5 mb-3">CATALOGUE</p>
          <h1 className="font-serif text-4xl md:text-5xl">Manage products</h1>
        </div>
        <p className="hidden sm:block text-xs text-charcoal/45">{products.length} pieces</p>
      </div>

      {message && <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Add Product Form (inline) */}
      <div className="mb-10">
        <h2 className="font-serif text-xl mb-4 text-charcoal">Add New Product</h2>
        <form onSubmit={handleAddSubmit} className="bg-white rounded-xl p-6 md:p-8 border border-black/5 shadow-sm grid md:grid-cols-2 gap-4">
          {renderFormFields(form, handleChange, handleImageUpload, removeImage, imageInput, setImageInput, addImageUrls)}
          <div className="md:col-span-2 flex gap-3 mt-2">
            <button type="submit" disabled={uploading} className="bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50">
              {uploading ? "Uploading..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
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
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />}
                      <div className="font-medium text-charcoal">{p.name}</div>
                    </div>
                  </td>
                  <td className="p-4 text-charcoal/60">{p.category?.name}</td>
                  <td className="p-4 font-medium text-charcoal">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.stock > 10 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(p)} className="text-gold hover:text-charcoal transition-colors font-medium">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="ml-4 text-red-500 hover:text-red-700 transition-colors font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Product Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col animate-[scaleIn_0.25s_ease-out]"
          >
            {/* Sticky header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-serif text-xl text-charcoal">Edit Product</h2>
              <button
                onClick={closeEditModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-charcoal/60 hover:text-charcoal text-xl"
              >
                ×
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 py-5 flex-1">
              {modalMsg && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{modalMsg}</div>}
              {modalError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{modalError}</div>}

              <form onSubmit={handleEditSubmit} id="editProductForm" className="grid md:grid-cols-2 gap-4">
                {renderFormFields(
                  editForm,
                  handleEditChange,
                  handleEditImageUpload,
                  removeEditImage,
                  editImageInput,
                  setEditImageInput,
                  addEditImageUrls
                )}
              </form>
            </div>

            {/* Sticky footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-black/10 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={closeEditModal}
                className="border border-black/10 px-5 py-2.5 rounded-full text-sm font-medium hover:border-gold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="editProductForm"
                disabled={updating || uploading}
                className="bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : uploading ? "Uploading..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
