/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // আগের আনস্প্ল্যাশ ডোমেইনটিও এখানে রাখুন
      },
      // যদি অন্য কোনো ডোমেইন থাকে সেগুলোও এখানে অ্যাড করুন
    ],
  },
};

export default nextConfig;