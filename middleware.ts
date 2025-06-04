import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(["/sign-in","/sign-up","/","/home"]);
const isPublicAPIRoute = createRouteMatcher(["/api/video"]);

export default clerkMiddleware(async (auth,req) =>{
    const {userId} = await auth();
    const currUrl = new URL(req.url);
    const isAccessingDashboard = (currUrl.pathname === "/home");
    const isApiReq = (currUrl.pathname.startsWith("/api"));

    if(userId && isPublicRoute(req) && !isAccessingDashboard)
    {
        return NextResponse.redirect(new URL("/home",req.url));
    }

    if(!userId)
    {
        if(!isPublicRoute(req) && !isPublicAPIRoute(req))
        {
            return NextResponse.redirect(new URL("/sign-in",req.url));
        }
        if(isApiReq && !isPublicAPIRoute(req))
        {
            return NextResponse.redirect(new URL("/sign-in",req.url));
        }
    }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}