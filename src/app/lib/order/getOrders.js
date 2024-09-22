"use server";
import { getSession, logout } from "@/app/lib/auth/session";
import { apiGet } from "@/handlers/apiHandler";
import { notFound } from "next/navigation";

export async function getOrders() {
  const user = await getSession();
  try {
    const response = await apiGet(`/api/shop/orders/`, {
      headers: {
        Authorization: `Bearer ${user?.tokens.access}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
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
    return response;
  } catch (error) {
    console.error(error, 'error in action');
    return null;
  }
}
