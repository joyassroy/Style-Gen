'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LuDownload, LuList, LuLayoutGrid, LuArrowUpRight, LuPlus } from "react-icons/lu";

const AdminProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const [prodRes, statRes] = await Promise.all([
                fetch('/api/admin/products'),
                fetch('/api/admin/stats')
            ]);
            
            const prodData = await prodRes.json();
            const statData = await statRes.json();

            if (prodRes.ok) setProducts(prodData);
            if (statRes.ok) setStats(statData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

    const statsCards = [
        { label: 'Total Products', value: stats?.totalProducts, change: '+12%', color: 'text-gray-900' },
        { label: 'Active Inventory', value: `BDT ${stats?.inventoryValue.toLocaleString()}`, change: null, color: 'text-gray-900' },
        { label: 'Low Stock Alert', value: stats?.lowStockCount, change: null, color: 'text-orange-500', border: 'border-l-4 border-orange-500' },
        { label: 'New Submissions', value: stats?.newSubmissions, change: null, color: 'text-gray-900' },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, i) => (
                    <div key={i} className={`bg-white p-6 rounded-lg border border-gray-100 shadow-sm ${stat.border}`}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Catalog header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Product Catalog</h2>
                    <p className="text-sm text-gray-500">Managing {products.length} active items in your database.</p>
                </div>
                <button 
                    onClick={() => router.push('/admin/products/new')}
                    className="bg-[#FF5A1F] text-white px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-[#e04d1a]"
                >
                    <LuPlus size={18} /> New Product
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((p) => {
                                const isLow = p.stock < 10;
                                const isCritical = p.stock === 0;
                                return (
                                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-gray-50 rounded relative overflow-hidden">
                                                    <Image src={p.images?.[0] || "https://ui-avatars.com/api/?name=" + p.name} alt="p" fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                                    <p className="text-[10px] text-gray-400">ID: {p._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">BDT {p.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-40">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-[10px] font-bold text-gray-900">{p.stock} in stock</p>
                                                    <p className={`text-[10px] font-bold uppercase ${isCritical ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-green-500'}`}>
                                                        {isCritical ? 'Critical' : isLow ? 'Low' : 'Healthy'}
                                                    </p>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                                                    <div 
                                                        className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-green-500'}`}
                                                        style={{ width: `${Math.min(p.stock * 2, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => router.push(`/admin/products/edit/${p._id}`)}
                                                className="text-gray-400 hover:text-[#FF5A1F] p-2"
                                            >
                                                <LuArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;