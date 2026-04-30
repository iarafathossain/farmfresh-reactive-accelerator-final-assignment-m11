import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import BreadCrumb from "@/components/ui/BreadCrumb";
import { connectDB } from "@/libs/connectDB";
import CartProvider from "@/providers/CartProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Local Farmer Booking - Fresh Produce Direct from Farmers",
  description:
    "Connect directly with local farmers and get the freshest produce delivered to your doorstep",
};

export default async function RootLayout({
  children,
  authInterceptedModel,
}: Readonly<{
  children: React.ReactNode;
  authInterceptedModel: React.ReactNode;
}>) {
  await connectDB();
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <CartProvider>
              <NavbarWrapper />
              {authInterceptedModel}
              <BreadCrumb />
              {children}
              <ToastProvider />
              <Footer />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
