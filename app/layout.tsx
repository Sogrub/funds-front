"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient()

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
}) => {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
          {children}
        </body>
      </QueryClientProvider>
    </html>
  );
}

export default RootLayout;