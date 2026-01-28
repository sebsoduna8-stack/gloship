
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export async function middleware(request: NextRequest) {
    // 1. Check if the path is an admin path
    if (request.nextUrl.pathname.startsWith('/admin')) {
        
        // Allow access to the login page itself
        if (request.nextUrl.pathname === '/admin') {
            // If already logged in, redirect to dashboard
            const token = request.cookies.get('admin_token')?.value;
            if (token) {
                 try {
                    await jwtVerify(token, JWT_SECRET);
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                } catch (err) {
                    // Token invalid, allow access to login page
                }
            }
            return NextResponse.next();
        }

        // 2. For all other /admin/* routes, verify the token
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (err) {
            // Token is invalid or expired
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
