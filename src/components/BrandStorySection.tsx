import Image from "next/image";
import Link from "next/link";
import { MdGppGood } from "react-icons/md"; // 'react-icons/md' থেকে একটি ক্লোজ আইকন

const BrandStorySection = () => {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                {/* গ্রিড লেআউট */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
                    
                    {/* বামপাশের বড় বক্স - কারিগরী */}
                    <div className="relative overflow-hidden group aspect-[3/2] md:aspect-auto">
                        {/* ⚠️ নোট: '/images/craftsman.jpg' পাথে আপনার আসল ছবিটি থাকতে হবে */}
                        <Image 
    src="https://images.unsplash.com/photo-1589758438368-0c5e424269e3?q=80&w=1000&auto=format&fit=crop" 
    alt="Craftsman working with leather" 
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105"
/>
                        {/* টেক্সট ওভারলে - কর্নারে */}
                        <div className="absolute bottom-6 left-6 text-white max-w-sm space-y-1">
                            <p className="text-xs font-medium text-white/90">Our Craftsmanship</p>
                            <p className="text-[11px] leading-relaxed text-white">
                                Every piece is hand-stitched by master artisans with over 20 years of experience in traditional leatherwork.
                            </p>
                            {/* বাটন */}
                            <Link href="/about/craftsmanship" className="inline-block bg-white text-black font-semibold text-[10px] px-5 py-2 mt-3 rounded-sm hover:bg-gray-100 transition-colors">
                                LEARN MORE
                            </Link>
                        </div>
                    </div>

                    {/* ডানপাশের ছোট দুটি বক্স */}
                    <div className="flex flex-col gap-6">
                        
                        {/* উপরে ছোট বক্স - ইথিক্যাল সোর্সিং (টপ-রাইট) */}
                        <div className="relative overflow-hidden flex items-center justify-center p-6 text-center text-white aspect-[3/1]">
                            {/* ⚠️ নোট: '/images/leather-texture.jpg' পাথে আপনার আসল টেক্সচার ছবিটি থাকতে হবে */}
                            <Image 
                                src="/images/leather-texture.jpg" // এখানে আপনার আসল ছবির পাথ দিন
                                alt="Dark brown leather texture" 
                                fill
                                className="object-cover"
                            />
                            {/* ওভারলে (ছবির উপর টেক্সট ভালো দেখানোর জন্য) */}
                            <div className="absolute inset-0 bg-black/40" />
                            {/* টেক্সট */}
                            <p className="relative text-sm font-semibold z-10">Ethical Sourcing</p>
                        </div>

                        {/* নিচে ছোট বক্স - ওয়ারেন্টি (বটম-রাইট) */}
                        {/* SRS এর অরেঞ্জ কালার (#FF5A1F) ব্যবহার করা হয়েছে */}
                        <div className="bg-[#FF5A1F] flex flex-col items-center justify-center text-center p-8 gap-4 text-white aspect-[3/2] rounded-sm">
                            {/* আইকন */}
                            <MdGppGood size={32} />
                            {/* টেক্সট */}
                            <p className="text-sm font-semibold">Lifetime Warranty</p>
                            <p className="text-xs max-w-xs leading-relaxed">
                                We stand by the quality of our products for a lifetime of use.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStorySection;