import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function AboutSection() {
    const benefits = [
        "Real-Time Tracking",
        "Fast & Efficient Delivery",
        "Warehouse Storage",
        "Global Logistics Network",
        "24/7 Support",
        "Safe & Secure",
    ];

    return (
        <section className="py-20 bg-[var(--background)]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px]">
                        <div className="absolute inset-0 bg-[var(--accent)] rounded-lg transform rotate-3 z-0 opacity-20"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
                            alt="About Gloship"
                            fill
                            className="object-cover rounded-lg z-10 shadow-2xl"
                        />
                        {/* Experience Badge */}
                        <div className="absolute bottom-10 -right-4 lg:-right-10 bg-[var(--accent)] text-white p-6 rounded-lg z-20 shadow-lg max-w-[200px]">
                            <span className="block text-5xl font-bold font-[var(--font-montserrat)]">25+</span>
                            <span className="text-sm font-semibold uppercase tracking-wider">Years of Experience</span>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <span className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-2 block">Who We Are</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-[var(--font-montserrat)] leading-tight">
                            Leading Glo-Ship Express Logistics & Transport Agency
                        </h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            We provide full-service logistics solutions including air, sea, and land transportation.
                            Our experienced team ensures your cargo reaches its destination safely and on time.
                            With a global network of partners, we offer seamless shipping to over 200 countries.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {benefits.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-gray-300">
                                    <CheckCircle size={18} className="text-[var(--accent)] flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/about-us"
                            className="bg-white text-black px-8 py-3.5 font-bold rounded hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm inline-block"
                        >
                            More About Us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
