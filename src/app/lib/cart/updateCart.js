"use server";
import { getSession } from "@/app/lib/auth/session";
import { apiPut, apiDelete } from "@/handlers/apiHandler";

export async function updateCartItem(outlet_slug, item_id, quantity) {
  const session = await getSession();
  if (!session) {
    return null;
  }
  try {
    const response = await apiPut(
      `/api/shop/cart/${outlet_slug}/${item_id}/`,
      {
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${session.tokens?.access}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
}

export async function deleteCartItem(outlet_slug, item_id) {
  const session = await getSession();
  if (!session) {
    return null;
  }
  try {
    const response = await apiDelete(
      `/api/shop/cart/${outlet_slug}/${item_id}/`,
      {
        headers: {
          Authorization: `Bearer ${session.tokens?.access}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    return null;
  }
}
