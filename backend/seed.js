// Run: node seed.js  (after setting MONGO_URI in .env)
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Testimonial from "./models/Testimonial.js";

dotenv.config();
connectDB();

const toSlug = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const run = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Testimonial.deleteMany();

    await User.create({
      name: "Admin",
      email: "admin@novaliving.in",
      password: "admin123",
      role: "admin",
    });

    const categories = await Category.insertMany(
      ["Living Room", "Bedroom", "Dining", "Decor"].map((name) => ({
        name,
        slug: toSlug(name),
        description: `Explore our ${name} collection`,
      }))
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
      images: ["https://via.placeholder.com/600x600.png?text=" + encodeURIComponent(p.name)],
      ratings: 4.5,
      numReviews: 12,
    }));

    await Product.insertMany(products);

    await Testimonial.insertMany([
      { name: "Riya Sharma", location: "Mumbai", rating: 5, message: "NOVA LIVING completely transformed our home. Every detail felt intentional and beautifully executed." },
      { name: "Aditya Mehta", location: "Delhi", rating: 5, message: "The design team understood our vision perfectly. The final result exceeded our expectations." },
      { name: "Neha Verma", location: "Bangalore", rating: 5, message: "From the first meeting to the final installation, the experience was seamless and delightful." },
    ]);

    console.log("Seed data inserted successfully. Admin login: admin@novaliving.in / admin123");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
