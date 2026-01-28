"use client";
import AdminSidebar from '@/components/admin/Sidebar';
import { useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="md:hidden sticky top-0 z-40 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 py-3">
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-slate-900 text-white font-bold">Menu</button>
                <div className="font-black text-slate-900">Admin</div>
            </div>
            <div className={`fixed inset-0 bg-black/40 ${sidebarOpen ? 'block' : 'hidden'} md:hidden`} onClick={() => setSidebarOpen(false)} />
            <AdminSidebar className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex hidden md:block`} onClose={() => setSidebarOpen(false)} />
            <main className="p-8 md:ml-64 ml-0">
                {children}
            </main>
        </div>
    );
}
