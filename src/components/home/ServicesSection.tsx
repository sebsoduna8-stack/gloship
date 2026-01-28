import ServiceCard from "@/components/ui/ServiceCard";

const services = [
    {
        title: "Maritime Transportation",
        description: "Reliable sea freight services for large cargo globally. We offer FCL and LCL shipments with competitive rates.",
        image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80",
        link: "/services/transport?type=sea",
    },
    {
        title: "Air Freight",
        description: "Fast air transport for urgent shipments. We ensure your goods arrive on time with our express air cargo solutions.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
        link: "/services/transport?type=air",
    },
    {
        title: "Land Transportation",
        description: "Efficient road and rail transport for domestic and cross-border logistics. Secure trucking fleet available.",
        image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80",
        link: "/services/transport?type=land",
    },
    {
        title: "Warehousing",
        description: "Secure storage solutions for your inventory. Climate-controlled warehouses with 24/7 security monitoring.",
        image: "https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&q=80",
        link: "/warehouse",
    },
];

export default function ServicesSection() {
    return (
        <section className="py-20 bg-[#111]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-2 block">Our Services</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-montserrat)]">
                        What We Provide
                    </h2>
                    <p className="text-gray-400">
                        Comprehensive logistics solutions tailored to your business needs.
                        From shipping to storage, we handle it all.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
