"use server";
import { apiGet } from "@/handlers/apiHandler";
import { notFound } from "next/navigation";

export async function getTables(menu) {
  try {
    const response = await apiGet(`/api/shop/tables/${menu}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    return null;
  }
}

export async function getTable(table_id) {
  try {
    const response = await apiGet(`/api/shop/table/${table_id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch table:", error);
    return null;
  }
}