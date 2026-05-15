import mongoose, { Schema, models } from "mongoose";

const cartSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    size: { type: String, required: true },
  },
  { timestamps: true }
);

const Cart = models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;