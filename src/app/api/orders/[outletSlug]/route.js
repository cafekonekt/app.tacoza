import { apiGet, apiPost } from '@/handlers/apiHandler';
import { getSession, logout } from '@/app/lib/auth/session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const outlet_slug = params.outletSlug;
    const cookieStore = cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return new Response("User not authenticated", { status: 401 });
    const user = await getSession(session);
    if (!user.tokens) return new Response("Invalid session", { status: 401 });
    
    try {
        const response = await apiGet(`/api/shop/orders/${outlet_slug}`, {
            headers: {
                "Authorization": `Bearer ${user.tokens.access}`
            }
        });
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.error('Error fetching cart items', { status: 500 });
    }
}

export async function POST(request, { params }) {
    const req = await request.json()
    const order_type = req.type
    const table_id = req.table_id
    const instructions = req.instruction

    const cookieStore = cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return NextResponse.error('Invalid session', { status: 401 });
    const user = await getSession(session);

    if (!user.tokens) return NextResponse.error('Invalid session', { status: 401 });

    try {
        const response = await apiPost(`/api/shop/checkout/${params.outletSlug}/`, {
                'order_type': order_type,
                'table_id': table_id,
                'cooking_instructions': instructions
            }, {
            headers: {
                "Authorization": `Bearer ${user.tokens.access}`
            }
        });
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        await logout();
        return NextResponse.error('Error creating order', { status: 500 });
    }
}
