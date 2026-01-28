"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Package,
    User,
    MapPin,
    CreditCard,
    Truck,
    Plus,
    Trash2,
    ArrowLeft,
    Calendar,
    Clock,
    Save,
    Loader2,
    FileText,
    Receipt
} from 'lucide-react';
import Link from 'next/link';
import { Shipment } from '@/types/shipment';
import { generateInvoice } from '@/lib/invoice';

export default function EditShipmentPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sendingInvoice, setSendingInvoice] = useState(false);
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [items, setItems] = useState<{ id: string; name: string; weight: string; quantity: number }[]>([]);
    const [history, setHistory] = useState<Shipment['history']>([]);

    useEffect(() => {
        if (id) {
            fetchShipment();
        }
    }, [id]);

    const fetchShipment = async () => {
        try {
            const res = await fetch(`/api/shipments?id=${id}`);
            if (res.ok) {
                const data = await res.json();
                setShipment(data);
                setItems(data.items || []);
                setHistory(data.history || []);
            } else {
                alert('Shipment not found');
                router.push('/admin/shipments');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: '', weight: '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const addHistoryLog = () => {
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            status: shipment?.status || 'In Transit' as any,
            timestamp: new Date().toISOString(),
            location: 'Transit Point',
            notes: 'Update description here'
        };
        setHistory([newLog, ...history]);
    };

    const removeHistoryLog = (id: string) => {
        setHistory(history.filter(log => log.id !== id));
    };

    const updateHistoryLog = (id: string, field: string, value: string) => {
        setHistory(history.map(log =>
            log.id === id ? { ...log, [field]: value } : log
        ));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!shipment) return;

        setSaving(true);
        const formData = new FormData(e.currentTarget);

        const updatedShipment = {
            ...shipment,
            status: formData.get('status'),
            expectedDelivery: formData.get('deliveryDate'),
            shipperName: formData.get('shipperName'),
            shipperAddress: formData.get('shipperAddress'),
            shipperPhone: formData.get('shipperPhone'),
            shipperEmail: formData.get('shipperEmail'),
            receiverName: formData.get('receiverName'),
            receiverAddress: formData.get('receiverAddress'),
            receiverPhone: formData.get('receiverPhone'),
            receiverEmail: formData.get('receiverEmail'),
            shippingCost: Number(formData.get('shippingCost')),
            amountPaid: Number(formData.get('amountPaid')),
            paymentMethod: formData.get('paymentMethod'),
            pickupTime: formData.get('pickupTime'),
            estimatedDuration: formData.get('estimatedDuration'),
            notes: formData.get('notes'),
            items: items.map((_, idx) => ({
                id: items[idx].id || Math.random().toString(36).substr(2, 9),
                name: (e.currentTarget.elements.namedItem(`itemName-${idx}`) as HTMLInputElement)?.value || '',
                weight: (e.currentTarget.elements.namedItem(`itemWeight-${idx}`) as HTMLInputElement)?.value || '',
                quantity: Number((e.currentTarget.elements.namedItem(`itemQty-${idx}`) as HTMLInputElement)?.value || 1),
            })),
            history: history
        };

        // Auto-add log only if status changed AND it's not already the top log
        if (updatedShipment.status !== shipment.status && (history.length === 0 || history[0].status !== updatedShipment.status)) {
            updatedShipment.history = [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    status: updatedShipment.status as any,
                    timestamp: new Date().toISOString(),
                    location: 'Transit Point',
                    notes: `Status updated to ${updatedShipment.status}`
                },
                ...history
            ];
        }

        try {
            const res = await fetch('/api/shipments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedShipment),
            });

            if (res.ok) {
                router.push('/admin/shipments');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleSendInvoiceEmail = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!shipment) return;

        setSendingInvoice(true);
        try {
            const res = await fetch('/api/shipments/invoice-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shipment),
            });
            if (res.ok) {
                alert('Invoice sent successfully!');
            } else {
                alert('Failed to send invoice.');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending invoice.');
        } finally {
            setSendingInvoice(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
    );

    if (!shipment) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/admin/shipments" className="p-2 hover:bg-white rounded-full transition-colors text-slate-600">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Shipment: {shipment.id}</h1>
                    <p className="text-slate-500 text-sm">Update shipment details and status</p>
                </div>
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={handleSendInvoiceEmail}
                        type="button"
                        disabled={sendingInvoice}
                        className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {sendingInvoice ? <Loader2 size={20} className="animate-spin" /> : <Receipt size={20} />}
                        Send Invoice
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); generateInvoice(shipment); }}
                        type="button"
                        className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <FileText size={20} />
                        Download Invoice
                    </button>
                </div>
            </div>

            <form className="space-y-8" onSubmit={handleUpdate}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Shipment Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Tracking Number</label>
                            <input type="text" readOnly value={shipment.id} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Delivery Date</label>
                            <input defaultValue={shipment.expectedDelivery} name="deliveryDate" type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Current Status</label>
                            <select defaultValue={shipment.status} name="status" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic font-bold">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Shipper</h2>
                        <div className="space-y-4 font-bold">
                            <input name="shipperName" defaultValue={shipment.shipperName} placeholder="Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input name="shipperAddress" defaultValue={shipment.shipperAddress} placeholder="Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input name="shipperPhone" defaultValue={shipment.shipperPhone} placeholder="Phone" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input name="shipperEmail" defaultValue={shipment.shipperEmail} placeholder="Email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 italic">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Receiver</h2>
                        <div className="space-y-4">
                            <input name="receiverName" defaultValue={shipment.receiverName} placeholder="Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input name="receiverAddress" defaultValue={shipment.receiverAddress} placeholder="Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input name="receiverPhone" defaultValue={shipment.receiverPhone} placeholder="Phone" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                            <input name="receiverEmail" defaultValue={shipment.receiverEmail} placeholder="Email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl italic focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 font-bold">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Package size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Item Details</h2>
                        </div>
                        <button
                            type="button"
                            onClick={addItem}
                            className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-sm bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus size={16} /> Add Item
                        </button>
                    </div>
                    <div className="space-y-4 font-bold">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <input
                                    name={`itemName-${index}`}
                                    defaultValue={item.name}
                                    required
                                    type="text"
                                    placeholder="Item Name"
                                    className="flex-1 md:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                />
                                <input
                                    name={`itemWeight-${index}`}
                                    defaultValue={item.weight}
                                    required
                                    type="text"
                                    placeholder="Weight (kg)"
                                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                />
                                <div className="flex gap-2 font-bold">
                                    <input
                                        name={`itemQty-${index}`}
                                        defaultValue={item.quantity}
                                        required
                                        type="number"
                                        min="1"
                                        placeholder="Qty"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    />
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 italic">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Truck size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Tracking History</h2>
                        </div>
                        <button
                            type="button"
                            onClick={addHistoryLog}
                            className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 text-sm bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100"
                        >
                            <Plus size={16} /> Add Log Entry
                        </button>
                    </div>

                    <div className="space-y-6">
                        {history.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                No history logs yet
                            </div>
                        ) : (
                            history.map((log) => (
                                <div key={log.id} className="relative pl-8 pb-6 border-l-2 border-slate-100 last:border-l-0 last:pb-0">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Status</label>
                                                    <select
                                                        value={log.status}
                                                        onChange={(e) => updateHistoryLog(log.id, 'status', e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Transit">In Transit</option>
                                                        <option value="On Hold">On Hold</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Picked Up">Picked Up</option>
                                                        <option value="At Customs">At Customs</option>
                                                        <option value="Out for Delivery">Out for Delivery</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Location</label>
                                                    <input
                                                        type="text"
                                                        value={log.location}
                                                        onChange={(e) => updateHistoryLog(log.id, 'location', e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeHistoryLog(log.id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Timestamp</label>
                                            <input
                                                type="datetime-local"
                                                value={new Date(log.timestamp).toISOString().slice(0, 16)}
                                                onChange={(e) => updateHistoryLog(log.id, 'timestamp', new Date(e.target.value).toISOString())}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Notes</label>
                                            <textarea
                                                value={log.notes}
                                                onChange={(e) => updateHistoryLog(log.id, 'notes', e.target.value)}
                                                rows={2}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 italic font-bold">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 font-[var(--font-montserrat)] italic">Payment & Logistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 font-bold">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Shipping Cost</label>
                                    <input name="shippingCost" type="number" step="0.01" defaultValue={shipment.shippingCost} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Amount Paid</label>
                                    <input name="amountPaid" type="number" step="0.01" defaultValue={shipment.amountPaid} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                                </div>
                            </div>
                            <select name="paymentMethod" defaultValue={shipment.paymentMethod} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold italic">
                                <option>Cash</option>
                                <option>Card</option>
                                <option>Bank Transfer</option>
                                <option>Crypto</option>
                            </select>
                        </div>
                        <div className="space-y-4 font-bold italic">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="pickupTime" type="time" defaultValue={shipment.pickupTime} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                <input name="estimatedDuration" defaultValue={shipment.estimatedDuration} placeholder="Duration" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            </div>
                            <textarea name="notes" defaultValue={shipment.notes} rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none italic font-bold"></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/shipments" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all">Cancel</Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
