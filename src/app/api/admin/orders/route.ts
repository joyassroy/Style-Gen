import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // ১. সব অর্ডার নিয়ে আসা (ইউজার ইনফোসহ)
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // ২. স্ট্যাটস ক্যালকুলেশন
    const totalOrders = await Order.countDocuments();
    const pendingProcessing = await Order.countDocuments({ status: "Processing" });
    const deliveredSuccess = await Order.countDocuments({ status: "Delivered" });
    
    const revenueData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    return NextResponse.json({
      orders,
      stats: {
        totalOrders,
        pendingProcessing,
        totalRevenue: revenueData[0]?.total || 0,
        deliveredSuccess
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}