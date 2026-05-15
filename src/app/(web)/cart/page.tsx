'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";

const CartPage = () => {
    const { data: session } = useSession();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchCart = async () => {
        if (!session?.user?.email) return;
        try {
            const res = await fetch(`/api/cart?email=${session.user.email}`);
            const data = await res.json();
            setCartItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [session]);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.productId.discountPrice || item.productId.price) * item.quantity, 0);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return alert("Your cart is empty!");

        try {
            // ১. অর্ডার তৈরি করা
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: session?.user?.email,
                    items: cartItems.map(item => ({
                        productId: item.productId._id,
                        quantity: item.quantity,
                        size: item.size
                    })),
                    totalPrice
                })
            });

            if (orderRes.ok) {
                // ২. কার্ট ক্লিয়ার করা
                await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: session?.user?.email })
                });

                alert("All orders placed successfully! 🎉");
                router.push("/products");
            }
        } catch (error) {
            alert("Checkout failed!");
        }
    };

    if (loading) return <div className="text-center py-20">Loading Cart...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-8">Your Shopping Cart ({cartItems.length})</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">Your cart is empty.</p>
                    <Link href="/products" className="text-[#FF5A1F] font-semibold underline">Go Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                            <div className="relative h-20 w-20 flex-shrink-0">
                                <Image src={item.productId.images[0]} alt="img" fill className="object-cover rounded-md" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{item.productId.name}</h3>
                                <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-[#FF5A1F]">
                                BDT {(item.productId.discountPrice || item.productId.price) * item.quantity}
                            </p>
                        </div>
                    ))}

                    <div className="mt-10 p-6 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-xl font-bold mb-6">
                            <span>Total Amount:</span>
                            <span>BDT {totalPrice.toLocaleString()}</span>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-[#FF5A1F] text-white py-4 font-bold rounded-md hover:bg-[#e04d1a] transition-all"
                        >
                            PROCEED TO CHECKOUT (BUY ALL)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;