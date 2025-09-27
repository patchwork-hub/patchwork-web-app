import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest): NextResponse {
  const cookie = req.cookies.get("token");
  const authToken = cookie?.value;

  const isSignup = req.cookies.get("isSignup")?.value === "true";
  const { pathname } = req.nextUrl;
  const isSplashPath = pathname === "/";
  const isHomePath = pathname === "/home";

  const isAuthPath = pathname.startsWith("/auth/");
  const isChannelsPath = pathname.startsWith("/channels");
  const isNewsmastPath = pathname.startsWith("/newsmast");
  const isCommunitiesPath = pathname.startsWith("/communities");
  const isCommunityPath = pathname.startsWith("/community");
  const isNewsmastChannelPath = pathname.startsWith("/newsmast-channel");
  const isSearchPath = pathname.startsWith("/search/explore");
  const isAccountPath = pathname.match(/^\/@[^\/]+$/);

  const isPublicPath =
    isSplashPath ||
    isHomePath ||
    isChannelsPath ||
    isNewsmastPath ||
    isCommunitiesPath ||
    isCommunityPath ||
    isNewsmastChannelPath ||
    isSearchPath ||
    isAccountPath;

  if (authToken && isAuthPath && !isSignup) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!authToken && !isAuthPath) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
