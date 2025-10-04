// NextAuth handle all protected route checks automatically
// The middleware.ts uses NextAuth's built-in auth middleware as a global guard. 
// The matcher tells it which pages & APIs should only be accessible if the user is logged in. Anyone not logged in is redirected to /login.
export {default} from "next-auth/middleware";

export const config = {
    // matcher defines which routes this middleware applies to
    matcher: ["/", "/analytics", "/api/expenses/:path*"],  // protect these routes
}