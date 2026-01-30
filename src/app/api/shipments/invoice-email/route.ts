import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Shipment } from '@/types/shipment';

export async function POST(request: Request) {
    try {
        const shipment: Shipment = await request.json();

        if (!shipment) {
            return NextResponse.json({ error: 'Shipment data is required' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return NextResponse.json({
                error: 'Email configuration missing on server. Please add EMAIL_USER and EMAIL_PASS to your .env file.'
            }, { status: 500 });
        }

        const balance = shipment.shippingCost - shipment.amountPaid;
        const balanceStatus = balance > 0 ? 'UNPAID' : 'PAID';
        const balanceColor = balance > 0 ? '#ef4444' : '#22c55e'; // Red or Green

        // Premium Invoice Email Template
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .header { background: #1e40af; padding: 40px 20px; text-align: center; color: white; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
                    .invoice-badge { display: inline-block; padding: 6px 16px; background: rgba(255, 255, 255, 0.2); color: white; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 12px; }
                    .content { padding: 40px; }
                    .bill-to { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; }
                    .bill-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
                    .bill-value { font-size: 16px; font-weight: 600; color: #1e293b; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
                    .items-table th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
                    .items-table td { padding: 16px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; }
                    .total-section { background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px; }
                    .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #64748b; }
                    .final-total { display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 18px; font-weight: 800; color: #1e293b; }
                    .cta-button { display: block; width: 100%; padding: 16px; background: #1e40af; color: white; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(30, 64, 175, 0.3); }
                    .footer { padding: 32px; text-align: center; background: #f1f5f9; color: #64748b; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>GLO-SHIP EXPRESS</h1>
                        <div class="invoice-badge">Invoice #${shipment.id}</div>
                    </div>
                    
                    <div class="content">
                        <div class="bill-to">
                            <div class="bill-label">Billed To</div>
                            <div class="bill-value">${shipment.receiverName}</div>
                            <div style="font-size: 14px; color: #64748b; margin-top: 4px;">${shipment.receiverAddress}</div>
                            <div style="font-size: 14px; color: #64748b;">${shipment.receiverEmail}</div>
                        </div>

                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Weight</th>
                                    <th>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${shipment.items.map(item => `
                                    <tr>
                                        <td><strong>${item.name}</strong></td>
                                        <td>${item.weight}</td>
                                        <td>${item.quantity}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div class="total-section">
                            <div class="total-row">
                                <span>Shipping Cost</span>
                                <span>$${shipment.shippingCost.toFixed(2)}</span>
                            </div>
                            <div class="total-row">
                                <span>Amount Paid</span>
                                <span>$${shipment.amountPaid.toFixed(2)}</span>
                            </div>
                            <div class="final-total">
                                <span>Balance Due</span>
                                <span style="color: ${balanceColor};">$${balance.toFixed(2)}</span>
                            </div>
                        </div>

                        <a href="${origin}/track?id=${shipment.id}" class="cta-button">View Shipment & Pay</a>
                        
                        <p style="margin-top: 32px; font-size: 13px; color: #64748b; text-align: center;">
                            Status: <strong style="color: ${balanceColor};">${balanceStatus}</strong> • Payment Method: <strong>${shipment.paymentMethod}</strong>
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>GLO-SHIP Global Logistics</strong><br>Worldwide Express Shipping & Tracking</p>
                        <p>&copy; ${new Date().getFullYear()} GLO-SHIP. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"GLO-SHIP Express" <${process.env.EMAIL_USER}>`,
            to: shipment.receiverEmail,
            subject: `Invoice Available: #${shipment.id} - ${balanceStatus}`,
            html: emailHtml,
        });

        return NextResponse.json({ success: true, message: 'Invoice email sent successfully' });

    } catch (error: any) {
        console.error('Email Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to send invoice email'
        }, { status: 500 });
    }
}
