import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "John Doe",
        company: "CEO, Tech Corp",
        quote: "Glo-Ship Express has been an incredible partner for our international logistics needs. Fast, reliable, and always on time.",
    },
    {
        name: "Sarah Smith",
        company: "Manager, Global Trade",
        quote: "The best logistics company we’ve worked with. Their tracking system is top-notch and customer service is excellent.",
    },
    {
        name: "Michael Brown",
        company: "Director, Import/Export",
        quote: "Efficient and professional. I highly recommend Glo-Ship Express to anyone looking for serious shipping solutions.",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-[#111] relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full filter blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-2 block">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-montserrat)]">
                        What Our Clients Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-[#1a1a1a] p-8 rounded-lg border border-[#222] hover:border-[var(--accent)] transition-colors">
                            <Quote size={40} className="text-[var(--accent)] mb-6 opacity-50" />
                            <p className="text-gray-300 mb-6 leading-relaxed italic">&quot;{item.quote}&quot;</p>
                            <div>
                                <h4 className="text-white font-bold font-[var(--font-montserrat)]">{item.name}</h4>
                                <span className="text-gray-500 text-sm">{item.company}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
