import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    
    // আগের ডাটা মুছে ফেলবে যাতে ডুপ্লিকেট না হয়
    await Product.deleteMany();

    const sampleProducts = [
      {
        name: "StyleGen Elite Oxford Leather (SG-25)",
        slug: "stylegen-elite-oxford-leather-sg-25",
        price: 3500,
        discountPrice: 3250,
        category: "Shoes",
        stock: 50,
        images: [
          "https://images.unsplash.com/photo-1614252232525-a111a62629b5?q=80&w=800",
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800"
        ],
        sizes: ["39", "40", "41", "42", "44"],
        description: "Masterfully handcrafted from premium Italian calfskin, featuring a refined silhouette and durable welt construction."
      },
      {
        name: "Elite Formal Belt (ST-02)",
        slug: "elite-formal-belt-st-02",
        price: 2000,
        discountPrice: 1850,
        category: "Belt",
        stock: 100,
        images: [
          "https://images.unsplash.com/photo-1627163439134-7a8c47e08208?q=80&w=800"
        ],
        sizes: ["M", "L", "XL"],
        description: "Premium pure leather belt designed for the perfect formal look. Highly durable and stylish."
      },
      {
        name: "Slim Bifold Leather Wallet (SW-12)",
        slug: "slim-bifold-leather-wallet-sw-12",
        price: 2500,
        discountPrice: 2100,
        category: "Wallet",
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1628151515500-8dce4bf22ce8?q=80&w=800"
        ],
        sizes: [],
        description: "Minimalist and compact bifold leather wallet featuring RFID protection and multiple card slots."
      },
      {
        name: "Executive Laptop Bag (SB-05)",
        slug: "executive-laptop-bag-sb-05",
        price: 7500,
        discountPrice: 6500,
        category: "Bags",
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800"
        ],
        sizes: [],
        description: "Spacious executive leather bag suitable for up to 15-inch laptops. Perfect for office and meetings."
      },
      {
        name: "Chelsea Boot Black (SG-01)",
        slug: "chelsea-boot-black-sg-01",
        price: 5000,
        discountPrice: 4500,
        category: "Shoes",
        stock: 20,
        images: [
          "https://images.unsplash.com/photo-1608256246200-53e65389e8e4?q=80&w=800"
        ],
        sizes: ["40", "41", "42", "43"],
        description: "Classic black leather Chelsea boots for everyday elegance and ultimate comfort."
      },
      {
        name: "Classic Casual Loafer (SG-10)",
        slug: "classic-casual-loafer-sg-10",
        price: 3200,
        discountPrice: 2800,
        category: "Shoes",
        stock: 45,
        images: [
          "https://images.unsplash.com/photo-1595341888016-b38c0f56bc2b?q=80&w=800"
        ],
        sizes: ["39", "40", "41", "42"],
        description: "Comfortable and stylish slip-on loafers perfect for casual and semi-formal outings."
      }
    ];

    await Product.insertMany(sampleProducts);
    
    return NextResponse.json({ message: "Multiple Products seeded successfully!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}