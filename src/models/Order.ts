import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      }
    ],
    totalPrice: { type: Number, required: true },
    shippingCost: { type: Number, default: 15 },
    status: { type: String, default: "Order Placed" },
    shippingAddress: {
      name: String,
      address: String,
      phone: String,
    },
    trackingHistory: [
      {
        status: String,
        location: String,
        time: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;