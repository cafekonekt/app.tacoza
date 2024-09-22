"use server";
import { getSession } from "@/app/lib/auth/session";
import { apiGet, apiPost } from "@/handlers/apiHandler";

export async function getCart(outlet_slug) {
  const session = await getSession();
  if (!session) {
    return null;
  }
  try {
    const response = await apiGet(`/api/shop/cart/${outlet_slug}`, {
      headers: {
        Authorization: `Bearer ${session.tokens?.access}`,
      },
    });
    if (response.error) return null;
    return response;
  } catch (error) {
    console.error("Error getting cart:", error);
    return null;
  }
}

export async function addItemToCart(
  outlet_slug,
  { id, food_item_id, variant_id, quantity, addons },
) {
  const session = await getSession();
  if (!session) {
    return null;
  }
  try {
    const response = await apiPost(
      `/api/shop/cart/${outlet_slug}/`,
      {
        id,
        food_item_id,
        variant_id,
        quantity,
        addons,
      },
      {
        headers: {
          Authorization: `Bearer ${session.tokens?.access}`,
        },
      },
    );
    if (response.error) return null;
    return response;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return null;
  }
}
