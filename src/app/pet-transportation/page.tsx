"use client";

import PageHeader from "@/components/ui/PageHeader";
import { ShieldCheck, Heart, Plane, Globe, Calendar, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PetTransportationPage() {
    const features = [
        {
            icon: Heart,
            title: "Care & Comfort",
            description: "Climate-controlled environments and dedicated handlers who treat every pet like family."
        },
        {
            icon: ShieldCheck,
            title: "Safety First",
            description: "IATA-compliant specialized crates and rigorous safety protocols for every journey."
        },
        {
            icon: Globe,
            title: "Global Reach",
            description: "Door-to-door international relocation including customs and quarantine management."
        },
        {
            icon: Plane,
            title: "Express Travel",
            description: "Priority boarding and direct routes to minimize travel time and stress for your pets."
        }
    ];

    const requirements = [
        "Updated vaccination records and health certificates.",
        "IATA-approved travel crates appropriate for pet size.",
        "Microchip identification for international travel.",
        "Advance booking (minimum 7-14 days recommended).",
    ];

    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="Pet Transportation"
                subtitle="Safe & Loving Relocation"
                image="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80"
            />

            <div className="container mx-auto px-4 py-20">
                {/* Introduction Section */}
                <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
                    <div className="lg:w-1/2">
                        <span className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-2 block">Premium Pet Relocation</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-[var(--font-montserrat)] leading-tight">
                            Your Furry Friends Deserve <br /> <span className="text-[var(--accent)]">First-Class Travel.</span>
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                            At Glo-Ship Express, we understand that pets are more than just cargo—they are beloved family members.
                            Our specialized pet transportation service ensures a stress-free, safe, and comfortable journey for your cats, dogs, and other small animals across the globe.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/contact-us" className="bg-[var(--accent)] text-white px-8 py-4 font-bold rounded-xl hover:bg-blue-600 transition-all uppercase tracking-wider text-sm shadow-lg hover:shadow-[var(--accent)]/20">
                                Get a Pet Quote
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden border border-[#333] shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1541599540903-216a46ca1df0?auto=format&fit=crop&q=80"
                            alt="Happy dog in travel crate"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] hover:border-[var(--accent)] transition-all group">
                            <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <div className="bg-[#1a1a1a] p-10 rounded-3xl border border-[#333]">
                        <div className="flex items-center gap-3 mb-8">
                            <Calendar className="text-[var(--accent)]" size={32} />
                            <h3 className="text-2xl font-bold text-white font-[var(--font-montserrat)]">Travel Requirements</h3>
                        </div>
                        <ul className="space-y-4">
                            {requirements.map((req, i) => (
                                <li key={i} className="flex gap-4 items-start text-gray-400">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>
                                    </div>
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[var(--accent)] p-10 rounded-3xl text-white flex flex-col justify-center">
                        <h3 className="text-3xl font-bold mb-6 font-[var(--font-montserrat)]">Ready to Move?</h3>
                        <p className="text-blue-50 text-lg mb-8">
                            Every pet shipment is unique. Our expert pet relocation consultants are ready to help you plan every step of the journey.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <Info className="text-white" size={24} />
                                <span className="text-sm font-semibold">Average transit time: 24-48 hours (International)</span>
                            </div>
                            <Link href="/contact-us" className="inline-block bg-white text-black px-8 py-4 font-bold rounded-xl hover:bg-gray-100 transition-all uppercase tracking-wider text-sm text-center w-full md:w-auto">
                                Contact Specialist
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FAQ/Trust Section */}
                <div className="text-center max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-6">Why Glo-Ship Express for Pets?</h3>
                    <p className="text-gray-500">
                        We hold certifications from leading international pet and animal transportation associations.
                        Our team includes veterinary consultants who ensure that health is prioritized over everything else.
                        Trust us to bring your family together, safely.
                    </p>
                </div>
            </div>
        </div>
    );
}
