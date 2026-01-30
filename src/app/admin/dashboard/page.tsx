"use client";

import { useState, useEffect } from 'react';
import {
    Package,
    Truck,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Clock,
    Loader2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Shipment } from '@/types/shipment';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<{ status: string; message: string; mode: string } | null>(null);

    useEffect(() => {
        // Fetch Shipments
        fetch('/api/shipments')
            .then(res => res.json())
            .then(data => {
                setShipments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Check DB Status
        fetch('/api/admin/status')
            .then(res => res.json())
            .then(data => setDbStatus(data));
    }, []);

    const stats = [
        { label: 'Total Shipments', value: shipments.length, icon: Package, color: 'bg-blue-500' },
        { label: 'In Transit', value: shipments.filter(s => s.status === 'In Transit').length, icon: Truck, color: 'bg-amber-500' },
        { label: 'Pending', value: shipments.filter(s => s.status === 'Pending').length, icon: Clock, color: 'bg-slate-500' },
        { label: 'On Hold', value: shipments.filter(s => s.status === 'On Hold').length, icon: AlertCircle, color: 'bg-red-500' },
        { label: 'Delivered', value: shipments.filter(s => s.status === 'Delivered').length, icon: CheckCircle2, color: 'bg-emerald-500' },
    ];

    const recentShipments = [...shipments]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const recentActivity = shipments
        .flatMap(s => s.history.map(h => ({ ...h, shipmentId: s.id })))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 6);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome back, Admin. Here's what's happening today.</p>
                
                {dbStatus && dbStatus.status !== 'success' && (
                    <div className={`mt-4 p-4 rounded-lg border ${
                        dbStatus.status === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                        <div className="flex items-center gap-2 font-bold">
                            <AlertCircle size={20} />
                            Storage Alert: {dbStatus.mode === 'local' ? 'Data will NOT persist!' : 'Connection Issue'}
                        </div>
                        <p className="text-sm mt-1">{dbStatus.message}</p>
                        {dbStatus.mode === 'local' && (
                            <p className="text-xs mt-2 font-mono bg-white/50 p-2 rounded">
                                Missing GITHUB_TOKEN in Vercel. Please add it to Settings &gt; Environment Variables.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                        <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2 shadow-lg`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-semibold">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-auto pt-4 border-t border-slate-50">
                            <TrendingUp size={14} />
                            <span>+{(Math.random() * 15).toFixed(1)}%</span>
                            <span className="text-slate-400 font-normal ml-1">v yesterday</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Shipments */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden italic">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-blue-600" />
                            Recent Shipments
                        </h2>
                        <Link href="/admin/shipments" className="text-blue-600 text-sm font-black hover:underline flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                    <th className="px-6 py-4">Tracking ID</th>
                                    <th className="px-6 py-4">Receiver</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentShipments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-bold">No shipments found</td>
                                    </tr>
                                ) : recentShipments.map((s) => (
                                    <tr 
                                        key={s.id} 
                                        className="text-sm hover:bg-slate-50 transition-colors group cursor-pointer"
                                        onClick={() => router.push(`/admin/shipments/${s.id}/edit`)}
                                    >
                                        <td className="px-6 py-4 font-mono font-black text-blue-600 transition-transform group-hover:translate-x-1">{s.id}</td>
                                        <td className="px-6 py-4 text-slate-700 font-bold">{s.receiverName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                    s.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                        s.status === 'On Hold' ? 'bg-red-100 text-red-700' :
                                                            'bg-slate-100 text-slate-700'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-right text-xs font-bold">{new Date(s.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-xl italic">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-black text-slate-900">System Activity</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-20 text-slate-400 font-bold">No activity yet</div>
                        ) : recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-blue-100 text-blue-600 shadow-inner' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <Package size={20} />
                                    </div>
                                    {idx < recentActivity.length - 1 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-100"></div>}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-700 font-bold">
                                        {activity.status} <span className="text-blue-600">#{activity.shipmentId}</span>
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Clock size={10} />
                                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {activity.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
