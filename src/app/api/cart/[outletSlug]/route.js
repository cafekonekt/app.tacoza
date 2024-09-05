import { apiGet, apiPost } from '@/handlers/apiHandler';
import { getSession } from '@/app/lib/auth/session';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
    try {
        // Extract the outlet slug from the URL
        const outlet_slug = params.outletSlug;

        // Get user session
        const cookieStore = cookies();
        const session = cookieStore.get("session")?.value;

        if (!session) return new Response("User not authenticated", { status: 401 });

        const user = await getSession(session);

        if (!user.tokens) return new Response("Invalid session", { status: 401 });

        const response = await apiGet(`/api/shop/cart/${outlet_slug}`, {
            headers: {
                "Authorization": `Bearer ${user.tokens.access}`
            }
        });
        return Response.json(response);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return new Response('Error fetching cart items', { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        // Extract the outlet slug from the URL
        const outlet_slug = params.outletSlug;

        const req = await request.json();
        const { id, food_item_id, variant_id, quantity, addons } = req;

        // Get user session
        const cookieStore = cookies();
        const session = cookieStore.get("session")?.value;

        if (!session) return new Response("User not authenticated", { status: 401 });

        const user = await getSession(session);

        if (!user.tokens) return new Response("Invalid session", { status: 401 });

        const response = await apiPost(`/api/shop/cart/${outlet_slug}/`, { 
            id,
            food_item_id, 
            variant_id, 
            quantity, 
            addons
         }, {
            headers: {
                "Authorization": `Bearer ${user.tokens.access}`
            }
        });
        return Response.json(response);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return new Response('Error adding item to cart', { status: 500 });
    }
}
