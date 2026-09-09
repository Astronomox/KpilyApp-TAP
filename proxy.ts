import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed middleware.ts -> proxy.ts and the exported
// function `middleware` -> `proxy`. This now runs on the Node.js
// runtime by default (it used to be Edge-only), which is why we can
// safely do things here that need Node APIs later if the auth layer
// grows (e.g. verifying a JWT with a Node crypto lib).

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/onboard",
  "/forgot-password",
  "/change-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.some((path) => path !== "/" && pathname.startsWith(path));
  const token = request.cookies.get("kpily_session")?.value;

  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users on auth-only pages (login, register, forgot-password)
  // get sent to dashboard. But the landing page "/" and onboard flow stay
  // accessible regardless of auth state.
  const isAuthOnlyPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/change-password");

  if (isAuthOnlyPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes that handle their own auth
     * - static files, images, favicon, and anything under /assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets/|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)",
  ],
};
