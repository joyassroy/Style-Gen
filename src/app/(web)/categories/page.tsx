'use client'

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { LuLayers, LuArrowRight } from "react-icons/lu";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAndSeedCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            let data = await res.json();

            // যদি DB-তে কোনো ডাটা না থাকে, তবে পুশ করার লজিক
            if (res.ok && data.length === 0) {
                console.log("DB is empty, seeding initial categories...");
                const seedData = [
                    { name: 'Leather Bags', slug: 'leather-bags', description: 'Handcrafted premium leather bags.', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800' },
                    { name: 'Wallets', slug: 'wallets', description: 'Slim and durable artisan wallets.', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800' },
                    { name: 'Accessories', slug: 'accessories', description: 'Belts, straps and small goods.', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800' },
                    { name: 'Travel Gear', slug: 'travel-gear', description: 'Everything you need for your journey.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800' },
                ];

                // এক এক করে ডেটাবেসে পুশ করা
                for (const item of seedData) {
                    await fetch('/api/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                }
                // পুশ করার পর আবার ফেচ করা
                const updatedRes = await fetch('/api/categories');
                data = await updatedRes.json();
            }

            if (res.ok) setCategories(data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSeedCategories();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#FF5A1F]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 bg-orange-50 text-[#FF5A1F] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                    <LuLayers size={14} /> Collections
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900">Explore Categories</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                    Discover our range of handcrafted artisan leather goods, designed for durability and timeless style.
                </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((category) => (
                    <Link 
                        href={`/categories/${category.name.toLowerCase().replace(/ /g, '-')}`} 
                        key={category._id}
                        className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                        {/* Image Wrapper */}
                        <div className="relative h-[350px] w-full overflow-hidden">
                            <Image 
                                fill
                                alt={category.name} 
                                src={category.image || "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=400"} 
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-1">Handcrafted</p>
                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                Explore Products <LuArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {categories.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-medium">No categories found in the workshop.</p>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;