'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";

const ProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ডেটাবেস থেকে রিয়েল প্রোডাক্ট ডেটা ফেচ করা
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

    // ডেটা আসার সময় লোডিং স্পিনার দেখাবে
    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col justify-center items-center gap-3">
                <div className="w-8 h-8 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading all products...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <Title>All Products</Title>
            
            {products.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No products found in the database.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
                    {
                        products.map((product) => {
                            // ডিসকাউন্ট এবং প্রাইস ক্যালকুলেশন
                            const currentPrice = product.discountPrice || product.price;
                            const hasDiscount = product.discountPrice && product.discountPrice < product.price;

                            return (
                                <div key={product._id} className="group flex flex-col justify-between">
                                    {/* প্রোডাক্ট ইমেজ এবং ইনফো (লিংক করা হয়েছে) */}
                                    <Link href={`/products/${product.slug}`} className="flex-col flex flex-1">
                                        <div className="relative aspect-square bg-gray-100 mb-3 rounded-md overflow-hidden">
                                            <Image 
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                alt={product.name} 
                                                // ডেটাবেস থেকে প্রথম ইমেজটি নিবে
                                                src={product.images[0] || "/images/placeholder.jpg"} 
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                            />
                                            {/* ডিসকাউন্ট ব্যাজ */}
                                            {hasDiscount && (
                                                <div className="absolute top-2 left-2 bg-[#FF5A1F] text-white text-[10px] font-bold px-2 py-1 rounded-sm">
                                                    Save {product.price - product.discountPrice} BDT
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm font-medium text-gray-800 my-1 line-clamp-2 h-10">
                                            {product.name}
                                        </p>
                                        
                                        <p className="flex gap-2 items-center text-sm mb-3">
                                            <span className="font-bold text-[#FF5A1F]">BDT {currentPrice.toLocaleString()}</span>
                                            {hasDiscount && (
                                                <del className="text-gray-400 text-xs">BDT {product.price.toLocaleString()}</del>
                                            )}
                                        </p>
                                    </Link>
                                    
                                    {/* বাটন - link প্রপস অ্যাড করা হয়েছে যাতে ক্লিক করলে ডিটেইলস পেজে যায় */}
                                    <div className="mt-auto">
                                        <Button 
                                            link={`/products/${product.slug}`} 
                                            style="w-full py-2 text-sm bg-[#FF5A1F] hover:bg-[#e04d1a] transition-colors rounded-sm text-center block"
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            )}
        </div>
    )
}

export default ProductsPage;