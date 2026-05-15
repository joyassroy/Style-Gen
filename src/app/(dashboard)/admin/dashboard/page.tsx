'use client'

import React, { useEffect, useState } from 'react';
import { LuDollarSign, LuShoppingBag, LuUsers, LuTrendingUp, LuArrowUpRight, LuPackage, LuActivity } from "react-icons/lu";
import Image from 'next/image';

const AdminOverview = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            const res = await fetch('/api/admin/dashboard');
            const result = await res.json();
            if (res.ok) setData(result);
            setLoading(false);
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Analytics...</div>;

    const cards = [
        { label: 'Total Revenue', value: `BDT ${data?.stats?.revenue.toLocaleString()}`, icon: <LuDollarSign />, change: '+12.5%', color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Orders', value: data?.stats?.orders, icon: <LuShoppingBag />, change: '+8.1%', color: 'text-[#FF5A1F]', bg: 'bg-orange-50' },
        { label: 'Total Customers', value: data?.stats?.customers, icon: <LuUsers />, change: '+5.4%', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg. Conversion', value: data?.stats?.conversion, icon: <LuActivity />, change: '+2.1%', color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here's what's happening with StyleGen today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${card.bg} ${card.color} p-2 rounded-lg text-xl`}>{card.icon}</div>
                            <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                                {card.change} <LuTrendingUp size={10} />
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Placeholder / Analytics Insight */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><LuActivity className="text-[#FF5A1F]"/> Sales Analytics</h3>
                            <select className="text-xs font-bold border-none bg-gray-50 rounded px-3 py-1">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        {/* গ্রাফের ডামি ভিউ (রিয়েল চার্ট লাইব্রেরি যেমন Recharts পরে অ্যাড করা যাবে) */}
                        <div className="h-64 flex items-end gap-3 px-2">
                            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-orange-50 rounded-t-md relative group">
                                    <div 
                                        className="absolute bottom-0 w-full bg-[#FF5A1F] rounded-t-md transition-all duration-700" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 150}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase px-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* Recent Sales Table */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Recent Sales Activity</h3>
                            <button className="text-[10px] font-bold text-[#FF5A1F] uppercase hover:underline">View All Orders</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <tbody className="divide-y divide-gray-50">
                                    {data?.recentSales.map((order: any) => (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900 uppercase">#ORD-{order._id.slice(-5)}</td>
                                            <td className="px-6 py-4 text-gray-600">{order.userId?.name}</td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-900">BDT {order.totalPrice}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products & Inventory Alert */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><LuPackage className="text-[#FF5A1F]"/> Inventory Watch</h3>
                        <div className="space-y-6">
                            {data?.topProducts.map((p: any) => (
                                <div key={p._id} className="flex items-center gap-4">
                                    <div className="h-10 w-10 relative bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                        <Image src={p.images?.[0] || `https://ui-avatars.com/api/?name=${p.name}`} alt="p" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-xs font-bold text-gray-900 truncate">{p.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1 bg-gray-100 rounded-full">
                                                <div className={`h-full rounded-full ${p.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(p.stock * 4, 100)}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400">{p.stock} Left</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Insight Card */}
                    <div className="bg-[#111] p-6 rounded-xl text-white">
                        <div className="bg-[#FF5A1F]/20 text-[#FF5A1F] w-fit p-2 rounded-lg mb-4">
                            <LuArrowUpRight size={24} />
                        </div>
                        <h4 className="font-bold mb-2">Performance Insight</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                            Your store has seen a 12% increase in sales today compared to last Friday. High demand in "Travel Gear" category.
                        </p>
                        <button className="w-full bg-[#FF5A1F] text-white py-2.5 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-[#e04d1a] transition-all">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;