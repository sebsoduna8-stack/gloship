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

        const origin = request.headers.get('origin') || 'https://www.globalshippers.com';

        // Premium Professional Email Template
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .header { background: #0f172a; padding: 40px 20px; text-align: center; color: white; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
                    .status-badge { display: inline-block; padding: 6px 16px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 12px; }
                    .content { padding: 40px; }
                    .details-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 24px; margin: 32px 0; padding: 24px; background: #f8fafc; border-radius: 12px; }
                    .detail-item { margin-bottom: 20px; }
                    .detail-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
                    .detail-value { font-size: 14px; font-weight: 600; color: #1e293b; }
                    .cta-button { display: block; width: 100%; padding: 16px; background: #2563eb; color: white; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; margin-top: 32px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
                    .footer { padding: 32px; text-align: center; background: #f1f5f9; color: #64748b; font-size: 12px; }
                    .divider { height: 1px; background: #e2e8f0; margin: 32px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>GLO-SHIP EXPRESS</h1>
                        <div class="status-badge">${shipment.status}</div>
                    </div>
                    
                    <div class="content">
                        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0;">Shipment Delivered to System</h2>
                        <p>Hello <strong>${shipment.receiverName}</strong>,</p>
                        <p>Your shipment has been successfully registered and is now being processed. Our logistics team is ensuring a swift and secure delivery to your destination.</p>
                        
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Tracking ID</div>
                                <div class="detail-value" style="color: #2563eb; font-family: monospace;">${shipment.id}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Shipment Date</div>
                                <div class="detail-value">${new Date(shipment.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Origin</div>
                                <div class="detail-value">${shipment.shipperAddress.split(',').pop()?.trim() || 'Origin Hub'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Destination</div>
                                <div class="detail-value">${shipment.receiverAddress.split(',').pop()?.trim() || 'Destination Hub'}</div>
                            </div>
                        </div>

                        <div class="detail-item" style="background: white; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px;">
                            <div class="detail-label">Expected Delivery</div>
                            <div class="detail-value" style="font-size: 18px;">${new Date(shipment.expectedDelivery).toLocaleDateString(undefined, { dateStyle: 'full' })}</div>
                        </div>
                        
                        <a href="${origin}/track?id=${shipment.id}" class="cta-button">Track Your Shipment Live</a>
                        
                        <div class="divider"></div>
                        
                        <p style="font-size: 13px; color: #475569;">If you have any questions regarding your package, please contact our 24/7 support team quoting your tracking ID.</p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>GLO-SHIP Global Logistics</strong><br>Worldwide Express Shipping & Tracking</p>
                        <p style="margin-top: 16px;">This is an automated notification. Please do not reply directly to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} GLO-SHIP. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"GLO-SHIP Express" <${process.env.EMAIL_USER}>`,
            to: shipment.receiverEmail,
            subject: `Shipment Confirmation: ${shipment.id} [${shipment.status}]`,
            html: emailHtml,
        });

        return NextResponse.json({ success: true, message: 'Premium email sent successfully' });

    } catch (error: any) {
        console.error('Email Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to send email'
        }, { status: 500 });
    }
}
