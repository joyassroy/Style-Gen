'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuCamera, LuMapPin, LuLock, LuBell, LuUser } from "react-icons/lu";
import { useSession } from 'next-auth/react';

const ProfileSettings = () => {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // ফর্ম স্টেট
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // ডাটাবেস থেকে ইউজারের ডাটা আনা
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile');
                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        phone: data.phone || ''
                    });
                }
            } catch (err) {
                console.error("Profile fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // ডাটা আপডেট করা
    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Profile updated successfully! 🎉");
            }
        } catch (error) {
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading Profile...</div>;

    return (
        <div className="max-w-4xl">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Update your account details and manage your preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-8">
                {/* Sidebar Tabs (UI Static) */}
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-[#FF5A1F] bg-white shadow-sm ring-1 ring-gray-100"><LuUser /> Personal Information</button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"><LuMapPin /> Shipping Addresses</button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"><LuLock /> Security & Password</button>
                </div>

                {/* Form Content */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-gray-900 mb-6">Personal Information</h2>
                        
                        {/* Profile Picture (Image dynamic can be added later) */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-50">
                            <div className="relative h-20 w-20">
                                <Image src={session?.user?.image || "https://ui-avatars.com/api/?name=" + session?.user?.name} alt="profile" fill className="rounded-lg object-cover" />
                                <button className="absolute -bottom-2 -right-2 bg-[#FF5A1F] text-white p-1.5 rounded-full border-4 border-white"><LuCamera size={14} /></button>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Profile Picture</h4>
                                <p className="text-xs text-gray-400">PNG, JPG up to 5MB.</p>
                            </div>
                        </div>

                        {/* input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">First Name</label>
                                <input 
                                    type="text" 
                                    value={formData.firstName} 
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF5A1F]" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Last Name</label>
                                <input 
                                    type="text" 
                                    value={formData.lastName} 
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF5A1F]" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                            <input 
                                type="email" 
                                disabled
                                value={formData.email} 
                                className="w-full bg-gray-100 cursor-not-allowed border-none rounded-md px-4 py-2.5 text-sm" 
                            />
                        </div>

                        <div className="space-y-2 mb-8">
                            <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                            <input 
                                type="text" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+880 1XXX XXXXXX"
                                className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF5A1F]" 
                            />
                        </div>

                        <div className="flex justify-end">
                            <button 
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="bg-[#FF5A1F] text-white px-8 py-3 rounded-md font-bold text-sm uppercase hover:bg-[#e04d1a] disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;