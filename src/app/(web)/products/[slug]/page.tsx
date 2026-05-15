'use client'

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { LuShieldCheck } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { useSession } from "next-auth/react";

const ProductsDetailsPage = () => {
    const params = useParams();
    const slug = params.slug;

    // State Management
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    
    const { data: session } = useSession();
    const router = useRouter();
    const [actionLoading, setActionLoading] = useState(false);

    // MongoDB (API) থেকে ডেটা ফেচ করা
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${slug}`);
                const data = await res.json();
                
                if (res.ok && data) {
                    setProduct(data);
                    if (data.images && data.images.length > 0) {
                        setMainImage(data.images[0]);
                    }
                    if (data.sizes && data.sizes.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }
                } else {
                    setProduct(null);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const handleQuantity = (type: "inc" | "dec") => {
        if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
        if (type === "inc") setQuantity(quantity + 1);
    };

    // Add to Cart ফাংশন
    const handleAddToCart = async () => {
        if (!session?.user?.email) {
            alert("Please login first to add items to cart!");
            router.push("/login");
            return;
        }
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert("Please select a size first!");
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: session.user.email,
                    productId: product._id,
                    quantity,
                    size: selectedSize || "N/A"
                })
            });
            if (res.ok) alert("Successfully added to your cart! 🛒");
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        } finally {
            setActionLoading(false);
        }
    };

    // Buy Now ফাংশন
    const handleBuyNow = async () => {
        if (!session?.user?.email) {
            alert("Please login first to buy products!");
            router.push("/login");
            return;
        }
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert("Please select a size first!");
            return;
        }

        const currentPrice = product.discountPrice || product.price;
        const totalPrice = currentPrice * quantity;

        setActionLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: session.user.email,
                    items: [{ productId: product._id, quantity, size: selectedSize || "N/A" }],
                    totalPrice
                })
            });
            if (res.ok) {
                alert("Order Successful! 🎉 Thanks for shopping with StyleGen.");
                // অর্ডার সফল হলে সরাসরি প্রোডাক্টস পেজে রিডাইরেক্ট করবে
                router.push("/products"); 
            }
        } catch (error) {
            console.error(error);
            alert("Failed to place order.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col justify-center items-center gap-3">
                <div className="w-8 h-8 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-[60vh] flex flex-col justify-center items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
                <Link href="/products" className="px-6 py-2 bg-[#FF5A1F] text-white rounded-md">Go Back to Shop</Link>
            </div>
        );
    }

    const currentPrice = product.discountPrice || product.price;
    const oldPrice = product.discountPrice ? product.price : null;
    const saveAmount = oldPrice ? oldPrice - currentPrice : 0;

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="flex items-center text-sm text-gray-500 mb-8 gap-1 flex-wrap">
                <Link href="/" className="hover:text-[#FF5A1F]">Home</Link>
                <MdKeyboardArrowRight size={16} />
                <Link href="/products" className="hover:text-[#FF5A1F]">Products</Link>
                <MdKeyboardArrowRight size={16} />
                <span className="text-gray-900 font-medium">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
                        {product.images?.map((img: string, index: number) => (
                            <div 
                                key={index} 
                                onClick={() => setMainImage(img)}
                                className={`relative h-20 w-20 md:h-24 md:w-24 border-2 rounded-md cursor-pointer overflow-hidden flex-shrink-0 ${mainImage === img ? 'border-[#FF5A1F]' : 'border-transparent'}`}
                            >
                                <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                        {mainImage && <Image src={mainImage} alt={product.name} fill className="object-cover" />}
                        {saveAmount > 0 && (
                            <div className="absolute top-4 right-4 bg-[#FF5A1F] text-white text-sm font-semibold px-4 py-1.5 rounded-sm shadow-sm">
                                Save {saveAmount} BDT
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
                        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex items-end gap-3">
                        <span className="text-2xl font-bold text-[#FF5A1F]">{currentPrice.toLocaleString()} BDT</span>
                        {oldPrice && (
                            <span className="text-gray-400 line-through text-lg pb-0.5">{oldPrice.toLocaleString()} BDT</span>
                        )}
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-sm uppercase">Select Size</span>
                                <button className="text-[#FF5A1F] text-xs font-medium hover:underline">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {product.sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-2.5 border text-sm font-medium transition-colors ${
                                            selectedSize === size 
                                                ? 'border-[#FF5A1F] text-[#FF5A1F] bg-orange-50' 
                                                : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <span className="font-semibold text-sm block mb-3 uppercase">Quantity</span>
                        <div className="flex items-center border border-gray-300 w-fit rounded-sm">
                            <button onClick={() => handleQuantity("dec")} className="w-10 h-10 flex justify-center items-center text-gray-600 hover:bg-gray-100 transition-colors text-lg">-</button>
                            <input 
                                type="text" 
                                readOnly 
                                value={quantity} 
                                className="w-12 h-10 text-center font-medium text-gray-800 focus:outline-none border-x border-gray-300"
                            />
                            <button onClick={() => handleQuantity("inc")} className="w-10 h-10 flex justify-center items-center text-gray-600 hover:bg-gray-100 transition-colors text-lg">+</button>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button 
                            onClick={handleAddToCart}
                            disabled={actionLoading}
                            className="flex-1 py-3.5 border-2 border-[#FF5A1F] text-[#FF5A1F] font-semibold rounded-sm hover:bg-orange-50 transition-colors disabled:opacity-50"
                        >
                            {actionLoading ? "PROCESSING..." : "ADD TO CART"}
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            disabled={actionLoading}
                            className="flex-1 py-3.5 bg-[#FF5A1F] text-white font-semibold rounded-sm hover:bg-[#e04d1a] transition-colors shadow-md shadow-orange-200 disabled:opacity-50"
                        >
                            {actionLoading ? "PROCESSING..." : "BUY NOW"}
                        </button>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <LuShieldCheck size={20} className="text-[#FF5A1F]" />
                            <span>Lifetime Stitching Warranty</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <TbTruckDelivery size={20} className="text-[#FF5A1F]" />
                            <span>Free Express Delivery Nationwide</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <HiOutlineArrowPath size={20} className="text-[#FF5A1F]" />
                            <span>30-Day Hassle-Free Exchange</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-24 mb-10 border-t border-gray-100 pt-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                    <Link href="/products" className="text-[#FF5A1F] text-sm font-semibold hover:underline flex items-center gap-1">
                        View Collection <MdKeyboardArrowRight size={18} />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="group cursor-pointer">
                            <div className="relative aspect-[4/5] bg-gray-100 mb-4 rounded-sm overflow-hidden">
                                <Image src={`https://images.unsplash.com/photo-1627163439134-7a8c47e08208?q=80&w=400&auto=format&fit=crop`} alt="Related Product" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">Premium Leather Accessories</h3>
                            <p className="text-[#FF5A1F] font-bold text-sm mb-3">1,850 BDT</p>
                            <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="border border-[#FF5A1F] text-[#FF5A1F] text-[10px] font-semibold py-2 rounded-sm hover:bg-orange-50">ADD TO CART</button>
                                <button className="bg-[#FF5A1F] text-white text-[10px] font-semibold py-2 rounded-sm hover:bg-[#e04d1a]">BUY NOW</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductsDetailsPage;