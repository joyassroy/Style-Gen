import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // ১. মোট প্রোডাক্ট সংখ্যা
    const totalProducts = await Product.countDocuments();

    // ২. ইনভেন্টরি ভ্যালু (price * stock এর যোগফল)
    const inventory = await Product.aggregate([
      { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$stock"] } } } }
    ]);

    // ৩. লো স্টক অ্যালার্ট (যাদের স্টক ১০ এর নিচে)
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 10 } });

    return NextResponse.json({
      totalProducts,
      inventoryValue: inventory[0]?.totalValue || 0,
      lowStockCount,
      newSubmissions: 4 // এটা আপাতত স্ট্যাটিক বা অন্য মডেল থেকে আসতে পারে
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}