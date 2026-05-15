'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuDownload, LuCheck, LuPackage, LuTruck, LuHouse, LuCircleCheck } from "react-icons/lu";

const TrackOrderPage = () => {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestOrder = async () => {
            try {
                // আমরা আগের বানানো /api/user/orders থেকে সবশেষ অর্ডারটি নিব
                const res = await fetch('/api/user/orders');
                const data = await res.json();
                if (res.ok && data.length > 0) {
                    setOrder(data[0]); // সবশেষ অর্ডার
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestOrder();
    }, []);

    if (loading) return <div className="p-10 text-center">Locating your package...</div>;
    if (!order) return <div className="p-10 text-center text-gray-500">No recent orders found to track.</div>;

    const statuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
    const currentStatusIndex = statuses.indexOf(order.status);

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <nav className="text-xs text-gray-400 mb-1">
                        <Link href="/u/orders" className="hover:underline">Orders</Link> 
                        <span className="mx-2">›</span> 
                        <span className="text-[#FF5A1F]">Order #ALC-{order._id.slice(-6).toUpperCase()}</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
                </div>
                <button className="bg-[#FF5A1F] text-white px-6 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-[#e04d1a] transition-all">
                    <LuDownload size={18} /> Download Invoice
                </button>
            </div>

            {/* Tracking Stepper Card */}
            <div className="bg-white border border-gray-100 rounded-xl p-10 shadow-sm mb-8">
                <div className="flex justify-between mb-10">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                        <h4 className="font-bold text-gray-800">Thursday, Oct 24th, 2024</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                        <h4 className="font-bold text-[#FF5A1F]">{order.status}</h4>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="relative flex justify-between">
                    {/* Background Line */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                    {/* Active Line */}
                    <div 
                        className="absolute top-5 left-0 h-1 bg-[#FF5A1F] transition-all duration-500 -z-0" 
                        style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                    ></div>

                    {statuses.map((s, index) => {
                        const isActive = index <= currentStatusIndex;
                        return (
                            <div key={s} className="relative z-10 flex flex-col items-center group">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all ${
                                    isActive ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white shadow-lg shadow-orange-200' : 'bg-white border-gray-100 text-gray-300'
                                }`}>
                                    {index === 0 && <LuCheck size={20} />}
                                    {index === 1 && <LuPackage size={20} />}
                                    {index === 2 && <LuTruck size={20} />}
                                    {index === 3 && <LuHouse size={20} />}
                                    {index === 4 && <LuCircleCheck size={20} />}
                                </div>
                                <p className={`mt-4 text-[11px] font-bold uppercase tracking-tighter ${isActive ? 'text-gray-800' : 'text-gray-300'}`}>
                                    {s}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Shipping Address */}
                <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    <h3 className="text-[#FF5A1F] font-bold text-xs uppercase flex items-center gap-2 mb-6">
                        <LuHouse size={16} /> Shipping Address
                    </h3>
                    <div className="space-y-1">
                        <h4 className="font-bold text-gray-800">James Alexander</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            742 Artisan Way, Suite 12<br/>
                            Craft District, Portland, OR 97201<br/>
                            United States
                        </p>
                    </div>
                    <div className="mt-12">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                        <p className="text-sm font-medium text-gray-800">+1 (553) 555-0192</p>
                    </div>
                </div>

                {/* Items Purchased */}
                <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    <h3 className="text-[#FF5A1F] font-bold text-xs uppercase flex items-center gap-2 mb-6">
                        <LuPackage size={16} /> Items Purchased
                    </h3>
                    <div className="space-y-6 mb-8">
                        {order.items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4">
                                <div className="relative h-16 w-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                    <Image src={item.productId.images[0]} alt="p" fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="text-sm font-bold text-gray-800">{item.productId.name}</h4>
                                        <p className="text-sm font-bold text-gray-800">${item.productId.discountPrice || item.productId.price}</p>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        Color: {item.color || 'Default'} | Size: {item.size || 'N/A'}
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-800 mt-1 uppercase">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

<div className="border-t border-gray-50 pt-6 space-y-2">
    <div className="flex justify-between text-sm text-gray-400">
        <span>Subtotal</span>
        {/* totalPrice এবং shippingCost না থাকলে যেন ০ ধরে হিসাব করে */}
        <span>${((order.totalPrice || 0) - (order.shippingCost || 0)).toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-sm text-gray-400">
        <span>Shipping (Express)</span>
        {/* এখানে fallback দেওয়া হলো */}
        <span>${(order.shippingCost || 0).toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-50 mt-4">
        <span>Total</span>
        <span>${(order.totalPrice || 0).toFixed(2)}</span>
    </div>
</div>
                </div>
            </div>

            {/* Tracking History Timeline */}
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-8">Tracking History</h3>
                <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-[#FF5A1F] rounded-full border-4 border-white ring-1 ring-[#FF5A1F]"></div>
                        <h4 className="text-sm font-bold text-gray-800">Arrived at Sort Facility</h4>
                        <p className="text-[11px] text-gray-400 mt-1">Oct 21, 2024 - 02:45 PM | Los Angeles, CA</p>
                    </div>
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-gray-200 rounded-full border-4 border-white"></div>
                        <h4 className="text-sm font-medium text-gray-500">Picked up by Carrier</h4>
                        <p className="text-[11px] text-gray-400 mt-1">Oct 20, 2024 - 09:00 AM | Portland, OR</p>
                    </div>
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-gray-200 rounded-full border-4 border-white"></div>
                        <h4 className="text-sm font-medium text-gray-500">Label Created</h4>
                        <p className="text-[11px] text-gray-400 mt-1">Oct 19, 2024 - 11:30 AM | Artisanal Leather Co. Warehouse</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;