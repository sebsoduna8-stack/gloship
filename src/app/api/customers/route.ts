import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, getCustomerById } from '@/lib/db';
import { Customer } from '@/types/customer';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const customer = getCustomerById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json(customer);
    }

    const customers = getCustomers();
    return NextResponse.json(customers);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newCustomer: Customer = {
            ...body,
            id: `CUST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            totalShipments: 0
        };
        addCustomer(newCustomer);
        return NextResponse.json(newCustomer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        updateCustomer(body);
        return NextResponse.json(body);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        deleteCustomer(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
