import { cookies } from "next/headers";
import { encrypt } from "@/app/lib/auth/util/lib";
import { NextResponse } from 'next/server'
import { apiPost } from '@/handlers/apiHandler';

export async function POST(request) {
  const req = await request.json()
  const phone = req.phone
  const otp = req.otp
  
  try {
    const response = await apiPost("/api/auth/verify-otp/", {
      'phone_number': phone,
      'otp': otp
    });
    const session = await encrypt(response);
    const cookieStore = cookies()
    cookieStore.set('session', session)
    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    return NextResponse.error('Error verifying OTP', { status: 500 })
  }
}