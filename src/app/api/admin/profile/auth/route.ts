import { NextResponse } from 'next/server';
import { getAdminProfile } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const admin = getAdminProfile();

        if (admin.email === email && admin.password === password) {
            // Create session cookie
            await createSession({ 
                id: admin.id, 
                email: admin.email, 
                role: admin.role 
            });
            
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
