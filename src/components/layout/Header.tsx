"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navigation = [
    { name: "HOME", href: "/" },
    { name: "SHIPMENT STATUS", href: "/track" },
    {
        name: "TRANSPORT",
        href: "#",
        submenu: [
            { name: "Land Transport", href: "/services/transport?type=land" },
            { name: "Airline Transportation", href: "/services/transport?type=air" },
            { name: "Railway Transportation", href: "/services/transport?type=rail" },
            { name: "Maritime Transportation", href: "/services/transport?type=sea" },
        ],
    },
    { name: "ABOUT US", href: "/about-us" },
    { name: "WAREHOUSE", href: "/warehouse" },
    { name: "LOGISTIC", href: "/logistic" },
    { name: "PET TRANSPORT", href: "/pet-transportation" },
    { name: "CONTACT", href: "/contact-us" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed w-full z-50 transition-all duration-300">
            {/* Top Bar */}
            <div className="bg-[#111] text-[#999] text-xs py-2 hidden md:block border-b border-[#222]">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-4">
                    
                        <span className="flex items-center gap-1">
                            <Mail size={12} className="text-[var(--accent)]" />
                            globashipperss@gmail.com tyui
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/track" className="hover:text-[var(--accent)] transition-colors">
                            Track Order
                        </Link>
                        <Link href="/contact-us" className="hover:text-[var(--accent)] transition-colors">
                            Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav
                className={clsx(
                    "transition-all duration-300 border-b border-transparent",
                    scrolled || isOpen
                        ? "bg-[var(--background)]/95 backdrop-blur-md py-3 shadow-lg border-[#333]"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white p-1 overflow-hidden shadow-lg border-2 border-blue-500/20">
                            <img src="/logo.png" alt="Gloship Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">Glo-Ship</h1>
                            <p className="text-[8px] text-[var(--accent)] font-black uppercase tracking-widest leading-none">Express</p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navigation.map((item) => (
                            <div key={item.name} className="relative group">
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        "text-xs font-bold tracking-widest hover:text-[var(--accent)] transition-colors flex items-center gap-1 py-4",
                                        pathname === item.href ? "text-[var(--accent)]" : "text-white"
                                    )}
                                >
                                    {item.name}
                                    {item.submenu && <ChevronDown size={12} />}
                                </Link>

                                {/* Dropdown */}
                                {item.submenu && (
                                    <div className="absolute top-full left-0 w-56 bg-[#1a1a1a] shadow-xl rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border-t-2 border-[var(--accent)]">
                                        {item.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#222] border-b border-[#222] last:border-0"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden bg-[#111] border-t border-[#222] absolute w-full left-0 top-full h-screen overflow-y-auto pb-20">
                        <div className="flex flex-col p-4">
                            {navigation.map((item) => (
                                <div key={item.name} className="border-b border-[#222] last:border-0">
                                    {item.submenu ? (
                                        <div className="py-2">
                                            <span className="block py-2 text-sm font-bold text-gray-400">
                                                {item.name}
                                            </span>
                                            <div className="pl-4 border-l border-[#333] ml-2">
                                                {item.submenu.map((sub) => (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="block py-2 text-sm text-gray-300 hover:text-[var(--accent)]"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={clsx(
                                                "block py-3 text-sm font-bold hover:text-[var(--accent)]",
                                                pathname === item.href ? "text-[var(--accent)]" : "text-white"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
