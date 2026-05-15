import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Header from "@/components/layouts/Header"; // আপনার Header কম্পোনেন্টের সঠিক পাথ

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StyleGen | Premium Leather Goods",
  description: "A premium leather product eCommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* AuthProvider দিয়ে পুরো অ্যাপ র‍্যাপ করা হলো */}
        <AuthProvider>
          
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}