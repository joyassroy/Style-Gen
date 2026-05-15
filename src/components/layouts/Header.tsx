"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { TbWorld } from "react-icons/tb";
import { LuUser } from "react-icons/lu";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image"; // ইমেজ দেখানোর জন্য

const Header = () => {
    const { data: session } = useSession();

    return (
        <section className="border-b border-gray-200 sticky top-0 z-50 bg-white">
            <header className="max-w-7xl mx-auto px-4 py-4 md:px-8">
                <nav className="flex items-center justify-between">
                    
                    {/* লেফট সাইড: লোগো এবং লিংক */}
                    <div className="flex items-center gap-12 lg:gap-16">
                        <Logo />
                        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 uppercase tracking-wide">
                            <li>
                                <Link href="/products" className="hover:text-[#FF5A1F] transition-colors"> 
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="hover:text-[#FF5A1F] transition-colors"> 
                                    Categories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* রাইট সাইড: আইকন এবং অথেন্টিকেশন */}
                    <div className="flex items-center gap-5 lg:gap-7 text-gray-700">
                        {/* সার্চ আইকন */}
                        <button className="hover:text-[#FF5A1F] transition-colors focus:outline-none">
                            <IoSearchOutline size={22} />
                        </button>

                        {/* কার্ট আইকন */}
                        <Link href="/cart" className="relative hover:text-[#FF5A1F] transition-colors">
                            <FiShoppingCart size={22} />
                            <span className="absolute -top-1.5 -right-2 bg-[#FF5A1F] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                3
                            </span>
                        </Link>

                        {/* ল্যাঙ্গুয়েজ আইকন */}
                        <button className="hover:text-[#FF5A1F] transition-colors focus:outline-none">
                            <TbWorld size={22} />
                        </button>

                        {/* লগিন/ইউজার প্রোফাইল সেকশন */}
                        <div className="flex items-center border-l border-gray-300 pl-5 ml-1">
                            {session?.user ? (
                                <div className="flex items-center gap-4">
                                    {/* ইউজার ড্যাশবোর্ড লিংক (লিংকটি সরাসরি প্রোফাইল সেটিংসে নিয়ে যাবে) */}
                                    <Link 
                                        href="/u/settings" 
                                        className="flex items-center gap-2 group"
                                    >
                                        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200 group-hover:border-[#FF5A1F] transition-all">
                                            <Image 
                                                src={session.user.image || "https://ui-avatars.com/api/?name=" + session.user.name} 
                                                alt="User Profile" 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="hidden lg:block text-sm font-semibold group-hover:text-[#FF5A1F] transition-colors">
                                            Dashboard
                                        </span>
                                    </Link>
                                    
                                    {/* লগআউট বাটন */}
                                    <button 
                                        onClick={() => signOut()}
                                        className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-tighter transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="flex items-center gap-2 text-sm font-medium hover:text-[#FF5A1F] transition-colors">
                                    <LuUser size={20} />
                                    <span className="hidden sm:block">Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        </section>
    );
};

export default Header;