import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // যদি ইউজার এডমিন পেজে যেতে চায় কিন্তু সে এডমিন না হয়
    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // লগইন করা থাকলেই শুধু চেক করবে
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/u/:path*"], // এই এই পাথগুলো প্রোটেক্টেড থাকবে
};