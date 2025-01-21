/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from "react";
import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";
import { Form, redirect, json, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { db } from "~/db.server";

// Define the type for the action data
type ActionData = {
  error: string;
} | undefined;

export async function action({ request }: { request: Request }): Promise<Response> {
    const formData = await request.formData();
    const name = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return json<ActionData>({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await db.users.findUnique({ where: { email } });
    if (existingUser) {
        return json<ActionData>({ error: "Email is already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.users.create({ data: { name, email, password: hashedPassword } });

    return redirect("/login");
}

export default function SignUp() {
    const actionData = useActionData<ActionData>();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

    const checkPasswordStrength = (value: string) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (strongRegex.test(value)) {
            setPasswordStrength("Strong ✅");
        } else if (value.length >= 8) {
            setPasswordStrength("Weak ⚠️");
        } else {
            setPasswordStrength("Too Short ❌");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg shadow-md ">
                <h2 className="text-2xl font-bold text-center text-red-600 mb-5">Sign Up</h2>
                <Form method="post">
                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                checkPasswordStrength(e.target.value);
                            }}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="absolute top-9 right-3"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                        <p className="text-sm mt-1 text-gray-500">{passwordStrength}</p>
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700">Confirm Password</label>
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            name="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (password !== e.target.value) {
                                    setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        confirmPassword: "Passwords do not match",
                                    }));
                                } else {
                                    setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        confirmPassword: "",
                                    }));
                                }
                            }}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder="Confirm your password"
                        />
                        <button
                            type="button"
                            className="absolute top-9 right-3"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        >
                            {confirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {actionData?.error && (
                        <p style={{ color: "red", marginBottom: "1rem" }}>{actionData.error}</p>
                    )}

                    {/* Submit Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                        >
                            Sign Up
                        </button>
                    </div>
                    <div>
                        <p className="mb-4 text-center text-gray-600">
                            Already have an account ?{" "}
                            <a href="/login" className="text-red-600 hover:underline">
                                Log In
                            </a>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    );
}
