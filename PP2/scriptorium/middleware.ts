import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// try debugging with authtoken header bearer thing
export function middleware(request: NextRequest) {
  console.log("Cookies received in middleware:", request.cookies);
  // Get the token from authorization header
  const token = request.cookies.get("accessToken");
  // const token = request.headers.get("authorization");
  console.log("Middleware: token from cookie =", token);

  // If accessing protected pages without a token
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("token for middleware auth: ", token);
    console.log("Unauthorized access to dashboard, redirecting...");

    // alert("You must be logged in to access this page."); this is wrong, but i do want to add an alert later

    return NextResponse.redirect(new URL("/login-page", request.url));
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

  console.log("getting next page in middleware: ", request);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
