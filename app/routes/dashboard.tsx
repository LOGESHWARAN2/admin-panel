import { redirect } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { getSession, commitSession } from "~/session.server";

export async function loader({ request }: { request: Request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const userEmail = session.get("user");

    if (!userEmail) {
        return redirect("/");
    }

    return new Response(
        JSON.stringify({ userEmail }),
        {
            headers: {
                "Set-Cookie": await commitSession(session),
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            }
        }
    );
}

export default function Dashboard() {
    const { userEmail } = useLoaderData<typeof loader>();
    const submit = useSubmit();

    const handleLogout = () => {
        submit(null, { method: "post", action: "/logout" });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-red-600 mb-5">Welcome {userEmail}</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-200 rounded-md text-center">
                        <Link to="/pricing-plans" className="block w-full h-full p-4">
                            <h3 className="text-lg font-semibold">Pricing Plans</h3>
                            <p className="text-sm text-gray-600">View your pricing plans</p>
                        </Link>
                    </div>
                    <div className="p-4 bg-gray-200 rounded-md text-center">
                        <Link to="/page-content" className="block w-full h-full p-4">
                            <h3 className="text-lg font-semibold">Page Content</h3>
                            <p className="text-sm text-gray-600">Customize your Page Content</p>
                        </Link>
                    </div>
                    <div className="p-4 bg-gray-200 rounded-md text-center">
                        <h3 className="text-lg font-semibold">Orders</h3>
                        <p className="text-sm text-gray-600">View your order history</p>
                    </div>
                    <div className="p-4 bg-gray-200 rounded-md text-center">
                        <h3 className="text-lg font-semibold">Support</h3>
                        <p className="text-sm text-gray-600">Contact our support team</p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}