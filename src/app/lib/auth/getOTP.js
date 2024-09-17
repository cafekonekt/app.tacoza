'use server'
import { apiPost } from "@/handlers/apiHandler";

export async function getOTP(phone_number) {
  try {
    const response = await apiPost("/api/auth/send-otp/", {
      phone_number,
    });
    return response;
  } catch (error) {
    return null;
  }
}
