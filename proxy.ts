import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed middleware.ts -> proxy.ts and the exported
// function `middleware` -> `proxy`. This now runs on the Node.js
// runtime by default (it used to be Edge-only), which is why we can
// safely do things here that need Node APIs later if the auth layer
// grows (e.g. verifying a JWT with a Node crypto lib).

const PUBLIC_PATHS = ["/login", "/verify", "/onboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const token = request.cookies.get("kpily_session")?.value;

  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && token && pathname !== "/onboard") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes that handle their own auth
     * - static files, images, favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
