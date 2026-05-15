'use client'

import React, { useEffect, useState } from 'react';
import { LuDownload, LuPrinter, LuFileText, LuEye } from "react-icons/lu";
import Image from 'next/image';

const InvoicesPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch('/api/user/orders');
                const data = await res.json();
                if (res.ok) setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Generating invoices...</div>;

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <header className="mb-8 print:hidden">
                <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                <p className="text-sm text-gray-500 mt-1">Download and manage your billing statements for every order.</p>
            </header>

            {/* Invoices Table */}
            {!selectedInvoice ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden print:hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">Invoice ID</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">Billing Date</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">Amount</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-center">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-sm font-bold text-gray-700 uppercase">
                                        INV-{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-900">
                                        BDT {order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {order.status === 'Delivered' ? 'PAID' : 'DUE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => setSelectedInvoice(order)}
                                            className="text-[#FF5A1F] hover:bg-orange-50 p-2 rounded-md transition-all inline-flex items-center gap-1 text-xs font-bold"
                                        >
                                            <LuEye size={16} /> VIEW
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* --- Printable Invoice Detail View --- */
                <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-lg max-w-4xl mx-auto relative">
                    {/* Invoice Controls */}
                    <div className="absolute top-6 right-6 flex gap-3 print:hidden">
                        <button onClick={() => setSelectedInvoice(null)} className="text-xs font-bold text-gray-400 hover:text-gray-900">← BACK</button>
                        <button onClick={handlePrint} className="bg-gray-900 text-white p-2 rounded-md hover:bg-black"><LuPrinter size={18} /></button>
                        <button className="bg-[#FF5A1F] text-white p-2 rounded-md hover:bg-[#e04d1a]"><LuDownload size={18} /></button>
                    </div>

                    {/* Branding */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <div className="mb-4">
                                <h1 className="text-2xl font-black italic text-[#FF5A1F]">StyleGen</h1>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                123 Artisan Way, Suite 400<br/>
                                Brooklyn, NY 11201, USA<br/>
                                support@stylegen.co
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-light text-gray-300 uppercase tracking-widest mb-2">Invoice</h2>
                            <p className="text-sm font-bold text-gray-900">#INV-{selectedInvoice._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-400 mt-1">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="grid grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
                            <h4 className="font-bold text-gray-900">{selectedInvoice.shippingAddress?.name || "Customer Name"}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                {selectedInvoice.shippingAddress?.address || "Address details not provided"}<br/>
                                Phone: {selectedInvoice.shippingAddress?.phone}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Method</p>
                            <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                            <p className="text-xs text-gray-500 mt-1">Status: <span className="text-[#FF5A1F] font-bold">{selectedInvoice.status === 'Delivered' ? 'Settled' : 'Pending'}</span></p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mb-12">
                        <thead>
                            <tr className="border-b border-gray-900">
                                <th className="py-3 text-left text-[10px] font-bold uppercase">Item Description</th>
                                <th className="py-3 text-center text-[10px] font-bold uppercase">Qty</th>
                                <th className="py-3 text-right text-[10px] font-bold uppercase">Price</th>
                                <th className="py-3 text-right text-[10px] font-bold uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {selectedInvoice.items.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="py-5">
                                        <p className="text-sm font-bold text-gray-900">{item.productId?.name}</p>
                                        <p className="text-[10px] text-gray-400">Size: {item.size || 'N/A'}</p>
                                    </td>
                                    <td className="py-5 text-sm text-center text-gray-600">{item.quantity}</td>
                                    <td className="py-5 text-sm text-right text-gray-600">BDT {item.productId?.discountPrice || item.productId?.price}</td>
                                    <td className="py-5 text-sm font-bold text-right text-gray-900">
                                        BDT {((item.productId?.discountPrice || item.productId?.price) * item.quantity).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>BDT {(selectedInvoice.totalPrice - (selectedInvoice.shippingCost || 0)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping Fee</span>
                                <span>BDT {(selectedInvoice.shippingCost || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-900">
                                <span>TOTAL</span>
                                <span>BDT {selectedInvoice.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-20 pt-10 border-t border-gray-50 text-center">
                        <p className="text-xs text-gray-400 italic">Thank you for supporting artisanal craftsmanship. This is a computer-generated invoice.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoicesPage;