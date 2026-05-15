import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // ১. টোটাল রেভিনিউ (Delivered orders only)
    const revenue = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // ২. টোটাল অর্ডার এবং কাস্টমার কাউন্ট
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });
    
    // ৩. টপ সেলিং প্রোডাক্টস (পপুলারিটি চেক)
    const topProducts = await Product.find().sort({ stock: 1 }).limit(4);

    // ৪. রিসেন্ট সেলস অ্যাক্টিভিটি
    const recentSales = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      stats: {
        revenue: revenue[0]?.total || 0,
        orders: totalOrders,
        customers: totalCustomers,
        conversion: "4.2%" // এটা পরে ডাইনামিক করা যাবে
      },
      topProducts,
      recentSales
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}