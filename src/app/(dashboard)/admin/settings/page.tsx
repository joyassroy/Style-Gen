'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuUser, LuShieldCheck, LuSettings, LuDatabase, LuActivity, LuSave, LuRefreshCw } from "react-icons/lu";

const AdminSettings = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await fetch('/api/admin/settings');
            const result = await res.json();
            if (res.ok) setData(result);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse">Accessing master settings...</div>;

    const tabs = [
        { id: 'profile', name: 'Admin Profile', icon: <LuUser /> },
        { id: 'security', name: 'Security', icon: <LuShieldCheck /> },
        { id: 'system', name: 'System Health', icon: <LuActivity /> },
    ];

    return (
        <div className="max-w-5xl">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-sm text-gray-500">Configure your administrative preferences and monitor platform integrity.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white">
                        <LuRefreshCw size={18} />
                    </button>
                    <button className="bg-[#FF5A1F] text-white px-5 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-[#e04d1a]">
                        <LuSave size={18} /> Save All Changes
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-8">
                {/* Side Navigation */}
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all ${
                                activeTab === tab.id ? 'bg-white shadow-sm ring-1 ring-gray-100 text-[#FF5A1F]' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab.icon} {tab.name}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8 animate-in fade-in duration-300">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Personal Information</h2>
                            <div className="flex items-center gap-8">
                                <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-4 border-gray-50 shadow-inner">
                                    <Image src={data?.admin?.image || `https://ui-avatars.com/api/?name=${data?.admin?.name}`} alt="admin" fill className="object-cover" />
                                </div>
                                <div>
                                    <button className="text-xs font-bold border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 uppercase tracking-wider">Change Avatar</button>
                                    <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Recommended size: 400x400px</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Display Name</label>
                                    <input type="text" defaultValue={data?.admin?.name} className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF5A1F]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                    <input type="email" defaultValue={data?.admin?.email} className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF5A1F]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            {/* Insight Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 text-green-500 mb-4">
                                        <LuDatabase size={20} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Database Node</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900">{data?.systemInsights?.dbStatus}</h4>
                                    <p className="text-xs text-gray-400 mt-1 italic">Last backup performed {data?.systemInsights?.lastBackup}</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 text-[#FF5A1F] mb-4">
                                        <LuActivity size={20} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">API Latency</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900">{data?.systemInsights?.apiLatency}</h4>
                                    <p className="text-xs text-gray-400 mt-1 italic">Connected via Dhaka Node</p>
                                </div>
                            </div>

                            {/* Storage Breakdown */}
                            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-900">Platform Storage Usage</h3>
                                    <span className="text-xs font-bold text-gray-400">{data?.systemInsights?.storageUsed}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden mb-6">
                                    <div className="bg-[#FF5A1F] h-full w-[25%] rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Assets</p>
                                        <p className="text-xl font-bold text-gray-900">{data?.systemInsights?.totalAssets.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">System Version</p>
                                        <p className="text-xl font-bold text-gray-900">v3.1 Flash Lite</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
                            <h2 className="font-bold text-gray-900">Security Credentials</h2>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Current Password</label>
                                    <input type="password" placeholder="••••••••••••" className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">New Password</label>
                                        <input type="password" className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm Password</label>
                                        <input type="password" className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm" />
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded leading-relaxed border-l-2 border-[#FF5A1F]">
                                    Note: Changing your password will sign you out of all active sessions across all devices.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;