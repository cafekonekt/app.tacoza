"use server";
import { apiGet } from "@/handlers/apiHandler";

export async function getOffers() {
    try {
        const response = await apiGet(`/api/shop/offers/`);
        if (response.error) return null;
        return response;
    } catch (error) {
        console.error("Error fetching offers:", error);
        return null;
    }
}