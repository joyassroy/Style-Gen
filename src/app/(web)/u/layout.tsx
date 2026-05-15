'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLayoutDashboard, LuShoppingBag, LuTruck, LuFileText, LuSettings } from "react-icons/lu";
import Image from 'next/image';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: <LuLayoutDashboard size={20} />, path: '/u/dashboard' },
        { name: 'Order History', icon: <LuShoppingBag size={20} />, path: '/u/orders' },
        { name: 'Track Orders', icon: <LuTruck size={20} />, path: '/u/track' },
        { name: 'Invoices', icon: <LuFileText size={20} />, path: '/u/invoices' },
        { name: 'Profile Settings', icon: <LuSettings size={20} />, path: '/u/settings' },
    ];

    return (
        <div className="max-w-7xl mx-auto flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden md:block">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-100">
                        <Image src="https://ui-avatars.com/api/?name=Artisan&background=random" alt="User" fill />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Welcome back,</p>
                        <h3 className="font-bold text-gray-900 leading-tight">Artisan</h3>
                    </div>
                </div>

                <button className="w-full bg-[#FF5A1F] text-white py-2.5 rounded-md text-sm font-semibold mb-8 hover:bg-[#e04d1a] transition-all">
                    + New Collection
                </button>

                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                                pathname === item.path 
                                ? 'bg-orange-50 text-[#FF5A1F] border-l-4 border-[#FF5A1F]' 
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Status Card */}
                <div className="mt-12 p-4 bg-orange-50 rounded-lg border border-orange-100 text-center">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Artisan Status</h4>
                    <p className="text-[11px] text-gray-600 mb-4">You have 12 loyalty points. Redeem them for handcrafted accessories.</p>
                    <button className="w-full bg-[#FF5A1F] text-white py-2 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        Redeem Now
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;