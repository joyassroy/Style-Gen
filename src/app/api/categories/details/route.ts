import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) return NextResponse.json({ error: "Slug is missing" }, { status: 400 });

    // স্লাগ থেকে ক্যাটাগরির নাম বের করা (যেমন: leather-bags -> Leather Bags)
    const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // ১. ক্যাটাগরির ডিটেইলস খুঁজে বের করা
    const category = await Category.findOne({ name: new RegExp(`^${categoryName}$`, 'i') });

    // ২. ওই ক্যাটাগরির আন্ডারে থাকা সব প্রোডাক্ট খুঁজে বের করা
    const products = await Product.find({ 
        category: new RegExp(`^${categoryName}$`, 'i') 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ category, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}