'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LuLayoutDashboard, LuUsers, LuPackage, LuLayers, 
    LuShoppingCart, LuSettings, LuMenu, LuX, LuBell, LuLogOut 
} from "react-icons/lu";
import Logo from "@/components/ui/Logo";
import { signOut, useSession } from "next-auth/react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        { name: 'Overview', icon: <LuLayoutDashboard size={20} />, path: '/admin/dashboard' },
        { name: 'Customers', icon: <LuUsers size={20} />, path: '/admin/customers' },
        { name: 'Products', icon: <LuPackage size={20} />, path: '/admin/products' },
        { name: 'Categories', icon: <LuLayers size={20} />, path: '/admin/categories' },
        { name: 'Orders', icon: <LuShoppingCart size={20} />, path: '/admin/orders' },
        { name: 'Settings', icon: <LuSettings size={20} />, path: '/admin/settings' },
    ];

    // লগআউট ফাংশন
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            {/* Sidebar for Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="p-6">
                    <Logo />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Artisan Management</p>
                </div>

                <nav className="mt-4 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                                pathname === item.path 
                                ? 'bg-orange-50 text-[#FF5A1F] border-r-4 border-[#FF5A1F]' 
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Admin Profile & Logout at Bottom */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-50 bg-white">
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50/50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-9 w-9 rounded-full bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] font-bold shrink-0">
                                {session?.user?.name?.slice(0, 1) || "A"}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-gray-900 truncate">{session?.user?.name || "Admin User"}</p>
                                <p className="text-[10px] text-gray-400 truncate">{session?.user?.email || "admin@stylegen.com"}</p>
                            </div>
                        </div>
                        
                        {/* Real Logout Button */}
                        <button 
                            onClick={handleLogout}
                            title="Logout"
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all shrink-0"
                        >
                            <LuLogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-500">
                            {isSidebarOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </button>
                        <div className="max-w-md w-full relative hidden sm:block">
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="w-full bg-gray-50 border-none rounded-md py-2 px-4 text-sm focus:ring-1 focus:ring-[#FF5A1F] transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600 relative p-2">
                            <LuBell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF5A1F] rounded-full border-2 border-white"></span>
                        </button>
                        <Link 
                            href="/admin/products/new"
                            className="bg-black text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm"
                        >
                            + New Product
                        </Link>
                    </div>
                </header>

                <main className="p-4 md:p-8 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;