/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form } from "@remix-run/react";
import { db } from "~/db.server";


import { useState } from "react";
import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex h-screen items-center justify-center">
            <div className="p-8 rounded-lg shadow-md">
                <div >
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

                {/* Login Button */}
                <button 
                    type="submit" 
                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                >
                    Login
                </button>
                </Form>

                {/* Signup Link */}
                <p className="mt-4 text-center text-gray-600">
                Don&apos;t have an account? <a href="/signup" className="text-red-600 hover:underline">Sign Up</a>
                </p>
            </div>
    </div>
  );
}


