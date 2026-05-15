'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuPlus, LuPencil, LuEllipsis, LuEye, LuLayoutGrid, LuFiles, LuTrendingUp } from "react-icons/lu";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', description: '', image: '', isFlagship: false });

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok) setCategories(data);
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCat)
        });
        if (res.ok) {
            setIsModalOpen(false);
            setNewCat({ name: '', description: '', image: '', isFlagship: false });
            fetchCategories();
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Categories...</div>;

    return (
        <div className="space-y-8">
            {/* Top Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                    <p className="text-sm text-gray-500">Organize and curate your artisan leather product collections.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#FF5A1F] text-white px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2"
                >
                    <LuPlus size={18} /> Create New Category
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-lg"><LuLayoutGrid size={24}/></div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Total Categories</p><h3 className="text-xl font-bold">{categories.length}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-lg"><LuFiles size={24}/></div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Total Items</p><h3 className="text-xl font-bold">{categories.reduce((acc, c) => acc + c.itemCount, 0)}</h3></div>
                </div>
                {/* ... বাকি ২টা স্ট্যাটস কার্ড একইভাবে ... */}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat._id} className={`bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex ${cat.isFlagship ? 'md:col-span-2' : 'flex-col'}`}>
                        <div className={`relative ${cat.isFlagship ? 'w-1/2 h-full' : 'w-full h-48'}`}>
                            <Image src={cat.image || "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=400"} alt="cat" fill className="object-cover" />
                            {cat.isFlagship && <span className="absolute bottom-4 left-4 bg-[#FF5A1F] text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase">Flagship Category</span>}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                                    <LuPencil className="text-gray-300 hover:text-gray-600 cursor-pointer" size={16} />
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{cat.description}</p>
                            </div>
                            <div className="mt-6 flex justify-between items-center">
                                <div className="flex gap-8">
                                    <div><p className="text-[10px] font-bold text-gray-300 uppercase">Products</p><p className="text-xs font-bold text-gray-700">{cat.itemCount} Items</p></div>
                                    <div><p className="text-[10px] font-bold text-gray-300 uppercase">Status</p><p className="text-xs font-bold text-green-500">{cat.status}</p></div>
                                </div>
                                <button className="text-[#FF5A1F] text-xs font-bold uppercase hover:underline">View Inventory →</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Insights Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-6">Category Insights</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-gray-50">
                            <th className="pb-4">Category Name</th>
                            <th className="pb-4">Items Count</th>
                            <th className="pb-4">Growth</th>
                            <th className="pb-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-gray-50/50">
                                <td className="py-4 text-sm font-bold text-gray-700">{cat.name}</td>
                                <td className="py-4 text-sm text-gray-500">{cat.itemCount}</td>
                                <td className="py-4 text-xs font-bold text-green-500 flex items-center gap-1 mt-4"><LuTrendingUp size={12}/> +12%</td>
                                <td className="py-4 text-right"><LuEye className="inline text-gray-300 hover:text-gray-900 cursor-pointer" size={18}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- ADD CATEGORY MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-6">Create New Category</h2>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                                <input required type="text" className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                                <input type="text" placeholder="https://..." className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" value={newCat.image} onChange={(e) => setNewCat({...newCat, image: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                <textarea rows={3} className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" value={newCat.description} onChange={(e) => setNewCat({...newCat, description: e.target.value})} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={newCat.isFlagship} onChange={(e) => setNewCat({...newCat, isFlagship: e.target.checked})} className="accent-[#FF5A1F]" />
                                <label className="text-xs font-bold text-gray-700">Flagship Category?</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-md font-bold text-gray-500 text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-[#FF5A1F] text-white rounded-md font-bold text-sm">Create Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;