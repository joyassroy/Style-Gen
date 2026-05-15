'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { LuShoppingBag, LuClock, LuCreditCard, LuTrophy, LuArrowRight, LuTruck } from "react-icons/lu";
import Link from 'next/link';
import Image from 'next/image';

const UserDashboard = () => {
    const { data: session } = useSession();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/user/dashboard');
                const result = await res.json();
                if (res.ok) setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center py-20 animate-pulse">Organizing your dashboard...</div>;

    const stats = [
        { label: 'Total Orders', value: data?.stats?.totalOrders, icon: <LuShoppingBag />, color: 'bg-blue-50 text-blue-600' },
        { label: 'Pending Orders', value: data?.stats?.pendingOrders, icon: <LuClock />, color: 'bg-orange-50 text-orange-600' },
        { label: 'Total Spent', value: `BDT ${data?.stats?.totalSpent.toLocaleString()}`, icon: <LuCreditCard />, color: 'bg-green-50 text-green-600' },
        { label: 'Loyalty Points', value: data?.stats?.loyaltyPoints, icon: <LuTrophy />, color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div className="max-w-6xl">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Hello, {session?.user?.name}! 👋</h1>
                <p className="text-sm text-gray-500 mt-1">Here is what's happening with your account today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-gray-900">Recent Orders</h2>
                        <Link href="/u/orders" className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:underline">
                            View All <LuArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {data?.recentOrders?.length === 0 ? (
                            <p className="p-10 text-center text-gray-400">No orders placed yet.</p>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {data?.recentOrders.map((order: any) => (
                                    <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 relative bg-gray-50 rounded border border-gray-100 overflow-hidden">
                                                <Image src={order.items[0]?.productId?.images[0]} alt="p" fill className="object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800">#ALC-{order._id.slice(-6).toUpperCase()}</h4>
                                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">BDT {order.totalPrice}</p>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Shortcuts / Info Area */}
                <div className="space-y-6">
                    <h2 className="font-bold text-gray-900">Quick Actions</h2>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <Link href="/u/track" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-orange-50 group transition-all">
                            <div className="flex items-center gap-3 text-gray-700 group-hover:text-[#FF5A1F]">
                                <LuTruck size={20} />
                                <span className="text-sm font-medium">Track Latest Order</span>
                            </div>
                            <LuArrowRight size={16} className="text-gray-300 group-hover:text-[#FF5A1F]" />
                        </Link>
                        
                        <Link href="/products" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-orange-50 group transition-all">
                            <div className="flex items-center gap-3 text-gray-700 group-hover:text-[#FF5A1F]">
                                <LuShoppingBag size={20} />
                                <span className="text-sm font-medium">Continue Shopping</span>
                            </div>
                            <LuArrowRight size={16} className="text-gray-300 group-hover:text-[#FF5A1F]" />
                        </Link>
                    </div>

                    {/* Artisan Perk Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl text-white">
                        <LuTrophy className="text-[#FF5A1F] mb-4" size={32} />
                        <h3 className="font-bold mb-2">Artisan Membership</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                            You're 3 orders away from becoming a "Master Artisan" and unlocking free shipping for life!
                        </p>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#FF5A1F] h-full w-[70%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;