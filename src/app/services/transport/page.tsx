"use client";

import PageHeader from "@/components/ui/PageHeader";
import { Plane, Ship, Truck, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

function TransportContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type");

    const seaRef = useRef<HTMLDivElement>(null);
    const airRef = useRef<HTMLDivElement>(null);
    const landRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (type === "sea" && seaRef.current) {
            seaRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (type === "air" && airRef.current) {
            airRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (type === "land" && landRef.current) {
            landRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [type]);

    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="Transportation Services"
                subtitle="Global reach"
                image="https://images.unsplash.com/photo-1548685913-fe65af73685f?auto=format&fit=crop&q=80"
                parentPage="Services"
                parentLink="/services"
            />

            <div className="container mx-auto px-4 py-20 space-y-20">

                {/* Maritime */}
                <div ref={seaRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="bg-[var(--accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-[var(--accent)]">
                            <Ship size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-[var(--font-montserrat)]">Maritime Transportation</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Our ocean freight services are the best way to handle large-scale international logistics.
                            We offer Full Container Load (FCL) and Less than Container Load (LCL) options to suit your needs.
                        </p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Global Port Coverage</li>
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Customs Clearance Support</li>
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Hazardous Cargo Handling</li>
                        </ul>
                    </div>
                    <div className="relative h-[350px] rounded-lg overflow-hidden border border-[#333]">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80")' }}></div>
                    </div>
                </div>

                {/* Airline */}
                <div ref={airRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                    <div className="order-2 md:order-1 relative h-[350px] rounded-lg overflow-hidden border border-[#333]">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80")' }}></div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-[var(--accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-[var(--accent)]">
                            <Plane size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-[var(--font-montserrat)]">Airline Transportation</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            When speed is a priority, our air freight solutions ensure your cargo reaches its destination quickly and safely.
                            Ideal for high-value or time-sensitive shipments.
                        </p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Express Delivery</li>
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Door-to-Door Service</li>
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Charter Services</li>
                        </ul>
                    </div>
                </div>

                {/* Land */}
                <div ref={landRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="bg-[var(--accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-[var(--accent)]">
                            <Truck size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-[var(--font-montserrat)]">Land Transportation</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Our extensive road and rail network connects major cities and industrial hubs.
                            We provide reliable trucking services for cross-border and domestic logistics.
                        </p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Fleet Management</li>
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Real-time GPS Tracking</li>
                            <li className="flex gap-2"><CheckCircle size={18} className="text-[var(--accent)]" /> Refrigerated Transport</li>
                        </ul>
                    </div>
                    <div className="relative h-[350px] rounded-lg overflow-hidden border border-[#333]">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80")' }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function TransportPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-white">Loading...</div>}>
            <TransportContent />
        </Suspense>
    );
}
