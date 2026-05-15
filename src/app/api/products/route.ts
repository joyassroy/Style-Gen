import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    
    // হোমপেইজের জন্য আমরা আপাতত লেটেস্ট ৮টি প্রোডাক্ট আনবো
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}