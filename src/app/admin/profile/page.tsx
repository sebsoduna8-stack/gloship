"use client";

import { useState, useEffect, useRef } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    Save,
    Loader2,
    CheckCircle,
    Shield,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { AdminProfile } from '@/types/admin';

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    // Password state
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/admin/profile');
            const data = await res.json();
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit size to 2MB
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (profile && typeof reader.result === 'string') {
                setProfile({ ...profile, avatarUrl: reader.result });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        // Password validation
        if (passwordData.new) {
            if (passwordData.new.length < 8) {
                setMessage({ type: 'error', text: 'New password must be at least 8 characters' });
                return;
            }
            if (passwordData.new !== passwordData.confirm) {
                setMessage({ type: 'error', text: 'New passwords do not match' });
                return;
            }
        }

        setSaving(true);
        setMessage(null);

        try {
            const updateData: any = { ...profile };
            if (passwordData.new) {
                updateData.password = passwordData.new;
            }

            const res = await fetch('/api/admin/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Clear password fields on success
                setPasswordData({ current: '', new: '', confirm: '' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Update failed');
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 shadow-sm">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 font-[var(--font-montserrat)]">Admin Profile</h1>
                        <p className="text-slate-500 text-sm">Manage your personal information and security</p>
                    </div>
                </div>
                <button
                    form="profile-form"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <Shield size={20} />}
                    <span className="font-bold text-sm">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
                        <div className="relative mt-8">
                            <div className="relative inline-block">
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white object-cover"
                                />
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors border-2 border-white"
                                >
                                    <Camera size={16} />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-slate-900">{profile.name}</h2>
                            <p className="text-sm font-bold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mt-1 border border-blue-100">
                                {profile.role}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                            <div className="flex items-center gap-3 text-slate-500 text-sm">
                                <Shield size={18} className="text-slate-400" />
                                <span className="font-bold">ID: {profile.id}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm">
                                <Calendar size={18} className="text-slate-400" />
                                <span className="font-bold font-mono">Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-xl text-white">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Lock size={18} className="text-blue-400" />
                            Security Tip
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-bold italic">
                            Keep your password strong and change it regularly to maintain high security for your administrator account.
                        </p>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <User size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5 font-bold">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 font-bold">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 font-bold">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                                            placeholder="+1 (234) 567-890"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 font-bold">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest px-1">Role</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.role}
                                            readOnly
                                            className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 text-sm font-bold cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                                    <Lock size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Password & Security</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5 font-bold">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest px-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="hidden md:block"></div>
                                <div className="space-y-1.5 font-bold">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest px-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                                <div className="space-y-1.5 font-bold">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest px-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
