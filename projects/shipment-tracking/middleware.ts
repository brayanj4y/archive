import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Only protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // For now, we'll use a simple token-based auth check
    // since we're using localStorage-based authentication
    const authHeader = req.headers.get("authorization")
    const adminToken = req.cookies.get("admin_token")?.value

    // If no token found, redirect to admin login
    if (!adminToken && !authHeader) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = "/admin"
      loginUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}

// Only run middleware on admin routes (excluding the main admin login page)
export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/settings/:path*"],
}
