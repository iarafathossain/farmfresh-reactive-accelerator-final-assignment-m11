"use client";

import BreadCrumb from "@/components/ui/BreadCrumb";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import CartProvider from "./CartProvider";
import { ToastProvider } from "./ToastProvider";

type Props = {
  children: React.ReactNode;
};

export default function ClientProviders({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <CartProvider>
          <BreadCrumb />
          {children}
          <ToastProvider />
        </CartProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
