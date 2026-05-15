import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
        const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");
        
        // If it's an auth page or api auth, we don't require a token here (handled in middleware function above)
        if (isAuthPage || isApiAuth) return true;
        
        // Require token for all other routes (specifically /(main))
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/progress/:path*",
    "/settings/:path*",
    "/stage/:path*",
    "/lesson/:path*",
    "/login",
    "/register",
  ],
};
