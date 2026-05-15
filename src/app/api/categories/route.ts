import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    
    // প্রতি ক্যাটাগরির জন্য প্রোডাক্ট কাউন্ট করা
    const data = await Promise.all(categories.map(async (cat) => {
      const itemCount = await Product.countDocuments({ category: cat.name });
      return { ...cat._doc, itemCount };
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newCategory = await Category.create(body);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}