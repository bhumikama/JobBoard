"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowBigLeftIcon, Loader, Lock, Mail } from "lucide-react";
import Link from "next/link";
import Input from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useLogin } from "@/app/hooks/useLogin";

const Login = () => {
  const loginMutate = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginMutate.mutateAsync(formData);
      console.log("Logged in successfully!");
    } catch (error) {
      console.error("Error during login process:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="hidden h-max  md:flex justify-between  ">
        <div className="md:flex bg-[url('/signup.jpg')] backdrop-opacity-20 bg-cover  w-1/3">
          <div className="flex justify-center items-center  h-10 m-10">
            <ArrowBigLeftIcon className="size-10 text-white" />
            <Link href="/" className="text-white">
              Go Back Home
            </Link>
          </div>
        </div>

        <div className="min-h-screen w-2/3 flex items-center justify-center relative overflow-hidden bg-white px-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-2 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden"
          >
            <div className="p-8">
              <h2 className="mb-6 text-3xl text-center font-semibold text-white">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit}>
                <Input
                  icon={Mail}
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  icon={Lock}
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="flex items-center mb-6">
                  <Link href="/" className="text-sm text-white hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <motion.button
                  className="w-full py-3 px-4 bg-gradient-to-r from-black to-gray-950 text-white font-bold rounded-lg shadow-lg hover:from-gray-900 hover:to-gray-600 focus:outline-none focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 mt-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin mx-auto " />
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
              <p className="text-white text-sm">
                Don't have a <span className="font-semibold">JobHunt</span>{" "}
                Account?{" "}
                <Link
                  href="/signup"
                  className="text-white hover:underline font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center lg:hidden md:hidden mt-4 ">
          <ArrowBigLeftIcon className="size-10 text-gray-500" />
          <Link href="/" className="text-gray-500">
            Go Back Home
          </Link>
        </div>
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden lg:hidden md:hidden bg-white px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-2 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden"
          >
            <div className="p-8">
              <h2 className="mb-6 text-3xl text-center font-semibold text-white">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit}>
                <Input
                  icon={Mail}
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  icon={Lock}
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="flex items-center mb-6">
                  <Link href="/" className="text-sm text-white hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <motion.button
                  className="w-full py-3 px-4 bg-gradient-to-r from-black to-gray-950 text-white font-bold rounded-lg shadow-lg hover:from-gray-900 hover:to-gray-600 focus:outline-none focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 mt-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin mx-auto " />
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
              <p className="text-white text-sm">
                Don't have a <span className="font-semibold">JobHunt</span>
                Account?
                <Link
                  href="/signup"
                  className="text-white hover:underline font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
