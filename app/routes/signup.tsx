/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from "react";
import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";

export default function SignUp() {
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

    const validatePassword = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};
    
        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])/.test(password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(password)) {
            newErrors.password = "Password must contain at least one special character (@$!%*?&)";
        }
    
        if (confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
    
        // Ensure both properties exist in the object
        setErrors({
            password: newErrors.password || "", 
            confirmPassword: newErrors.confirmPassword || "",
        });
    };
    
    

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg shadow-md ">
                <h2 className="text-2xl font-bold text-center text-red-600 mb-5">Sign Up</h2>
                <form onSubmit={(e) => { e.preventDefault(); validatePassword(); }}>
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
                                    setErrors(prevErrors => ({ ...prevErrors, confirmPassword: "Passwords do not match" }));
                                } else {
                                    setErrors(prevErrors => ({ ...prevErrors, confirmPassword: "" }));
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
                        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>

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
                            Already have an account ? <a href="/login" className="text-red-600 hover:underline">Log In</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
