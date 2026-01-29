"use client";

import PageHeader from "@/components/ui/PageHeader";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="Contact Us"
                subtitle="Get In Touch"
                image="https://images.unsplash.com/photo-1423666639041-f14d70fa4c4d?auto=format&fit=crop&q=80"
            />

            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <span className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-2 block">Contact Info</span>
                            <h2 className="text-3xl font-bold text-white mb-6 font-[var(--font-montserrat)]">
                                We&apos;re here to help!
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Have questions about our services or need a custom quote? 
                                Our team is ready to assist you with all your logistics needs.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#222] p-3 rounded-lg text-[var(--accent)]">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Our Location</h3>
                                    <p className="text-gray-400">123 Logistics Way, Transport City, TC 90210</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-[#222] p-3 rounded-lg text-[var(--accent)]">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Phone Number</h3>
                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                    <p className="text-gray-400">+1 (555) 987-6543</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-[#222] p-3 rounded-lg text-[var(--accent)]">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Email Address</h3>
                                    <p className="text-gray-400">info@gloship-express.com</p>
                                    <p className="text-gray-400">support@gloship-express.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[#151515] p-8 rounded-xl border border-[#222]">
                        <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
                        <form className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                                    <input type="text" className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                                    <input type="text" className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <input type="email" className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                                <input type="text" className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" placeholder="How can we help?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                <textarea rows={4} className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" placeholder="Your message here..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-[var(--accent)] text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Send size={20} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
