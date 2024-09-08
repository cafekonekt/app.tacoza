import { getSession } from '@/app/lib/auth/session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const cookieStore = cookies();
        const session = cookieStore.get("session")?.value;
        if (!session) return NextResponse.error('Invalid session', { status: 401 });
        const user = await getSession(session);
        if (!user.tokens) return NextResponse.error('Invalid session', { status: 401 });
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error getting user session:', error);
        return NextResponse.error('User not authenticated', { status: 401 });
    }
}
