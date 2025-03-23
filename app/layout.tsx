import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Power Outage Reporter",
  description: "Report and track power outages in your area",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to set the initial theme class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
                document.documentElement.style.colorScheme = theme;
              })();
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b border-border py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Power Outage Reporter</h1>
              <nav className="flex items-center space-x-4">
                <ThemeToggle />
              </nav>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}