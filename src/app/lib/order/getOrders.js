"use server";
import { getSession } from "@/app/lib/auth/session";
import { apiGet } from "@/handlers/apiHandler";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function getOrders(params) {
  const user = await getSession();
  try {
    const response = await apiGet(`/api/shop/orders/${params?.menu}`, {
      headers: {
        Authorization: `Bearer ${user.tokens.access}`,
      },
    });
    revalidatePath(`/${params?.menu}/order`);
    return response;
  } catch (error) {
    return null;
  }
}

export async function getOrder(params) {
  const user = await getSession();
  try {
    const response = await apiGet(`/api/shop/order/${params?.order_id}`, {
      headers: {
        Authorization: `Bearer ${user.tokens.access}`,
      },
    }); 
    revalidatePath(`/${params?.menu}/order/${params?.orderId}`);
    return response;
  } catch (error) {
    return null;
  }
}