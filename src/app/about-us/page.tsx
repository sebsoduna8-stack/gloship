import PageHeader from "@/components/ui/PageHeader";
import AboutSection from "@/components/home/AboutSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function AboutPage() {
    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="About Us"
                subtitle="Who We Are"
                image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
            />

            <div className="pt-20">
                <AboutSection />
            </div>

            <StatsSection />

            <section className="py-20 bg-[#151515]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8 font-[var(--font-montserrat)]">Our Mission & Vision</h2>
                    <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                        <div className="p-8 bg-[#222] rounded-lg border-l-4 border-[var(--accent)]">
                            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                            <p className="text-gray-400">To provide the most reliable, efficient, and secure logistics solutions to our global clients, ensuring their growth and success.</p>
                        </div>
                        <div className="p-8 bg-[#222] rounded-lg border-l-4 border-[var(--accent)]">
                            <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                            <p className="text-gray-400">To be the world's leading logistics provider, connecting people and businesses through innovative and sustainable transport solutions.</p>
                        </div>
                    </div>
                </div>
            </section>

            <TestimonialsSection />
        </div>
    );
}
