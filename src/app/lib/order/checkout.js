"use server";
import { getSession } from "@/app/lib/auth/session";
import { apiPost } from "@/handlers/apiHandler";
import { logout } from "@/app/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function checkout({ params, order_type, table_id, instructions, payment_method }) {
  const user = await getSession();
  const outlet_slug = params?.menu;
  try {
    const response = await apiPost(
      `/api/shop/checkout/${outlet_slug}/`,
      {
        order_type: order_type,
        table_id: table_id,
        cooking_instructions: instructions,
        payment_method: payment_method,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.tokens?.access}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    await logout();
    return null;
  }
}
