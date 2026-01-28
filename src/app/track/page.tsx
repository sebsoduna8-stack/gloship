"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import PageHeader from "@/components/ui/PageHeader";
import TrackingForm from "@/components/ui/TrackingForm";
import { CheckCircle, Truck, Package, MapPin, Loader2, AlertTriangle, Clock, Calendar } from "lucide-react";
import { Shipment } from "@/types/shipment";

function TrackingContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [status, setStatus] = useState<"loading" | "found" | "not-found" | "idle">("idle");

    useEffect(() => {
        if (id) {
            fetchShipment(id);
        } else {
            setStatus("idle");
        }
    }, [id]);

    const fetchShipment = async (trackingId: string) => {
        setStatus("loading");
        try {
            const res = await fetch(`/api/shipments?id=${trackingId}`);
            if (res.ok) {
                const data = await res.json();
                setShipment(data);
                setStatus("found");
            } else {
                setStatus("not-found");
            }
        } catch (error) {
            console.error("Tracking fetch error:", error);
            setStatus("not-found");
        }
    };

    return (
        <div className="bg-[#111] min-h-screen pb-20 font-[var(--font-montserrat)]">
            <PageHeader
                title="Track Shipment"
                subtitle="Real-time Status"
                image="https://images.unsplash.com/photo-1566576912906-600afa88700e?auto=format&fit=crop&q=80"
                parentPage="Home"
                parentLink="/"
            />

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <TrackingForm />
            </div>

            <div className="container mx-auto px-4 py-20">
                {status === "loading" && (
                    <div className="text-center py-20 flex flex-col items-center">
                        <Loader2 className="animate-spin text-[var(--accent)] h-16 w-16 mb-4" />
                        <p className="text-white text-xl font-bold italic">Searching for shipment <span className="text-[var(--accent)]">{id}</span>...</p>
                    </div>
                )}

                {status === "found" && shipment && (
                    <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden shadow-2xl">
                        {/* Header Banner */}
                        <div className="bg-[var(--accent)] p-8 flex justify-between items-center flex-wrap gap-6 italic">
                            <div>
                                <span className="text-blue-900 font-black block text-xs uppercase tracking-widest mb-1">Tracking Number</span>
                                <h2 className="text-3xl font-black text-white leading-none">{shipment.id}</h2>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-6 py-2 rounded-full text-white font-black text-sm uppercase tracking-wider backdrop-blur-md shadow-lg ${shipment.status === 'In Transit' ? 'bg-blue-600/50' :
                                        shipment.status === 'Delivered' ? 'bg-emerald-600/50' :
                                            shipment.status === 'On Hold' ? 'bg-red-600/50' :
                                                'bg-white/10'
                                    }`}>
                                    Status: {shipment.status}
                                </span>
                                <span className="text-blue-100 text-[10px] mt-2 font-bold">Estimated Delivery: {new Date(shipment.expectedDelivery).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            {/* Route Visualization */}
                            <div className="flex flex-col md:flex-row justify-between mb-16 border-b border-[#2a2a2a] pb-12 gap-8">
                                <div className="flex-1">
                                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest block mb-2">Sender Details</span>
                                    <h4 className="text-white font-black text-xl italic">{shipment.shipperName}</h4>
                                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{shipment.shipperAddress}</p>
                                </div>

                                <div className="hidden md:flex items-center flex-[2] px-8 py-4">
                                    <div className="h-[2px] bg-[#333] w-full relative">
                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-[var(--accent)] rounded-full shadow-[0_0_10px_var(--accent)]"></div>
                                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-gray-600 rounded-full"></div>
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] p-3 rounded-xl shadow-2xl animate-pulse">
                                            <Truck size={24} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 md:text-right">
                                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest block mb-2">Receiver Details</span>
                                    <h4 className="text-white font-black text-xl italic">{shipment.receiverName}</h4>
                                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{shipment.receiverAddress}</p>
                                </div>
                            </div>

                            {/* Shipment Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 italic font-bold">
                                <div className="bg-[#222] p-6 rounded-2xl border border-[#333]">
                                    <div className="flex items-center gap-3 text-[var(--accent)] mb-3">
                                        <Package size={20} />
                                        <span className="text-xs uppercase tracking-widest">Package Details</span>
                                    </div>
                                    <div className="space-y-4">
                                        {shipment.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-end border-b border-[#333] pb-2 last:border-0">
                                                <div>
                                                    <p className="text-white text-sm">{item.name}</p>
                                                    <p className="text-gray-500 text-[10px]">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-[var(--accent)] text-xs">{item.weight} kg</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#222] p-6 rounded-2xl border border-[#333]">
                                    <div className="flex items-center gap-3 text-emerald-500 mb-3">
                                        <Clock size={20} />
                                        <span className="text-xs uppercase tracking-widest">Timings</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-xs">Pickup Time:</span>
                                            <span className="text-white text-xs">{shipment.pickupTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-xs">Est. Duration:</span>
                                            <span className="text-white text-xs">{shipment.estimatedDuration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-xs">Carrier:</span>
                                            <span className="text-white text-xs">Global Express</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#222] p-6 rounded-2xl border border-[#333]">
                                    <div className="flex items-center gap-3 text-blue-500 mb-3">
                                        <Calendar size={20} />
                                        <span className="text-xs uppercase tracking-widest">Shipping Notes</span>
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        {shipment.notes || "No special instructions provided for this shipment."}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-10">
                                <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-4 italic mb-8">
                                    <span className="block w-12 h-1 px-1 bg-[var(--accent)]"></span>
                                    Tracking Timeline
                                </h3>

                                <div className="space-y-0 text-white italic">
                                    {shipment.history.map((log, idx) => (
                                        <div key={log.id} className="flex gap-6 group">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full border-4 border-[#1a1a1a] shadow-xl z-10 ${idx === 0 ? 'bg-[var(--accent)] ring-4 ring-blue-900/50 active' : 'bg-[#444]'
                                                    }`}></div>
                                                {idx < shipment.history.length - 1 && <div className="h-full w-[2px] bg-[#333] -mt-1 mb-1"></div>}
                                            </div>
                                            <div className="pb-10 font-bold">
                                                <h4 className={`text-lg font-black leading-none mb-2 ${idx === 0 ? 'text-[var(--accent)]' : 'text-gray-300'}`}>
                                                    {log.status}
                                                </h4>
                                                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">
                                                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span>•</span>
                                                    <span className="text-gray-400">{log.location}</span>
                                                </div>
                                                <p className="text-gray-500 text-xs max-w-lg">{log.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === "not-found" && (
                    <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-[#333] max-w-2xl mx-auto shadow-2xl italic font-bold">
                        <AlertTriangle size={80} className="text-red-600 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]" />
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Tracking ID <span className="text-red-600">{id}</span> Not Found</h3>
                        <p className="text-gray-500 mt-4 text-lg">We couldn't locate any shipment matching that ID. Please verify and try again or contact support.</p>
                        <button
                            onClick={() => window.location.href = '/track'}
                            className="mt-10 px-10 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all shadow-xl"
                        >
                            Try New Search
                        </button>
                    </div>
                )}

                {status === "idle" && (
                    <div className="text-center py-20 opacity-30 italic font-bold">
                        <Package size={100} className="text-gray-600 mx-auto mb-6" />
                        <p className="text-gray-500 text-2xl uppercase tracking-widest">Enter tracking ID above to begin</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center text-white italic font-bold">
                <Loader2 className="animate-spin text-[var(--accent)] h-12 w-12 mb-4" />
                <p className="tracking-widest uppercase">Initializing Global Tracking...</p>
            </div>
        }>
            <TrackingContent />
        </Suspense>
    );
}
