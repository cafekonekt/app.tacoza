"use server";
import { apiGet } from "@/handlers/apiHandler";

export async function getOutlet(menu) {
  try {
    const response = await apiGet(`/api/shop/outlet/${menu}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch outlet:", error);
    return null;
  }
}
