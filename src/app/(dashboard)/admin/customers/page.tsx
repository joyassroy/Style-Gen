'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuUserPlus, LuZap, LuTrendingUp, LuDollarSign, LuEllipsis } from "react-icons/lu";

const CustomersManagement = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch('/api/admin/customers');
                const result = await res.json();
                if (res.ok) setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse">Fetching client base...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers Management</h1>
                    <p className="text-sm text-gray-500 mt-1">A comprehensive view of your global artisanal leather client base.</p>
                </div>
                <button className="bg-[#FF5A1F] text-white px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-[#e04d1a]">
                    <LuUserPlus size={18} /> Add New Customer
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Customers</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-gray-900">{data?.stats?.totalCustomers.toLocaleString()}</h3>
                        <div className="bg-orange-50 text-[#FF5A1F] p-2 rounded-lg"><LuTrendingUp size={20} /></div>
                    </div>
                    <p className="text-[10px] font-bold text-green-500 mt-2">+12.4% <span className="text-gray-400">from last month</span></p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Active Now</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-gray-900">{data?.stats?.activeNow}</h3>
                        <div className="bg-gray-50 text-gray-400 p-2 rounded-lg"><LuZap size={20} /></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Across all platforms</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Avg. Lifetime Value</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-gray-900">BDT {data?.stats?.avgLifetimeValue.toLocaleString()}</h3>
                        <div className="bg-gray-50 text-gray-400 p-2 rounded-lg"><LuDollarSign size={20} /></div>
                    </div>
                    <div className="mt-4 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-[#FF5A1F] h-full w-[65%]"></div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Contact Details</th>
                                <th className="px-6 py-4 text-center">Volume</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data?.customers.map((customer: any) => (
                                <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                                <Image src={customer.image || `https://ui-avatars.com/api/?name=${customer.name}`} alt="c" fill />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{customer.name}</p>
                                                <p className="text-[10px] text-gray-400">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 font-medium">{customer.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-50 px-3 py-1 rounded-full text-[10px] font-bold text-gray-700 border border-gray-100">
                                            {customer.orderCount} Orders
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full flex items-center justify-center gap-1 w-fit mx-auto ${
                                            customer.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                            <span className={`w-1 h-1 rounded-full ${customer.status === 'ACTIVE' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                            <LuEllipsis size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomersManagement;