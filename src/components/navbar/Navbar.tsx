"use client";

import type { IUserSession } from "@/types";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import Logo from "../common/Logo";
import SearchByTerm from "../products/filter/SearchByTerm";
import CartBadge from "./CartBadge";
import NavItem from "./NavItem";
import ThemeToggler from "./ThemeToggler";
import UserMenu from "./UserMenu";

interface NavbarProps {
  user: IUserSession | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openMobileMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setMobileMenuMounted(true);
    requestAnimationFrame(() => {
      setMobileMenuOpen(true);
    });
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      closeTimerRef.current = setTimeout(() => {
        setMobileMenuMounted(false);
      }, 300);
      return;
    }

    openMobileMenu();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setMobileMenuMounted(false);
    }, 300);
  };

  return (
    <nav
      className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50"
      id="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div onClick={closeMobileMenu} className="cursor-pointer">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 whitespace-nowrap">
            <NavItem link="/" label="Home" />
            {user ? (
              <>
                {user.role === "Farmer" && (
                  <>
                    <NavItem link="/add-product" label="Add Product" />
                    <NavItem link="/manage-products" label="Manage Products" />
                  </>
                )}

                {user.role !== "Farmer" && (
                  <>
                    <NavItem link="/products" label="Products" />
                    <NavItem link="/farmers" label="Farmers" />
                    <NavItem link="/my-orders" label="My Orders" />
                  </>
                )}
              </>
            ) : (
              <>
                <NavItem link="/products" label="Products" />
                <NavItem link="/farmers" label="Farmers" />
              </>
            )}
            <NavItem link="/about" label="About" />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block">
              <SearchByTerm />
            </div>

            {!user || (user?.role?.toLowerCase() !== "farmer" && <CartBadge />)}
            <UserMenu user={user} />

            <ThemeToggler />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuMounted && (
          <div
            className={`lg:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
              mobileMenuOpen
                ? "max-h-[32rem] pb-4 opacity-100 translate-y-0"
                : "max-h-0 pb-0 opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="flex flex-col space-y-2 pt-3">
              {/* Mobile Search */}
              <div className="px-2 py-2 w-full">
                <SearchByTerm width="w-full" />
              </div>

              {/* Mobile Navigation Items */}
              <div
                onClick={closeMobileMenu}
                className="flex flex-col space-y-1 pl-2"
              >
                <NavItem link="/" label="Home" />
                {user ? (
                  <>
                    {user.role === "Farmer" && (
                      <>
                        <NavItem link="/add-product" label="Add Product" />
                        <NavItem
                          link="/manage-products"
                          label="Manage Products"
                        />
                      </>
                    )}

                    {user.role !== "Farmer" && (
                      <>
                        <NavItem link="/products" label="Products" />
                        <NavItem link="/farmers" label="Farmers" />
                        <NavItem link="/my-orders" label="My Orders" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <NavItem link="/products" label="Products" />
                    <NavItem link="/farmers" label="Farmers" />
                  </>
                )}
                <NavItem link="/about" label="About" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
