import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'

const secretKey = 'your-secret-key'
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session) {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.error('Error decrypting session:', error)
    }
}

export async function getSession() {
    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function logout() {
    const cookieStore = cookies();
    cookieStore.set({
        name: 'session',
        value: '',
        maxAge: 0,
    })
}
