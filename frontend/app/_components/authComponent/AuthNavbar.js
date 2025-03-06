"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProfileDropdownMenu from "../HomePageComponents/ProfileAvatar";
import { Menu, X } from "lucide-react";

const AuthNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/job-search-logo-vector.jpg"
            alt="Logo"
            width={110}
            height={40}
            priority={false}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-sm lg:text-base">
          <li>
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/jobs"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Jobs
            </Link>
          </li>
          <li>
            <Link
              href="/my-applications"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              My Applications
            </Link>
          </li>
        </ul>

        {/* Profile & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <ProfileDropdownMenu />

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? (
              <X className="w-7 h-7 text-gray-700" />
            ) : (
              <Menu className="w-7 h-7 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-y-0 right-0 w-2/3 max-w-sm bg-white shadow-lg z-30 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={closeMenu} className="text-gray-700">
            <X className="w-7 h-7" />
          </button>
        </div>

        <ul className="flex flex-col items-center space-y-6 text-base">
          <li>
            <Link
              href="/"
              onClick={closeMenu}
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/jobs"
              onClick={closeMenu}
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              Jobs
            </Link>
          </li>
          <li>
            <Link
              href="/my-applications"
              onClick={closeMenu}
              className="text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              My Applications
            </Link>
          </li>
        </ul>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={closeMenu}
        ></div>
      )}
    </nav>
  );
};

export default AuthNavbar;
