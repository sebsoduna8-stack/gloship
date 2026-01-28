import PageHeader from "@/components/ui/PageHeader";
import { ArrowRight, Layers, ShieldCheck, Thermometer } from "lucide-react";

export default function WarehousePage() {
    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="Warehousing Solutions"
                subtitle="Secure Storage"
                image="https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&q=80"
                parentPage="Services"
                parentLink="/services"
            />

            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-2/3">
                        <h2 className="text-3xl font-bold text-white mb-6 font-[var(--font-montserrat)]">Modern Warehousing Facilities</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Our state-of-the-art warehousing facilities are designed to handle all types of cargo.
                            From temperature-sensitive goods to oversized machinery, we have the space and equipment to store your assets securely.
                        </p>

                        <div className="my-8 relative h-[300px] rounded-lg overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&q=80")' }}
                            ></div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-6 font-[var(--font-montserrat)]">Our Features</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="bg-[#222] p-4 rounded h-fit">
                                    <ShieldCheck size={24} className="text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">24/7 Security</h4>
                                    <p className="text-gray-500">Round-the-clock surveillance and manned security to ensure the safety of your goods.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-[#222] p-4 rounded h-fit">
                                    <Thermometer size={24} className="text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Climate Control</h4>
                                    <p className="text-gray-500">Temperature and humidity controlled environments for sensitive items.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-[#222] p-4 rounded h-fit">
                                    <Layers size={24} className="text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Automated Inventory</h4>
                                    <p className="text-gray-500">Advanced WMS (Warehouse Management System) for accurate stock tracking.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#333]">
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-[#333] pb-4">Other Services</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="/logistic" className="flex items-center justify-between text-gray-400 hover:text-[var(--accent)] transition-colors group">
                                        Logistic Services <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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
                            <h3 className="text-xl font-bold mb-4">Storage Quote</h3>
                            <p className="mb-6 text-blue-100">Get a competitive quote for your short-term or long-term storage needs.</p>
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
