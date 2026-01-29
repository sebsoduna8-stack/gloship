import { NextResponse } from 'next/server';
import { AdminProfile } from '@/types/admin';
import { getAdminProfile, saveAdminProfile } from '@/lib/db';

export async function GET() {
    try {
        const admin = getAdminProfile();
        // Don't send password to the client
        const { password, ...safeAdmin } = admin;
        return NextResponse.json(safeAdmin);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const updates: Partial<AdminProfile> = await request.json();
        const currentAdmin = getAdminProfile();

        const updatedAdmin = {
            ...currentAdmin,
            ...updates,
            // Don't allow updating sensitive fields via this endpoint directly
            id: currentAdmin.id,
            role: currentAdmin.role,
            createdAt: currentAdmin.createdAt
        };

        // If password is being updated, it's handled here for now
        // Usually, you'd want a separate endpoint for security
        saveAdminProfile(updatedAdmin);

        const { password, ...safeAdmin } = updatedAdmin;
        return NextResponse.json({ success: true, profile: safeAdmin });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: `Failed to update profile: ${error.message}` }, { status: 500 });
    }
}
