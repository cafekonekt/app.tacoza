"use server";
import { decrypt } from "@/app/lib/auth/util/lib";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.set({
    name: "session",
    maxAge: 0,
  });
}