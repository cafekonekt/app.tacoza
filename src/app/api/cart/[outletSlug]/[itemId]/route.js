import { apiPut, apiDelete } from '@/handlers/apiHandler';
import { getSession } from "@/app/lib/auth/session";
import { cookies } from "next/headers";

export async function PUT(request, { params }) {
    try {
        const { outletSlug, itemId } = params;

        const req = await request.json();
        const { quantity } = req;

        // Get user session
        const cookieStore = cookies();
        const session = cookieStore.get("session")?.value;

        if (!session) return new Response("User not authenticated", { status: 401 });

        const user = await getSession(session);

        if (!user?.tokens) return new Response("Invalid session", { status: 401 });

        const response = await apiPut(`/api/shop/cart/${outletSlug}/${itemId}/`, {
            quantity
        }, {
            headers: {
                "Authorization": `Bearer ${user.tokens.access}`,
            }
        });
        return Response.json(response);
    } catch (error) {
        console.error('Error updating cart item:', error);
        return new Response('Error updating cart item', { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { outletSlug, itemId } = params;

        // Get user session
        const cookieStore = cookies();
        const session = cookieStore.get("session")?.value;

        if (!session) return new Response("User not authenticated", { status: 401 });

        const user = await getSession(session);

        if (!user?.tokens) return new Response("Invalid session", { status: 401 });

        const response = await apiDelete(`/api/shop/cart/${outletSlug}/${itemId}/`, {
            headers: {
                "Authorization": `Bearer ${user.tokens.access}`,
            }
        });
        return Response.json(response);
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return new Response('Error deleting cart item', { status: 500 });
    }
}