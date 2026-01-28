export default function StatsSection() {
    const stats = [
        { number: "80+", label: "Countries Covered" },
        { number: "1550+", label: "Satisfied Clients" },
        { number: "4500+", label: "Delivered Goods" },
        { number: "25+", label: "Years of Experience" },
    ];

    return (
        <section className="py-20 bg-[var(--accent)] text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <span className="block text-4xl md:text-5xl font-bold font-[var(--font-montserrat)] mb-2">
                                {stat.number}
                            </span>
                            <span className="text-sm md:text-base font-semibold uppercase tracking-wider text-blue-900/80">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
