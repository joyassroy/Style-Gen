import mongoose, { Schema, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL-er jonno
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    images: { type: [String], required: true },
    sizes: { type: [String], default: [] },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model("Product", productSchema);
export default Product;