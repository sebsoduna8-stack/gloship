"use client";

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    FileText,
    Trash2,
    Edit,
    Loader2,
    Package,
    Mail,
    CheckCircle,
    XCircle,
    Receipt
} from 'lucide-react';
import Link from 'next/link';
import { Shipment } from '@/types/shipment';
import { generateInvoice } from '@/lib/invoice';

import { useRouter } from 'next/navigation';

export default function ShipmentListPage() {
    const router = useRouter();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);
    const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/shipments');
            const data = await res.json();
            setShipments(data);
        } catch (error) {
            console.error('Failed to fetch shipments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this shipment?')) return;

        try {
            const res = await fetch(`/api/shipments?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setShipments(shipments.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleSendInvoiceEmail = async (shipment: Shipment) => {
        setSendingInvoice(shipment.id);
        setNotification(null);

        try {
            const res = await fetch('/api/shipments/invoice-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shipment),
            });

            if (res.ok) {
                setNotification({ type: 'success', message: `Invoice for ${shipment.id} sent successfully` });
            } else {
                setNotification({ type: 'error', message: 'Failed to send invoice email' });
            }
        } catch (error) {
            console.error('Invoice email error:', error);
            setNotification({ type: 'error', message: 'An error occurred while sending the invoice.' });
        } finally {
            setSendingInvoice(null);
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const handleSendEmail = async (shipment: Shipment) => {
        setSendingEmail(shipment.id);
        setNotification(null);

        try {
            const res = await fetch('/api/shipments/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shipment),
            });

            const data = await res.json();

            if (res.ok) {
                setNotification({ type: 'success', message: `Invoice for ${shipment.id} sent to ${shipment.receiverEmail}` });
            } else {
                setNotification({ type: 'error', message: data.error || 'Failed to send email' });
            }
        } catch (error) {
            console.error('Email error:', error);
            setNotification({ type: 'error', message: 'An error occurred while sending the email.' });
        } finally {
            setSendingEmail(null);
            // Clear notification after 5 seconds
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const filteredShipments = shipments.filter(s =>
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shipperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Shipments</h1>
                    <p className="text-slate-500 text-sm">Manage and track all shipments</p>
                </div>
                <Link
                    href="/admin/shipments/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg active:scale-[0.98]"
                >
                    <Plus size={20} />
                    New Shipment
                </Link>
            </div>

            {notification && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="font-bold text-sm">{notification.message}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by tracking number, sender, or receiver..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all text-sm">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                        </div>
                    ) : filteredShipments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 italic font-bold">
                            <Package size={48} className="mb-2 opacity-20" />
                            <p>No shipments found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                    <th className="px-6 py-4">Tracking Number</th>
                                    <th className="px-6 py-4">Sender</th>
                                    <th className="px-6 py-4">Receiver</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 italic">
                                {filteredShipments.map((shipment) => (
                                    <tr 
                                        key={shipment.id} 
                                        className="text-sm hover:bg-slate-50 transition-all group font-bold cursor-pointer"
                                        onClick={(e) => {
                                            // Prevent navigation when clicking actions
                                            if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
                                            router.push(`/admin/shipments/${shipment.id}/edit`);
                                        }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-bold text-blue-600">{shipment.id}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                {new Date(shipment.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-700">{shipment.shipperName}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{shipment.shipperAddress}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-700">{shipment.receiverName}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{shipment.receiverAddress}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                shipment.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                    shipment.status === 'On Hold' ? 'bg-red-100 text-red-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {shipment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700 font-bold">${shipment.shippingCost.toFixed(2)}</div>
                                            <div className={`text-[10px] font-black uppercase ${shipment.amountPaid >= shipment.shippingCost ? 'text-emerald-600' : 'text-amber-600'
                                                }`}>
                                                {shipment.amountPaid >= shipment.shippingCost ? 'PAID' : 'PARTIAL'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => generateInvoice(shipment)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                                                    title="Download Invoice"
                                                >
                                                    <FileText size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleSendInvoiceEmail(shipment)}
                                                    disabled={sendingInvoice === shipment.id}
                                                    className={`p-2 rounded-lg transition-all ${sendingInvoice === shipment.id
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                        : 'hover:bg-purple-50 text-purple-600'
                                                        }`}
                                                    title="Send Invoice via Email"
                                                >
                                                    {sendingInvoice === shipment.id ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <Receipt size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleSendEmail(shipment)}
                                                    disabled={sendingEmail === shipment.id}
                                                    className={`p-2 rounded-lg transition-all ${sendingEmail === shipment.id
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                        : 'hover:bg-emerald-50 text-emerald-600'
                                                        }`}
                                                    title="Send via Email"
                                                >
                                                    {sendingEmail === shipment.id ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <Mail size={18} />
                                                    )}
                                                </button>
                                                <Link href={`/admin/shipments/${shipment.id}/edit`} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg" title="Edit">
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(shipment.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
