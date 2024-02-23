"use client";
import {Inter} from "next/font/google";
import "@shopify/polaris/build/esm/styles.css";
import "./globals.css";
import AppProviderWrapper from "@/utils/AppProvider";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProviderWrapper>
        <body className={inter.className}>
          <div className="h-screen w-[60%] mt-[10%] mx-auto">
            {children}
          </div>
        </body>
      </AppProviderWrapper>
    </html>
  );
}
