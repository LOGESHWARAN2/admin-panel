import { createCookieSessionStorage, Session } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",             // Name of the cookie
        httpOnly: true,                // Prevent JavaScript access (security feature)
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "lax",               // Prevents CSRF attacks while allowing navigation
        path: "/",                      // Available to all routes
        maxAge: 60 * 60 * 24,          // Cookie expires in 1 day (60 sec × 60 min × 24 hrs)
    },
});

// Helper functions
export async function getSession(cookieHeader: string | null) {
    return sessionStorage.getSession(cookieHeader);
}

export async function commitSession(session: Session) {
    return sessionStorage.commitSession(session);
}

export async function destroySession(session: Session) {
    return sessionStorage.destroySession(session);
}