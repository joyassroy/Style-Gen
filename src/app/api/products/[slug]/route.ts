import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Product from "@/models/Product";

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ slug: string }> } // এখানে Promise অ্যাড করা হয়েছে
) {
  try {
    await connectDB();
    
    // params কে await করে আনর‍্যাপ (unwrap) করা হচ্ছে
    const { slug } = await params;

    // এবার slug দিয়ে ডাটাবেসে খোঁজা হচ্ছে
    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}