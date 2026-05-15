'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FeaturedProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                
                if (res.ok && data) {
                    setProducts(data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <Link href="/products" className="text-[#FF5A1F] text-sm font-semibold hover:underline">
                    View All →
                </Link>
            </div>

            {loading ? (
                // লোডিং স্টেট (Skeleton Loader)
                <div className="flex justify-center items-center h-40">
                    <div className="w-8 h-8 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No products found. Please push some data!</p>
            ) : (
                // প্রোডাক্ট গ্রিড
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const currentPrice = product.discountPrice || product.price;
                        const saveAmount = product.discountPrice ? product.price - product.discountPrice : 0;

                        return (
                            <div key={product._id} className="group cursor-pointer">
                                <Link href={`/products/${product.slug}`}>
                                    <div className="relative aspect-[4/5] bg-gray-100 mb-4 rounded-sm overflow-hidden">
                                        <Image 
                                            src={product.images[0] || "/images/placeholder.jpg"} 
                                            alt={product.name} 
                                            fill 
                                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        {/* ডিসকাউন্ট ব্যাজ */}
                                        {saveAmount > 0 && (
                                            <div className="absolute top-3 left-3 bg-[#FF5A1F] text-white text-[10px] font-bold px-2 py-1 rounded-sm">
                                                Save {saveAmount} BDT
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <p className="text-[#FF5A1F] font-bold text-sm">{currentPrice.toLocaleString()} BDT</p>
                                        {product.discountPrice && (
                                            <p className="text-gray-400 text-xs line-through">{product.price.toLocaleString()} BDT</p>
                                        )}
                                    </div>
                                </Link>
                                
                                <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="border border-[#FF5A1F] text-[#FF5A1F] text-[10px] font-semibold py-2 rounded-sm hover:bg-orange-50">ADD TO CART</button>
                                    <button className="bg-[#FF5A1F] text-white text-[10px] font-semibold py-2 rounded-sm hover:bg-[#e04d1a]">BUY NOW</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default FeaturedProducts;