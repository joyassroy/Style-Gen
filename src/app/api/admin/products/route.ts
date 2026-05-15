import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // ডাটা ভ্যালিডেশন (মিনিমাম রিকোয়ারমেন্ট)
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // নতুন প্রোডাক্ট তৈরি
    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      discountPrice: body.discountPrice ? Number(body.discountPrice) : null,
      category: body.category,
      stock: Number(body.stock),
      images: body.images, // Array of URLs
      sizes: body.sizes,   // Array of strings
      colors: body.colors, // Array of strings
      status: "Active"
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST_PRODUCT_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}