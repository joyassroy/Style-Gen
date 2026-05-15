import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findOne({ email: session.user?.email });

    // ১. মোট অর্ডার সংখ্যা
    const totalOrders = await Order.countDocuments({ userId: user._id });

    // ২. পেন্ডিং অর্ডার (যেগুলো এখনো ডেলিভারড হয়নি)
    const pendingOrders = await Order.countDocuments({ 
        userId: user._id, 
        status: { $nin: ["Delivered", "Cancelled"] } 
    });

    // ৩. মোট কত টাকার কেনাকাটা করেছে
    const totalSpent = await Order.aggregate([
      { $match: { userId: user._id, status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // ৪. সবশেষ ৩টি অর্ডার (রিসেন্ট অ্যাক্টিভিটি দেখানোর জন্য)
    const recentOrders = await Order.find({ userId: user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .limit(3);

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        totalSpent: totalSpent[0]?.total || 0,
        loyaltyPoints: 12 // এটা আপাতত হার্ডকোড, পরে ডাইনামিক করা যাবে
      },
      recentOrders
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}