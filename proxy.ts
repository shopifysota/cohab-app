import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Origin check for API POST requests
  if (request.method === "POST" && request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.endsWith(host)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}
