"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    Search,
    LogOut,
    Settings,
    Users,
    User
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Shipments', href: '/admin/shipments' },
    { icon: PlusCircle, label: 'New Shipment', href: '/admin/shipments/new' },
    { icon: Users, label: 'Receivers', href: '/admin/customers' },
    { icon: User, label: 'Profile', href: '/admin/profile' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin');
    };

    return (
        <aside className={twMerge("w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 shadow-2xl z-50 transition-transform overflow-y-auto", className)}>
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white p-1 overflow-hidden shadow-lg border-2 border-blue-500/20">
                        <img src="/logo.png" alt="Gloship Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white leading-tight uppercase tracking-tighter">Glo-Ship</h1>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none">Express</p>
                    </div>
                </div>
                <button onClick={onClose} className="md:hidden absolute right-4 top-4 p-2 rounded-lg bg-slate-800 text-slate-300">
                    ✕
                </button>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-2 px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={twMerge(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
