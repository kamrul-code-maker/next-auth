// src/middleware.ts 

// export { auth as middleware } from "@/auth"


import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRotue = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    if (isApiAuthRoute) {
        return null
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return null
    }
    if (!isLoggedIn && !isPublicRotue) {
        return Response.redirect(new URL("/login", nextUrl))
        // const url = new URL("/login", req.nextUrl);
        // return Response.redirect(url);
    }
    return null

})

// optinally, don;t invoke midde or some paths 
export const config = {
    // mathcer:[|"/auth/login", "/auth/register"]
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
} 