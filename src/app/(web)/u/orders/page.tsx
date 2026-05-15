'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuDownload, LuTruck, LuShieldCheck, LuMessageSquare } from "react-icons/lu";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/user/orders');
                const data = await res.json();
                if (res.ok) setOrders(data);
            } catch (err) {
                console.error("Order fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // স্ট্যাটাস অনুযায়ী কালার সেট করার ফাংশন
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-600';
            case 'shipped': return 'bg-blue-100 text-blue-600';
            case 'cancelled': return 'bg-gray-100 text-gray-500';
            case 'pending': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-20">Loading Order History...</div>;

    return (
        <div className="max-w-6xl">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage your recent purchases and artisanal custom orders.</p>
                </div>
                <button className="bg-[#FF5A1F] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#e04d1a]">
                    + New Collection
                </button>
            </div>

            {/* Orders Table Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-12">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Total Amount</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-400">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-sm font-bold text-gray-700 uppercase">
                                        #ALC-{order._id.slice(-5)}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                                                <Image 
                                                    src={order.items[0]?.productId?.images[0] || "/placeholder.png"} 
                                                    alt="prod" fill className="object-cover" 
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 line-clamp-1">
                                                {order.items[0]?.productId?.name || "Product Deleted"}
                                                {order.items.length > 1 && ` +${order.items.length - 1} more`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-900 text-center">
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button className="text-orange-400 hover:text-orange-600 transition-colors">
                                            <LuDownload size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination (Static UI) */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50">
                    <p className="text-xs text-gray-400 font-medium">Showing {orders.length} of {orders.length} orders</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 text-[10px] font-bold uppercase rounded text-gray-400 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-[#FF5A1F] text-white text-[10px] font-bold rounded">1</button>
                        <button className="px-3 py-1 border border-gray-200 text-[10px] font-bold rounded text-gray-500">2</button>
                        <button className="px-3 py-1 border border-gray-200 text-[10px] font-bold uppercase rounded text-gray-500">Next</button>
                    </div>
                </div>
            </div>

            {/* Bottom Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm group">
                    <LuTruck className="text-[#FF5A1F] mb-3" size={24} />
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Track Shipping</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Track your current shipments in real-time with our artisanal partners.</p>
                    <Link href="/u/track" className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 group-hover:underline">
                        Track Now →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm group">
                    <LuShieldCheck className="text-[#FF5A1F] mb-3" size={24} />
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Lifetime Warranty</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Every item in your order history is covered by our lifetime craft warranty.</p>
                    <Link href="/policy" className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 group-hover:underline">
                        Read Policy →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm group">
                    <LuMessageSquare className="text-[#FF5A1F] mb-3" size={24} />
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Custom Care</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Need a repair or conditioning? Start a craft ticket for any past order.</p>
                    <Link href="/support" className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 group-hover:underline">
                        Start Ticket →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;