'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuPlus, LuTrash2, LuImage, LuArrowLeft, LuSave } from "react-icons/lu";

const AddProductPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // ফর্ম স্টেট
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        stock: '',
        images: [''], // অন্তত একটা ইমেজ ইনপুট
        sizes: [''],
        colors: ['']
    });

    // ইনপুট হ্যান্ডেলার
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ইমেজ/সাইজ/কালার ফিল্ড অ্যাড করা
    const addField = (field: 'images' | 'sizes' | 'colors') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    // ফিল্ড রিমুভ করা
    const removeField = (field: 'images' | 'sizes' | 'colors', index: number) => {
        const updated = [...formData[field]];
        updated.splice(index, 1);
        setFormData({ ...formData, [field]: updated });
    };

    // ভ্যালু আপডেট করা (Arrays এর জন্য)
    const handleArrayChange = (field: 'images' | 'sizes' | 'colors', index: number, value: string) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Product added successfully! 🎉");
                router.push('/admin/products');
            }
        } catch (error) {
            alert("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                        <LuArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                        <p className="text-sm text-gray-500">Create a new artisan masterpiece for your catalog.</p>
                    </div>
                </div>
                <button 
                    form="product-form"
                    disabled={loading}
                    className="bg-[#FF5A1F] text-white px-8 py-3 rounded-md font-bold text-sm uppercase flex items-center gap-2 hover:bg-[#e04d1a] disabled:opacity-50"
                >
                    <LuSave size={18} /> {loading ? "Publishing..." : "Publish Product"}
                </button>
            </header>

            <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Side: General Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                            <input required name="name" type="text" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-[#FF5A1F]" placeholder="e.g. Classic Leather Tote" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                            <textarea name="description" rows={5} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-[#FF5A1F]" placeholder="Tell the story of this product..." />
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><LuImage size={18} className="text-[#FF5A1F]" /> Product Images</h3>
                        <div className="space-y-4">
                            {formData.images.map((img, i) => (
                                <div key={i} className="flex gap-2">
                                    <input required type="text" value={img} onChange={(e) => handleArrayChange('images', i, e.target.value)} placeholder="Enter Image URL (HTTPS)" className="flex-1 bg-gray-50 border-none rounded-md px-4 py-2.5 text-xs" />
                                    {formData.images.length > 1 && (
                                        <button type="button" onClick={() => removeField('images', i)} className="p-2 text-red-400 hover:text-red-600"><LuTrash2 size={18} /></button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addField('images')} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 uppercase tracking-wider mt-2"><LuPlus size={14} /> Add Another Image</button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Inventory & Pricing */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">Pricing & Stock</h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Regular Price (BDT)</label>
                            <input required name="price" type="number" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Discount Price (Optional)</label>
                            <input name="discountPrice" type="number" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                            <input required name="category" type="text" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" placeholder="e.g. Wallets" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Stock Quantity</label>
                            <input required name="stock" type="number" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">Variants</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Sizes (e.g. XL, 15")</label>
                                {formData.sizes.map((s, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input type="text" value={s} onChange={(e) => handleArrayChange('sizes', i, e.target.value)} className="flex-1 bg-gray-50 border-none rounded-md px-4 py-2 text-xs" />
                                        <button type="button" onClick={() => removeField('sizes', i)} className="text-gray-300"><LuTrash2 size={14}/></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addField('sizes')} className="text-[10px] font-bold text-[#FF5A1F] uppercase">+ Add Size</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;