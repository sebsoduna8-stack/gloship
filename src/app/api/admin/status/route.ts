
import { NextResponse } from 'next/server';

const REPO_OWNER = 'sebsoduna8-stack';
const REPO_NAME = 'gloship';

export async function GET() {
    // 1. Check for Token
    if (!process.env.GITHUB_TOKEN) {
        return NextResponse.json({ 
            status: 'error', 
            message: 'GITHUB_TOKEN is missing in environment variables. Data will NOT persist.',
            mode: 'local'
        });
    }

    // 2. Test Connection
    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            next: { revalidate: 0 }
        });

        if (res.ok) {
            const data = await res.json();
            // Check permissions (basic check)
            if (data.permissions && !data.permissions.push) {
                return NextResponse.json({ 
                    status: 'warning', 
                    message: 'Connected to GitHub, but "Write" permission is missing. Data cannot be saved.',
                    mode: 'readonly'
                });
            }

            return NextResponse.json({ 
                status: 'success', 
                message: 'Successfully connected to GitHub Storage.',
                mode: 'github'
            });
        } else {
            return NextResponse.json({ 
                status: 'error', 
                message: `GitHub Connection Failed: ${res.status} ${res.statusText}`,
                mode: 'error'
            });
        }
    } catch (error: any) {
        return NextResponse.json({ 
            status: 'error', 
            message: `Connection Error: ${error.message}`,
            mode: 'error'
        });
    }
}
