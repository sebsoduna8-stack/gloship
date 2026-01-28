import PageHeader from "@/components/ui/PageHeader";
import { ArrowRight, Box, Clock, Globe } from "lucide-react";

export default function LogisticPage() {
    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="Logistic Services"
                subtitle="End-to-End Solutions"
                image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80"
                parentPage="Services"
                parentLink="/services"
            />

            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-2/3">
                        <h2 className="text-3xl font-bold text-white mb-6 font-[var(--font-montserrat)]">Integrated Logistics Solutions</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            We offer comprehensive logistics services that integrate everything from supply chain management to final mile delivery.
                            Our goal is to optimize your operations and reduce costs while improving efficiency.
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            With our advanced technology and global network, we provide visibility and control over your entire supply chain.
                            Whether you are a small business or a large corporation, we have the expertise to handle your logistics needs.
                        </p>

                        <h3 className="text-2xl font-bold text-white mb-6 font-[var(--font-montserrat)]">Why Choose Our Logistics?</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-[#222] p-6 rounded border border-[#333]">
                                <Clock size={32} className="text-[var(--accent)] mb-4" />
                                <h4 className="text-white font-bold mb-2">Just-In-Time Delivery</h4>
                                <p className="text-gray-500 text-sm">Minimize inventory costs with our precise delivery schedules.</p>
                            </div>
                            <div className="bg-[#222] p-6 rounded border border-[#333]">
                                <Globe size={32} className="text-[var(--accent)] mb-4" />
                                <h4 className="text-white font-bold mb-2">Global Reach</h4>
                                <p className="text-gray-500 text-sm">Access to markets worldwide through our extensive network.</p>
                            </div>
                            <div className="bg-[#222] p-6 rounded border border-[#333]">
                                <Box size={32} className="text-[var(--accent)] mb-4" />
                                <h4 className="text-white font-bold mb-2">Inventory Management</h4>
                                <p className="text-gray-500 text-sm">Real-time tracking and management of your stock levels.</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#333]">
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-[#333] pb-4">Other Services</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="/warehouse" className="flex items-center justify-between text-gray-400 hover:text-[var(--accent)] transition-colors group">
                                        Warehousing <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                                <li>
                                    <a href="/services/transport" className="flex items-center justify-between text-gray-400 hover:text-[var(--accent)] transition-colors group">
                                        Transportation <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 bg-[var(--accent)] p-8 rounded-lg text-white">
                            <h3 className="text-xl font-bold mb-4">Need a Quote?</h3>
                            <p className="mb-6 text-blue-100">Contact us today for a custom logistics solution tailored to your business.</p>
                            <a href="/contact-us" className="inline-block bg-black text-white px-6 py-3 font-bold rounded hover:bg-gray-900 transition-colors uppercase text-sm">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
