import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#111] text-[#999] text-sm pt-16 pb-8 border-t border-[#222]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: About */}
                    <div>
                        <Link href="/" className="text-2xl font-bold font-[var(--font-montserrat)] tracking-tighter text-white block mb-4">
                            GLO<span className="text-[var(--accent)]">SHIP</span>
                        </Link>
                        <p className="mb-6 leading-relaxed">
                            Glo-Ship Express provides reliable and secure shipping services worldwide. We ensure your cargo reaches its destination safely and on time.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors">
                                <Facebook size={14} />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors">
                                <Twitter size={14} />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors">
                                <Instagram size={14} />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors">
                                <Linkedin size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Services */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Our Services</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/services/transport?type=sea" className="hover:text-[var(--accent)] transition-colors">
                                    Maritime Transportation
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/transport?type=air" className="hover:text-[var(--accent)] transition-colors">
                                    Airline Transportation
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/transport?type=land" className="hover:text-[var(--accent)] transition-colors">
                                    Land Transportation
                                </Link>
                            </li>
                            <li>
                                <Link href="/warehouse" className="hover:text-[var(--accent)] transition-colors">
                                    Warehousing
                                </Link>
                            </li>
                            <li>
                                <Link href="/logistic" className="hover:text-[var(--accent)] transition-colors">
                                    Logistic Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about-us" className="hover:text-[var(--accent)] transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/track" className="hover:text-[var(--accent)] transition-colors">
                                    Track Shipment
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact-us" className="hover:text-[var(--accent)] transition-colors">
                                    Contact Support
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[var(--accent)] transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <MapPin size={18} className="text-[var(--accent)] mt-1" />
                                <span>
                                    123 Logistics Avenue,<br />
                                    Business District, NY 10001,<br />
                                    United States
                                </span>
                            </li>
                            {/* <li className="flex gap-3 items-center">
                                <Phone size={18} className="text-[var(--accent)]" />
                                <span>+1 (845) 731-9773</span>
                            </li> */}
                            <li className="flex gap-3 items-center">
                                <Mail size={18} className="text-[var(--accent)]" />
                                <span>globashipperss@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#222] pt-8 flex flex-col md:flex-row justify-between items-center bg-[#111]">
                    {/* Added bg-[#111] to ensure it matches footer background */}
                    <p className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Glo-Ship Express. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-[var(--accent)] transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="#" className="hover:text-[var(--accent)] transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
