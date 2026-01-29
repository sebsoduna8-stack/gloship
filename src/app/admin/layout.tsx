"use client";
import AdminSidebar from '@/components/admin/Sidebar';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="md:hidden sticky top-0 z-40 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 py-3">
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-slate-900 text-white font-bold">Menu</button>
                <div className="font-black text-slate-900">Admin</div>
                <button onClick={handleLogout} className="p-2 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
            <div className={`fixed inset-0 bg-black/40 ${sidebarOpen ? 'block' : 'hidden'} md:hidden`} onClick={() => setSidebarOpen(false)} />
            <AdminSidebar className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} onClose={() => setSidebarOpen(false)} />
            <main className="p-8 md:ml-64 ml-0">
                {children}
            </main>
        </div>
    );
}
