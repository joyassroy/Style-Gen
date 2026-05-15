import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // যদি এডমিন না হয়ে এডমিন পেজে ঢোকার চেষ্টা করে
    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // শুধু লগইন করা ইউজারদের জন্য
    },
  }
);

// এটি খুব গুরুত্বপূর্ণ! 
export const config = {
  matcher: [
    "/admin/:path*", 
    "/u/:path*",
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|$).*)',
    // এখানে ভুলেও "/login" বা "/" দিবেন না
  ],
};