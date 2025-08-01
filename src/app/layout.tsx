import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Header } from "@/app/_navigation/Header";
import { Sidebar } from "@/app/_navigation/sidebar/components/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "./_providers/react-query/react-query-provider";
import Providers from "./providers";



const InterSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TickeTacker",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${InterSans.variable} antialiased`}>
        <Providers>
          <NuqsAdapter>
            <ThemeProvider>
              <ReactQueryProvider>
              <Header />
              <div className="flex flex-col-reverse md:flex-row h-screen overflow-x-hidden border-collapse">
                <Sidebar />
                <main
                  className={cn(
                    "flex-1 overflow-y-auto overflow-x-hidden bg-secondary/20 flex flex-col",
                    "duration-200",
                    "px-8 pt-20 pb-8",
                    "md:px-0 md:pt-24",
                  )}
                >
                  {children}
                </main>
              </div>
              <Toaster expand />
              </ReactQueryProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}