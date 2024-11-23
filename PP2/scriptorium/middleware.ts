import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// for pushing test
export function middleware(request: NextRequest) {
  // Get the token from authorization header
  const token = request.headers.get("authorization")?.split(" ")[1];

  // If accessing protected pages without a token
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // testing testing
  // For protected API routes
  if (!token && request.nextUrl.pathname.startsWith("/api/protected")) {
    return new NextResponse(
      JSON.stringify({ message: "Authentication required" }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
