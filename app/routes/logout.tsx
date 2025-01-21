import { ActionFunction, redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
        },
    });
};

// We also handle GET requests to /logout the same way
export const loader = action;