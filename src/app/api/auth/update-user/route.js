import { getSession } from "@/app/lib/auth/session";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server'
import { apiPost } from '@/handlers/apiHandler';

export async function POST(request) {
    const req = await request.json()
    const name = req.name
    const email = req.email

    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value;

    if (!session) return NextResponse.error('Invalid session', { status: 401 });
    const user = await getSession(session);

    try {
        const response = await apiPost("/api/auth/update-user/", {
            'name': name,
            'email': email
        }, {
            headers: {
                "Authorization": `Bearer ${user.tokens.access}`
            }
        });
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        return NextResponse.error('Error updating user', { status: 500 })
    }
}
