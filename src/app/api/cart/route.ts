import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Cart from "@/models/Cart";
import User from "@/models/User";
import Product from "@/models/Product"; 

// ১. কার্টের সব ডাটা দেখার জন্য (Cart Page এর জন্য)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const cartItems = await Cart.find({ userId: user._id }).populate("productId");
    return NextResponse.json(cartItems, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ২. কার্টে নতুন প্রোডাক্ট অ্যাড করার জন্য (Add to Cart বাটনের জন্য)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, productId, quantity, size } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // আগে থেকেই এই প্রোডাক্ট ও সাইজ কার্টে থাকলে শুধু কোয়ান্টিটি বাড়বে
    const existingCartItem = await Cart.findOne({ userId: user._id, productId, size });
    
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      await Cart.create({ userId: user._id, productId, quantity, size });
    }

    return NextResponse.json({ message: "Added to cart successfully!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ৩. কার্ট ক্লিয়ার করার জন্য (Checkout সফল হওয়ার পর)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    await Cart.deleteMany({ userId: user._id });
    return NextResponse.json({ message: "Cart cleared" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}