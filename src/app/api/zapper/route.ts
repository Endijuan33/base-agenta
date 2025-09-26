
import { NextRequest, NextResponse } from 'next/server';

// Basic Auth requires a base64 encoded string of `apiKey:`
const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY ?? '';
const AUTH_HEADER = `Basic ${btoa(`${ZAPPER_API_KEY}:`)}`;
const ZAPPER_API_BASE_URL = 'https://api.zapper.xyz/v2';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    if (!ZAPPER_API_KEY) {
        console.error("Zapper API key is not configured.");
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const url = `${ZAPPER_API_BASE_URL}/positions?addresses[]=${address}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': AUTH_HEADER
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Zapper API Error:", errorData);
            return NextResponse.json({ error: `Failed to fetch data from Zapper: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
