'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LuArrowLeft, LuShoppingBag, LuInfo } from "react-icons/lu";

const CategoriesDetailsPage = () => {
    const { slug } = useParams();
    const router = useRouter();
    const [data, setData] = useState<{category: any, products: any[]}>({ category: null, products: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const res = await fetch(`/api/categories/details?slug=${slug}`);
                const result = await res.json();
                if (res.ok) setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryDetails();
    }, [slug]);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center animate-pulse text-gray-400">Loading collection...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
            {/* Back Button & Header */}
            <header className="space-y-6">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#FF5A1F] transition-colors uppercase tracking-widest"
                >
                    <LuArrowLeft size={16} /> Back to Categories
                </button>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 capitalize">
                            {data.category?.name || (typeof slug === 'string' ? slug.replace(/-/g, ' ') : '')}
                        </h1>
                        <p className="text-gray-500 max-w-2xl text-sm md:text-base leading-relaxed">
                            {data.category?.description || "Explore our exclusive collection of artisan-crafted leather goods."}
                        </p>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Items</p>
                        <p className="text-2xl font-black text-gray-900">{data.products.length} Products</p>
                    </div>
                </div>
            </header>

            {/* Product Grid */}
            {data.products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {data.products.map((product) => (
                        <Link 
                            href={`/product/${product._id}`} 
                            key={product._id}
                            className="group"
                        >
                            <div className="relative h-[250px] md:h-[350px] w-full rounded-2xl overflow-hidden bg-gray-100 mb-4 transition-all duration-500 group-hover:shadow-xl">
                                <Image 
                                    src={product.images?.[0] || "https://ui-avatars.com/api/?name=" + product.name} 
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {product.discountPrice && (
                                    <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">
                                        SALE
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="bg-white text-black p-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                                        <LuShoppingBag size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1 px-1">
                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#FF5A1F] transition-colors truncate">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-black text-gray-900">
                                        BDT {product.discountPrice || product.price}
                                    </p>
                                    {product.discountPrice && (
                                        <p className="text-xs text-gray-400 line-through">BDT {product.price}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="py-32 flex flex-col items-center text-center space-y-4 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="p-4 bg-white rounded-full shadow-sm text-gray-300">
                        <LuInfo size={40} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                        <p className="text-sm text-gray-400">This category is currently being curated. Check back soon!</p>
                    </div>
                    <Link href="/categories" className="text-xs font-bold text-[#FF5A1F] uppercase hover:underline pt-4">
                        Explore other categories
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CategoriesDetailsPage;