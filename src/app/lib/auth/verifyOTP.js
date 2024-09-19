'use server'
import { cookies } from "next/headers";
import { encrypt } from "@/app/lib/auth/util/lib";
import { apiPost } from "@/handlers/apiHandler";

export async function verifyOTP(phone_number, otp, path) {
  try {
    const response = await apiPost("/api/auth/verify-otp/", {
      'phone_number': phone_number,
      'otp': otp
    });
    const session = await encrypt(response);
    const cookieStore = cookies()
    cookieStore.set('session', session)
    return response;
  } catch (error) {
    return null;
  }
}
