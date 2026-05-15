import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product"; // এই ইমপোর্টটা মাস্ট!
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // আপনার authOptions এর সঠিক পাথ চেক করুন

export async function GET() {
  try {
    await connectDB();
    
    // ১. সেশন চেক করা
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ২. ইউজার খুঁজে বের করা
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ৩. অর্ডার খুঁজে আনা এবং পপুলেট করা
    // এখানে model: Product সরাসরি উল্লেখ করে দিলে Mongoose আর কনফিউজড হবে না
    const orders = await Order.find({ userId: user._id })
      .populate({
        path: 'items.productId',
        model: Product 
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });

  } catch (error: any) {
    // এররটা টার্মিনালে দেখার জন্য কনসোল লগ
    console.error("ORDER_GET_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}