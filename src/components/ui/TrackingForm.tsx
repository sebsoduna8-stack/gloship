"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrackingForm() {
    const [trackingId, setTrackingId] = useState("");
    const router = useRouter();

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/track?id=${trackingId}`);
        }
    };

    return (
        <div className="bg-[var(--accent)] p-6 md:p-10 rounded-lg shadow-xl -mt-20 relative z-20 mx-4 md:mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 text-white flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-2xl overflow-hidden border-2 border-white/20">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black font-[var(--font-montserrat)] italic leading-tight uppercase tracking-tighter">Track Your Shipment</h3>
                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mt-1">Global Intelligence Tracking</p>
                    </div>
                </div>

                <form onSubmit={handleTrack} className="md:col-span-2 flex flex-col md:flex-row gap-2">
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            placeholder="Enter Tracking ID (e.g., GLO-123456)"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className="w-full h-14 pl-4 pr-4 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                    </div>
                    <button
                        type="submit"
                        className="h-14 bg-black text-white px-8 font-bold rounded hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                    >
                        <Search size={18} /> Track
                    </button>
                </form>
            </div>
        </div>
    );
}
