'use server'
import { cookies } from "next/headers";
import { encrypt } from "@/app/lib/auth/util/lib";
import { apiPost } from "@/handlers/apiHandler";

export async function verifyOTP(phone_number, otp) {
  try {
    const response = await apiPost("/api/auth/verify-otp/", {
      'phone_number': phone_number,
      'otp': otp
    });
    console.log(response, 'response');
    const session = await encrypt(response);
    cookies().set('session', session);
    return response;
  } catch (error) {
    return null;
  }
}
