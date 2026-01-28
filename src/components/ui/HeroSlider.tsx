"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80",
        title: "Global Logistics Solution",
        subtitle: "WE PROVIDE THE BEST",
        description: "Safe & Faster Delivery",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
        title: "Air Freight Services",
        subtitle: "RELIABLE & SECURE",
        description: "Worldwide Shipping",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80",
        title: "Land Transportation",
        subtitle: "EFFICIENT LOGISTICS",
        description: "On Time Delivery",
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    >
                        <div className="absolute inset-0 bg-black/60" />
                        {/* Dark overlay for text readability */}
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
                        <div className="max-w-3xl space-y-4">
                            <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="inline-block text-[var(--accent)] font-bold tracking-[0.2em] text-sm md:text-base"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.span>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-[var(--font-montserrat)] leading-tight"
                            >
                                {slides[currentSlide].description}
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                                className="text-gray-300 text-lg md:text-xl max-w-xl"
                            >
                                We offer professional logistics services for businesses and individuals worldwide.
                            </motion.p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.1, duration: 0.8 }}
                                className="pt-4"
                            >
                                <Link
                                    href="/services"
                                    className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-8 py-4 font-bold rounded hover:bg-blue-500 transition-colors uppercase tracking-wider text-sm"
                                >
                                    Our Services <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="/contact-us"
                                    className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3.5 font-bold rounded hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-sm ml-4"
                                >
                                    Contact Us
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-0 w-full flex justify-center gap-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 w-12 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-[var(--accent)]" : "bg-white/30"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
