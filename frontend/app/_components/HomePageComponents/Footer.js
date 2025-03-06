import React from "react";
import {
  FaTwitter,
  FaFacebook,
  FaRSS,
  FaInstagram,
  FaRss,
} from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black border border-t-2">
      <div className="bg-white flex flex-col lg:flex-row gap-3 justify-between items-center py-5 px-10">
        <div className="hidden lg:flex gap-5">
          <a href="#">
            <FaTwitter className="size-7" />
          </a>
          <a href="#">
            <FaFacebook className="size-7" />
          </a>
          <a href="#">
            <FaRss className="size-7" />
          </a>
          <a href="#">
            <FaInstagram className="size-7" />
          </a>
        </div>
        <p className="text-black font-medium text-sm text-center">
          &copy; COPYRIGHT JobHunt 2025 - Terms & Conditions | Privacy Policy
        </p>

        <div className="hidden lg:flex">
          <Image
            src="/job-search-logo-vector.jpg"
            alt="Logo of the company"
            height={40}
            width={110}
          />
        </div>
      </div>
    </footer>
  );
};
export default Footer;
