import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: String,
    avatar: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
