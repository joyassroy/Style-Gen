// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, items, totalPrice } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    await Order.create({
      userId: user._id,
      items,
      totalPrice,
      status: "Pending"
    });

    return NextResponse.json({ message: "Order placed successfully!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}