import { NextRequest, NextResponse } from 'next/server';
import { getShipments, addShipment, updateShipment, deleteShipment, getShipmentById } from '@/lib/db';
import { Shipment } from '@/types/shipment';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const shipment = await getShipmentById(id);
        if (!shipment) {
            return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
        }
        return NextResponse.json(shipment);
    }

    const shipments = await getShipments();
    return NextResponse.json(shipments);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newShipment: Shipment = {
            ...body,
            date: new Date().toISOString(),
            history: [{
                id: Math.random().toString(36).substr(2, 9),
                status: body.status || 'Pending',
                timestamp: new Date().toISOString(),
                location: 'Origin facility',
                notes: 'Shipment created'
            }]
        };
        await addShipment(newShipment);
        return NextResponse.json(newShipment, { status: 201 });
    } catch (error: any) {
        console.error('Error creating shipment:', error);
        return NextResponse.json({ error: `Failed to create shipment: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        await updateShipment(body);
        return NextResponse.json(body);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        await deleteShipment(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
