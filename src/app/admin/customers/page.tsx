"use client";

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    User,
    Trash2,
    Edit,
    Loader2,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import { Receiver } from '@/types/customer';

export default function ReceiverListPage() {
    const [customers, setReceivers] = useState<Receiver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReceivers();
    }, []);

    const fetchReceivers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/customers');
            const data = await res.json();
            setReceivers(data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            const res = await fetch(`/api/customers?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setReceivers(customers.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const filteredReceivers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-montserrat)]">Receivers</h1>
                    <p className="text-slate-500 text-sm">Manage your client base</p>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg active:scale-[0.98]"
                >
                    <Plus size={20} />
                    New Receiver
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
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
                    ) : filteredReceivers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 italic font-bold">
                            <User size={48} className="mb-2 opacity-20" />
                            <p>No customers found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                    <th className="px-6 py-4">Receiver Info</th>
                                    <th className="px-6 py-4">Contact Details</th>
                                    <th className="px-6 py-4">Address</th>
                                    <th className="px-6 py-4">Shipments</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredReceivers.map((customer) => (
                                    <tr key={customer.id} className="text-sm hover:bg-slate-50 transition-all group font-bold">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{customer.name}</p>
                                                    <p className="text-xs text-slate-400 font-mono">{customer.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 space-y-1">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail size={14} className="text-slate-400" />
                                                <span className="text-xs">{customer.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Phone size={14} className="text-slate-400" />
                                                <span className="text-xs">{customer.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 text-slate-600">
                                                <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs line-clamp-2 max-w-[200px]">{customer.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-bold">{customer.totalShipments}</span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Total Orders</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg" title="Edit">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
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
