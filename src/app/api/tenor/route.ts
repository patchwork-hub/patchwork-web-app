import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const pos = searchParams.get('pos') || '';

    const endpoint = query
        ? `https://tenor.googleapis.com/v2/search`
        : `https://tenor.googleapis.com/v2/featured`;

    try {
        const response = await axios.get(endpoint, {
            params: {
                key: process.env.NEXT_PUBLIC_GIFV_TENOR_GOOGLE_API_KEY,
                media_filter: 'minimal',
                limit: 20,
                client_key: 'Patchwork',
                locale: 'en_US',
                q: query,
                pos,
            },
        });
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: error || 'Failed to fetch data' }, { status: 500 });
    }
}