"use client";

import type { IUserSession } from "@/types";
import Link from "next/link";
import Dropdown from "../ui/Dropdown";

interface UserMenuProps {
  user: IUserSession | null;
}

const UserMenu = ({ user }: UserMenuProps) => {
  return (
    <div className="relative">
      {user ? (
        <Dropdown image={user.image ?? ""} name={user.name!} />
      ) : (
        <Link
          href="/login"
          className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-600"
        >
          Sign In
        </Link>
      )}
    </div>
  );
};

export default UserMenu;
