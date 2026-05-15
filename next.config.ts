/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // গুগল প্রোফাইল ইমেজের জন্য
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // ডিফল্ট অবতারের জন্য
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // যদি আনস্প্ল্যাশ ইমেজ ব্যবহার করেন
      },
    ],
  },
};

module.exports = nextConfig;