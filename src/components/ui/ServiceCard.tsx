import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

export default function ServiceCard({ title, description, image, link }: ServiceCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-lg bg-[#222] border border-[#333] hover:border-[var(--accent)] transition-all duration-300">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 font-[var(--font-montserrat)]">{title}</h3>
                <p className="text-gray-400 mb-6 text-sm line-clamp-3">{description}</p>

                <Link
                    href={link}
                    className="inline-flex items-center gap-2 text-[var(--accent)] font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
                >
                    Read More <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
