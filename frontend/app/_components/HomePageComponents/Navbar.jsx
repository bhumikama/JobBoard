"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="w-full bg-white shadow-md border-b">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" passHref>
          <Image
            src="/job-search-logo-vector.jpg"
            alt="Logo"
            width={130}
            height={40}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about-us" className="hover:text-blue-600 transition">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/jobs" className="hover:text-blue-600 transition">
              Jobs
            </Link>
          </li>
          <li>
            <Link
              href="/signup?role=recruiter"
              className="hover:text-blue-600 transition"
            >
              Post a Job
            </Link>
          </li>
        </ul>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/signup">
            <button className="bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600 transition">
              Sign Up
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition">
              Log In
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden flex items-center cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <X size={28} className="text-black" />
          ) : (
            <Menu size={28} className="text-black" />
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white z-30 flex flex-col items-center space-y-6 pt-16 shadow-lg transform transition-transform ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 text-gray-700 text-xl focus:outline-none"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Mobile Menu Links */}
        <Link
          href="/"
          onClick={closeMenu}
          className="text-gray-700 text-lg hover:text-blue-500"
        >
          Home
        </Link>
        <Link
          href="/about-us"
          onClick={closeMenu}
          className="text-gray-700 text-lg hover:text-blue-500"
        >
          About Us
        </Link>
        <Link
          href="/jobs"
          onClick={closeMenu}
          className="text-gray-700 text-lg hover:text-blue-500"
        >
          Jobs
        </Link>
        <Link
          href="/signup?role=recruiter"
          onClick={closeMenu}
          className="text-gray-700 text-lg hover:text-blue-500"
        >
          Become a Recruiter
        </Link>

        {/* Mobile Auth Buttons */}
        <Link href="/signup" onClick={closeMenu}>
          <button className="w-48 bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition">
            Sign Up
          </button>
        </Link>
        <Link href="/login" onClick={closeMenu}>
          <button className="w-48 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
            Log In
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
