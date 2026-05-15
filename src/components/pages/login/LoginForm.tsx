'use client'

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); 
        setLoading(true);

        try {
            // ১. ক্রেডেনশিয়াল দিয়ে সাইন ইন করা
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false, // আমরা ম্যানুয়ালি রিডাইরেক্ট করব
            });

            if (res?.error) {
                setError("ইমেইল বা পাসওয়ার্ড ভুল ভাই! আবার ট্রাই করেন।"); 
            } else {
                // ২. লগইন সফল হলে সেশন থেকে রোল চেক করা
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();

                // ৩. রোল অনুযায়ী রিডাইরেক্ট করা
                if (session?.user?.role === 'admin') {
                    router.push("/admin/dashboard"); 
                } else {
                    router.push("/u/dashboard"); 
                }
                
                router.refresh(); 
            }
        } catch (error) {
            setError("সার্ভারে ঝামেলা হচ্ছে। একটু পর আবার চেষ্টা করুন।");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/u/dashboard" });
    };

    return (
        <section className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F9FAFB]">
            <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 px-4">
                <div className="flex justify-center">
                    <Logo />
                </div>
                
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-sm text-gray-500">আপনার একাউন্টে লগইন করে কাজ শুরু করুন</p>
                </div>

                <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 rounded-xl sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-500 p-3 text-xs font-bold text-center rounded-md border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                            <div className="flex items-center gap-2 border border-gray-200 py-2.5 px-4 rounded-lg focus-within:border-[#FF5A1F] focus-within:ring-1 focus-within:ring-[#FF5A1F] transition-all bg-gray-50/50">
                                <MdOutlineEmail size={20} className="text-gray-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="focus:outline-none w-full bg-transparent text-sm text-gray-700" 
                                    placeholder="name@company.com" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                            <div className="flex items-center gap-2 border border-gray-200 py-2.5 px-4 rounded-lg justify-between focus-within:border-[#FF5A1F] focus-within:ring-1 focus-within:ring-[#FF5A1F] transition-all bg-gray-50/50">
                                <div className="flex items-center gap-2 w-full">
                                    <RiLockPasswordLine size={20} className="text-gray-400" />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="focus:outline-none w-full bg-transparent text-sm text-gray-700" 
                                        placeholder="••••••••" 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleShowPassword}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="remember" className="h-4 w-4 accent-[#FF5A1F] rounded border-gray-300" />
                                <label htmlFor="remember" className="text-xs text-gray-500 font-medium">Remember Me</label>
                            </div>
                            <Link href="/forgot-password" className="text-xs font-bold text-[#FF5A1F] hover:underline">Forgot Password?</Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-3 bg-[#FF5A1F] text-white rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-md shadow-orange-100 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#e04d1a] active:scale-[0.98]'}`}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Checking...
                                </div>
                            ) : "Secure Login"}
                        </button>
                    </form>

                    <div className="relative flex items-center py-6">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase">Or continue with</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    <button 
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold text-gray-700"
                    >
                        <FcGoogle size={22} />
                        Google Account
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500">
                    New to StyleGen? <Link href="/register" className="text-[#FF5A1F] font-bold hover:underline">Create an Account</Link>
                </p>
            </div>
        </section>
    );
};

export default LoginForm;