import mongoose, { Schema, models } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  isFlagship: { type: Boolean, default: false },
  status: { type: String, default: "Active" }
}, { timestamps: true });

const Category = models.Category || mongoose.model("Category", categorySchema);
export default Category;