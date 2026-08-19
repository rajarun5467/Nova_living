import Product from "../models/Product.js";

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// @desc  Get all products (with search, category filter, pagination)
// @route GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, featured, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (keyword) filter.$text = { $search: keyword };
    if (category) filter.category = category;
    if (featured) filter.featured = featured === "true";

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ products, page: Number(page), pages: Math.ceil(count / limit), total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single product by slug or id
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create product (admin)
// @route POST /api/products
export const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    data.slug = toSlug(data.name);
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update product (admin)
// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    Object.assign(product, req.body);
    if (req.body.name) product.slug = toSlug(req.body.name);
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
