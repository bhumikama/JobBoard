"use client";
import { useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLogOut } from "@/app/hooks/useLogOut";

const ProfileDropdownMenu = () => {
  const { user } = useSelector((state) => state.auth);

  const { mutate: logOutUser, isLoading, error } = useLogOut();

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = () => {
    logOutUser();
    setIsOpen(false);
  };

  const userName = user && user.name ? user.name : "Guest";

  return (
    <Menu as="div" className="relative ml-3 flex justify-end">
      <div>
        <MenuButton
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-sm text-white">
            <Avatar>{userName ? userName.charAt(0).toUpperCase() : "U"}</Avatar>
          </div>
        </MenuButton>

        {isOpen && (
          <MenuItems className="absolute right-2 z-10 top-14 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
            <MenuItem>
              <Link href="#" className="block px-4 py-2 text-sm text-gray-700">
                Settings
              </Link>
            </MenuItem>
            <MenuItem>
              <button
                onClick={handleLogOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700"
              >
                Sign out
              </button>
            </MenuItem>
          </MenuItems>
        )}
      </div>
    </Menu>
  );
};

export default ProfileDropdownMenu;
