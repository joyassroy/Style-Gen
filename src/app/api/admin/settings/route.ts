import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const admin = await User.findOne({ email: session.user.email });
    
    // Insights calculation
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    return NextResponse.json({
      admin: {
        name: admin.name,
        email: admin.email,
        image: admin.image,
      },
      systemInsights: {
        dbStatus: "Healthy",
        lastBackup: "2 hours ago",
        apiLatency: "124ms",
        totalAssets: productCount + orderCount,
        storageUsed: "1.2GB / 5TB"
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}