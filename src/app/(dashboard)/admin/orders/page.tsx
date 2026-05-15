'use client'

import React, { useEffect, useState } from 'react';
import { LuFileOutput, LuClock, LuDollarSign, LuTruck, LuShoppingBag, LuEllipsis, LuTrendingUp } from "react-icons/lu";

const AdminOrdersPage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/admin/orders');
                const result = await res.json();
                if (res.ok) setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading orders...</div>;

    const statsCards = [
        { label: 'Total Orders', value: data?.stats?.totalOrders, icon: <LuShoppingBag />, color: 'text-orange-500', bg: 'bg-orange-50', change: '+12.5%' },
        { label: 'Pending Processing', value: data?.stats?.pendingProcessing, icon: <LuClock />, color: 'text-gray-600', bg: 'bg-gray-100', change: 'Stable' },
        { label: 'Total Revenue', value: `BDT ${data?.stats?.totalRevenue.toLocaleString()}`, icon: <LuDollarSign />, color: 'text-orange-600', bg: 'bg-orange-50', change: '+8.2%' },
        { label: 'Delivered Success', value: data?.stats?.deliveredSuccess, icon: <LuTruck />, color: 'text-green-600', bg: 'bg-green-50', change: '99.2%' },
    ];

    return (
        <div className="space-y-8">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <div className="flex items-center gap-3">
                    <button className="bg-[#FF5A1F] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2">
                        <LuFileOutput size={16} /> Export Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>{stat.icon}</div>
                            <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <LuTrendingUp size={10} /> {stat.change}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div className="flex gap-2">
                        <select className="text-[10px] font-bold border border-gray-200 rounded px-2 py-1 bg-white uppercase">
                            <option>All Statuses</option>
                        </select>
                        <select className="text-[10px] font-bold border border-gray-200 rounded px-2 py-1 bg-white uppercase">
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Displaying {data?.orders.length} orders</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer Name</th>
                                <th className="px-6 py-4 text-center">Date</th>
                                <th className="px-6 py-4 text-center">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {data?.orders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 font-bold text-gray-900 uppercase">#ORD-{order._id.slice(-5)}</td>
                                    <td className="px-6 py-5 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                            {order.userId?.name?.slice(0, 2)}
                                        </div>
                                        <span className="font-medium text-gray-700">{order.userId?.name || "Deleted User"}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-5 text-center font-bold text-gray-900">
                                        BDT {order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded flex items-center justify-center gap-1 w-fit mx-auto ${
                                            order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            <span className={`w-1 h-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-600' : 'bg-orange-600'}`}></span>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="text-gray-300 hover:text-gray-600"><LuEllipsis size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Artisan Workshop Status</h3>
                    <p className="text-xs text-gray-500 max-w-md leading-relaxed mb-8">Currently processing high-volume artisan orders. Lead times are stable at 3-5 business days.</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Delivery</p>
                            <h4 className="text-xl font-bold text-gray-900 mt-1">4.2 Days</h4>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Return Rate</p>
                            <h4 className="text-xl font-bold text-gray-900 mt-1">1.4%</h4>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Customer Sat</p>
                            <h4 className="text-xl font-bold text-gray-900 mt-1">4.9/5</h4>
                        </div>
                    </div>
                    {/* Background Illustration Path (Optional) */}
                    <div className="absolute right-10 bottom-10 opacity-5">
                        <LuShoppingBag size={120} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-orange-500">⚡</span> Recent Activity
                    </h3>
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-50">
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1.5 w-3 h-3 bg-orange-500 rounded-sm border-2 border-white"></div>
                            <h4 className="text-xs font-bold text-gray-900">New order received</h4>
                            <p className="text-[10px] text-gray-400 mt-1">Order #ORD-89212 from Julianne Devis</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">2 minutes ago</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1.5 w-3 h-3 bg-green-500 rounded-sm border-2 border-white"></div>
                            <h4 className="text-xs font-bold text-gray-900">Shipment confirmed</h4>
                            <p className="text-[10px] text-gray-400 mt-1">Order #ORD-89198 is now with DHL</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">45 minutes ago</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1.5 w-3 h-3 bg-blue-500 rounded-sm border-2 border-white"></div>
                            <h4 className="text-xs font-bold text-gray-900">Return processed</h4>
                            <p className="text-[10px] text-gray-400 mt-1">Order #ORD-89100 refund complete</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;