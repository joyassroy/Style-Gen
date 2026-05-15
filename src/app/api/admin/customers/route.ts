import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    // ১. সব ইউজারদের নিয়ে আসা (যারা অ্যাডমিন নয়)
    const customers = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });

    // ২. প্রতিটি কাস্টমারের জন্য অর্ডারের সংখ্যা গুনে বের করা
    const customerList = await Promise.all(
      customers.map(async (user) => {
        const orderCount = await Order.countDocuments({ userId: user._id });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          orderCount: orderCount,
          status: "ACTIVE" // এটি আপনি ইউজার মডেলে স্ট্যাটাস ফিল্ড থাকলে সেখান থেকে নিতে পারেন
        };
      })
    );

    // ৩. স্ট্যাটস ক্যালকুলেশন
    const totalCustomers = customers.length;
    // এভারেজ লাইফটাইম ভ্যালু (মোট সেলস / মোট কাস্টমার)
    const totalSales = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
    const avgLifetimeValue = totalCustomers > 0 ? (totalSales[0]?.total || 0) / totalCustomers : 0;

    return NextResponse.json({
      customers: customerList,
      stats: {
        totalCustomers,
        activeNow: Math.floor(totalCustomers * 0.15), // একটি ডাইনামিক ফিল্টার পরে করা যাবে
        avgLifetimeValue
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}