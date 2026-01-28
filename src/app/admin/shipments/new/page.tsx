"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    Save
} from 'lucide-react';
import Link from 'next/link';

export default function NewShipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([{ name: '', weight: '', quantity: 1 }]);
    const [trackingId, setTrackingId] = useState('');

    useEffect(() => {
        // Generate a unique tracking ID on component mount
        setTrackingId(`GLS-${Math.floor(100000 + Math.random() * 900000)}`);
    }, []);

    const addItem = () => {
        setItems([...items, { name: '', weight: '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Construct the payload
        const payload = {
            id: trackingId,
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
                id: Math.random().toString(36).substr(2, 9),
                name: (e.currentTarget.elements.namedItem(`itemName-${idx}`) as HTMLInputElement)?.value || '',
                weight: (e.currentTarget.elements.namedItem(`itemWeight-${idx}`) as HTMLInputElement)?.value || '',
                quantity: Number((e.currentTarget.elements.namedItem(`itemQty-${idx}`) as HTMLInputElement)?.value || 1),
            }))
        };

        try {
            const res = await fetch('/api/shipments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/shipments');
            } else {
                const errData = await res.json();
                alert(errData.error || 'Failed to create shipment');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/admin/shipments" className="p-2 hover:bg-white rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Create New Shipment</h1>
                    <p className="text-slate-500 text-sm">Fill in the details to generate a new tracking ID</p>
                </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Section 1: Shipment Info */}
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
                            <input
                                type="text"
                                readOnly
                                value={trackingId}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Delivery Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    name="deliveryDate"
                                    type="date"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Current Status</label>
                            <select
                                name="status"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section 2: Shipper Details */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 italic">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Shipper (Sender)</h2>
                        </div>
                        <div className="space-y-4">
                            <input name="shipperName" required type="text" placeholder="Full Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                            <input name="shipperAddress" required type="text" placeholder="House Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                            <input name="shipperPhone" required type="tel" placeholder="Phone Number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                            <input name="shipperEmail" required type="email" placeholder="Email Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                        </div>
                    </div>

                    {/* Section 3: Receiver Details */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 italic">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <MapPin size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Receiver Details</h2>
                        </div>
                        <div className="space-y-4">
                            <input name="receiverName" required type="text" placeholder="Full Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                            <input name="receiverAddress" required type="text" placeholder="House Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                            <input name="receiverPhone" required type="tel" placeholder="Phone Number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                            <input name="receiverEmail" required type="email" placeholder="Email Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all italic" />
                        </div>
                    </div>
                </div>

                {/* Section 4: Items Details */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
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
                    <div className="space-y-4">
                        {items.map((_, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <input
                                    name={`itemName-${index}`}
                                    required
                                    type="text"
                                    placeholder="Item Name"
                                    className="flex-1 md:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                />
                                <input
                                    name={`itemWeight-${index}`}
                                    required
                                    type="text"
                                    placeholder="Weight (kg)"
                                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                />
                                <div className="flex gap-2 font-bold">
                                    <input
                                        name={`itemQty-${index}`}
                                        required
                                        type="number"
                                        min="1"
                                        placeholder="Qty"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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

                {/* Section 5: Payment & Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <CreditCard size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Payment Details</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 italic font-bold">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500">Shipping Cost</label>
                                <input name="shippingCost" required type="number" step="0.01" placeholder="$ 0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500">Amount Paid</label>
                                <input name="amountPaid" required type="number" step="0.01" placeholder="$ 0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs text-slate-500">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Crypto">Crypto</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Truck size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Other Shipping Details</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 font-bold">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500">Pick-Up Time</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input name="pickupTime" type="time" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500">Estimated Duration</label>
                                    <input name="estimatedDuration" type="text" placeholder="e.g. 5 days" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                            </div>
                            <textarea name="notes" placeholder="Notes / Special Instructions" rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/shipments"
                        className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        <Save size={20} />
                        {loading ? 'Creating...' : 'Create Shipment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
