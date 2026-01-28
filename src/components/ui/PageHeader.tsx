import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    image?: string;
    parentPage?: string;
    parentLink?: string;
}

export default function PageHeader({
    title,
    subtitle,
    image = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
    parentPage,
    parentLink
}: PageHeaderProps) {
    return (
        <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-black overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center container mx-auto px-4">
                {subtitle && (
                    <span className="block text-[var(--accent)] font-bold tracking-widest uppercase text-sm mb-2">
                        {subtitle}
                    </span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white font-[var(--font-montserrat)] mb-4">
                    {title}
                </h1>

                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-gray-300 text-sm font-medium">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    {parentPage && parentLink && (
                        <>
                            <Link href={parentLink} className="hover:text-white transition-colors">{parentPage}</Link>
                            <ChevronRight size={14} />
                        </>
                    )}
                    <span className="text-[var(--accent)]">{title}</span>
                </div>
            </div>
        </div>
    );
}
