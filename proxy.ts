import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect API routes
const isProtectedRoute = createRouteMatcher(["/api/social-media/post(.*)"]);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Only run the proxy where Clerk's server-side auth() is actually used.
  //
  // Every proxy run is a function invocation on Vercel. A catch-all matcher
  // made every page view, 404 and bot probe (/.aws/config, /wp-*, ...) execute
  // a function before the CDN could serve the prerendered HTML. Content pages
  // are fully static and Clerk's client components (Navbar SignedIn/UserButton)
  // work without the proxy, so it is scoped to the auth-dependent routes only.
  //
  // If you add a route that calls auth()/currentUser() on the server, add it here.
  matcher: ["/social-media/:path*", "/login/:path*", "/api/social-media/:path*"],
};
