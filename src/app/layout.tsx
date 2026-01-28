import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google"; // Using Montserrat for headings, Inter for body
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Glo-Ship Express - Worldwide Logistics & Tracking",
  description: "Fast, reliable, and secure logistics services worldwide.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <Header />
        <main className="min-h-screen pt-[104px] lg:pt-[120px]">
          {/* pt accounts for fixed header height (TopBar + Navbar) */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
