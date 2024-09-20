"use server";
import { getSession } from "@/app/lib/auth/session";
import { apiGet } from "@/handlers/apiHandler";
import { revalidatePath } from "next/cache";

export async function getPayment(params) {
  const user = await getSession();
  try {
    const response = await apiGet(`/api/shop/payment/${params?.order_id}`, {
      headers: {
        Authorization: `Bearer ${user.tokens.access}`,
      },
    }); 
    revalidatePath(`/order/${params?.orderId}`);
    return response;
  } catch (error) {
    return null;
  }
}