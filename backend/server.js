import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Testimonial from "./models/Testimonial.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigin = (process.env.CLIENT_URL || "https://nova-living.vercel.app/").replace(/\/$/, "");
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("NOVA LIVING API is running..."));

app.get("/api/seed", async (req, res) => {
  try {
    const toSlug = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Testimonial.deleteMany();

    await User.create({ name: "Admin", email: "admin@novaliving.in", password: "admin123", role: "admin" });

    const categories = await Category.insertMany(
      ["Living Room", "Bedroom", "Dining", "Decor"].map((name) => ({ name, slug: toSlug(name), description: `Explore our ${name} collection` }))
    );

    const products = [
      { name: "Wren Modular Sofa", price: 68999, category: categories[0]._id, material: "Linen fabric", stock: 12, featured: true },
      { name: "Alder Coffee Table", price: 15999, category: categories[0]._id, material: "Solid wood", stock: 20, featured: false },
      { name: "Elm King Bed Frame", price: 42999, category: categories[1]._id, material: "Walnut veneer", stock: 8, featured: true },
      { name: "Linen Bedside Table", price: 8999, category: categories[1]._id, material: "Oak wood", stock: 15, featured: false },
      { name: "Oak Dining Table Set", price: 54999, category: categories[2]._id, material: "Solid oak, 6-seater", stock: 6, featured: true },
      { name: "Woven Dining Chair", price: 6999, category: categories[2]._id, material: "Rattan & wood", stock: 30, featured: false },
      { name: "Arc Floor Lamp", price: 11999, category: categories[3]._id, material: "Brass & marble base", stock: 10, featured: true },
      { name: "Terracotta Planter Set", price: 2499, category: categories[3]._id, material: "Ceramic", stock: 40, featured: false },
    ].map((p) => ({
      ...p,
      slug: toSlug(p.name),
      description: `Thoughtfully crafted ${p.name} designed for timeless, everyday living.`,
      images: ["https://placehold.co/600x600/1C1A17/C9A15A?text=" + encodeURIComponent(p.name)],
      ratings: 4.5,
      numReviews: 12,
    }));

    await Product.insertMany(products);

    await Testimonial.insertMany([
      { name: "Riya Sharma", location: "Mumbai", rating: 5, message: "NOVA LIVING completely transformed our home. Every detail felt intentional and beautifully executed." },
      { name: "Aditya Mehta", location: "Delhi", rating: 5, message: "The design team understood our vision perfectly. The final result exceeded our expectations." },
      { name: "Neha Verma", location: "Bangalore", rating: 5, message: "From the first meeting to the final installation, the experience was seamless and delightful." },
    ]);

    res.json({ message: "Seed data inserted successfully! Admin login: admin@novaliving.in / admin123" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
