/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, useActionData } from "@remix-run/react";import { db } from "~/db.server";
import { useState } from "react";
import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/session.server";

type ActionData = {
    error?: string;
} | undefined;

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const userEmail = session.get("user");

    // If user is already logged in, redirect to dashboard
    if (userEmail) {
        return redirect("/dashboard");
    }

    return null;
};

export const action: ActionFunction = async ({ request }): Promise<ActionData | Response> => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const user = await db.users.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: "Invalid credentials." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { error: "Password Invalid." };
    }

    // Get the session and store the user information
    const session = await getSession(request.headers.get("Cookie"));
    session.set("user", email);

    // Redirect to dashboard with the session cookie
    return redirect("/dashboard", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const actionData = useActionData<typeof action>();
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-2xl font-bold text-center text-red-600">Welcome back</h2>
                    <p className="mb-2">Welcome back! Please enter your details.</p>
                </div>
                <Form method="post" className="mt-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input 
                        type="email" 
                        name="email"
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter your email"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-700">Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 pr-10"
                            placeholder="Enter your password"
                        />
                    
                        {/* Toggle Password Visibility Button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-10 right-2 flex items-center text-gray-600"
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
                    {/* Login Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                    >
                        Login
                    </button>
                </Form>
                <p className="mt-4 text-center text-gray-600">
                    Don&apos;t have an account? <a href="/signup" className="text-red-600 hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
