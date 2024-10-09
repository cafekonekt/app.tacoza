"use server";
import { getSession } from "@/app/lib/auth/session";
import { apiPost } from "@/handlers/apiHandler";

export async function subscribe(formData) {
  const user = await getSession();
  try {
    const response = await apiPost("/api/shop/subscribe/", formData, {
      headers: {
        Authorization: `Bearer ${user?.tokens?.access}`,
      },
    });
    if (response.status === 401 || response.status === 400 || response.status === 500) {
        return { message: "Error Subscribing", status: "destructive" };
    } 
    return { message: "Subscribed to push notifications.", status: "success" };
  } catch (error) {
    return { message: "Error Subscribing", status: "destructive" };
  }
}
