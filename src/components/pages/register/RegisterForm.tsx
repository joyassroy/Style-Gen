'use client'
import Link from "next/link";
import Logo from "@/components/ui/Logo"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Registration Successful! Please login.");
                router.push("/login"); // রেজিস্ট্রেশন শেষে লগইন পেজে পাঠাবে
            } else {
                const data = await res.json();
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to register. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-w-sm space-y-4">
            <div className="flex justify-center">
                <Logo />
            </div>
            <h1 className="text-center text-xl font-bold">Create an Account</h1>
            <p className="text-center text-gray-500 text-sm">Enter your credentials to access your portal</p>
            
            {error && <p className="text-red-500 text-center text-sm bg-red-50 py-2">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="text-sm font-medium">Name</label>
                    <div className="flex items-center gap-2 border border-gray-200 py-2 px-3 rounded-md focus-within:border-[#FF5A1F] transition-all">
                        <FaRegUser size={18} className="text-gray-400" />
                        <input 
                            required
                            type="text" 
                            className="focus:outline-none w-full text-sm" 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="flex items-center gap-2 border border-gray-200 py-2 px-3 rounded-md focus-within:border-[#FF5A1F] transition-all">
                        <MdOutlineEmail size={18} className="text-gray-400" />
                        <input 
                            required
                            type="email" 
                            className="focus:outline-none w-full text-sm" 
                            placeholder="name@company.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">Password</label>
                    <div className="flex items-center gap-2 border border-gray-200 py-2 px-3 rounded-md justify-between focus-within:border-[#FF5A1F] transition-all">
                        <div className="flex items-center gap-2 w-full">
                            <RiLockPasswordLine size={18} className="text-gray-400" />
                            <input 
                                required
                                type={showPassword ? "text" : "password"} 
                                className="focus:outline-none w-full text-sm" 
                                placeholder="***********" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        {showPassword ? (
                            <IoEyeOutline size={18} className="cursor-pointer text-gray-400" onClick={handleShowPassword} />
                        ) : (
                            <IoEyeOffOutline size={18} className="cursor-pointer text-gray-400" onClick={handleShowPassword} />
                        )}
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    style="w-full cursor-pointer py-2.5 bg-[#FF5A1F] hover:bg-[#e04d1a] transition-all"
                >
                    {loading ? "Registering..." : "Register"}
                </Button>
            </form>

            <p className="text-center text-sm">
                Already have an account? <Link href="/login" className="text-[#FF5A1F] font-semibold underline">Login</Link>
            </p>
        </section>
    )
}

export default RegisterForm;