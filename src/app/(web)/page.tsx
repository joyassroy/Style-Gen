import Image from "next/image"
import ShopByCategories from "@/components/pages/shop-by-categories"
import FeaturedProducts from "@/components/pages/FeaturedProducts";
import BrandStorySection from "@/components/BrandStorySection";

export default function HomePage() {
  return (
    <main>
      {/* Hero Banner */}
      <div className="w-full relative h-[300px] md:h-[500px]">
        {/* আপনি চাইলে এখানে fill প্রপস ব্যবহার করতে পারেন রেসপন্সিভ ইমেজের জন্য */}
        <Image 
            src="/images/hero.jpg" 
            alt="StyleGen Hero Banner" 
            fill
            priority
            className="object-cover" 
        />
      </div>
      
      {/* Categories Section */}
      <ShopByCategories />
      
      {/* Featured Products (এখন ডাটাবেস থেকে আসবে) */}
      <FeaturedProducts />
      
      {/* Brand Story Section */}
      <BrandStorySection />
    </main>
  );
}