import PageHeader from "@/components/ui/PageHeader";
import ServicesSection from "@/components/home/ServicesSection";

export default function ServicesPage() {
    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="Our Services"
                subtitle="What We Do"
                image="https://images.unsplash.com/photo-1548685913-fe65af73685f?auto=format&fit=crop&q=80"
                parentPage="Home"
                parentLink="/"
            />

            <ServicesSection />
        </div>
    );
}
