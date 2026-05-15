'use client'

import React from 'react';
import Link from 'next/link';
import { LuArrowLeft, LuHouse, LuSearch, LuShoppingBag } from "react-icons/lu";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
                {/* Big 404 Background Text */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-black text-gray-100 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white shadow-xl rotate-3">
                            <p className="text-[#FF5A1F] font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
                                Page Not Found
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-8 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Lost in the Workshop? 🛠️
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                        দুঃখিত ভাই! আপনি যে পেজটি খুঁজছেন সেটি আমাদের এই কারুশিল্পের গ্যালারিতে খুঁজে পাওয়া যাচ্ছে না। হয়তো লিঙ্কটি ভুল অথবা পেজটি সরিয়ে নেওয়া হয়েছে।
                    </p>

                    {/* Search Bar (Optional but helpful) */}
                    <div className="max-w-sm mx-auto relative group">
                        <input 
                            type="text" 
                            placeholder="Search products, collections..." 
                            className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 pl-12 text-sm focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] outline-none transition-all shadow-sm"
                        />
                        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5A1F] transition-colors" size={18} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 bg-[#FF5A1F] text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#e04d1a] hover:shadow-lg hover:shadow-orange-200 transition-all w-full sm:w-auto justify-center"
                        >
                            <LuHouse size={18} /> Back to Home
                        </Link>
                        <Link 
                            href="/products" 
                            className="flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gray-50 transition-all w-full sm:w-auto justify-center"
                        >
                            <LuShoppingBag size={18} /> Browse Products
                        </Link>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="mt-20 pt-8 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                        StyleGen Artisan Management System v3.1
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;