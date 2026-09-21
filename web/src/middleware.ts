import { NextResponse, type NextRequest } from "next/server";

/**
 * Keep preview deployments (*.workers.dev) out of search results. Production
 * (skaylon.com) is unaffected. robots.txt can't do this: it's built once and
 * shared by every host.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.hostname.endsWith(".workers.dev")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|posters/|favicon|icon).*)"],
};
