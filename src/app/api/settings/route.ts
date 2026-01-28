import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import { SiteSettings } from '@/types/settings';

export async function GET() {
    const settings = getSettings();
    return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        saveSettings(body);
        return NextResponse.json(body);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
