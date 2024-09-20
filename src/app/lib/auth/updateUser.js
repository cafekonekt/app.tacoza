'use server'
import { cookies } from "next/headers";
import { encrypt } from "@/app/lib/auth/util/lib";
import { apiPost } from "@/handlers/apiHandler";
import { getSession } from "./session";

export async function updateUser(name, email) {
  const session = await getSession();
  try {
    const response = await apiPost(
      "/api/auth/update-user/",
      {
        name: name,
        email: email,
      },
      {
        headers: {
          Authorization: `Bearer ${session.tokens.access}`,
        },
      },
    );
    const currentSession = await encrypt(response);
    const cookieStore = cookies();
    cookieStore.set("session", currentSession);
    return response;
  } catch (error) {
    return null;
  }
}
