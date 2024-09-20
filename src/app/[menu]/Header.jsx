"use server"
import Image from "next/image";
import { Menu } from "@/app/components/menu/header/Menu";
import { Auth } from "@/app/components/auth/Auth";
import { getSession } from "@/app/lib/auth/session";

export async function Header() {
  const session = await getSession();
  return (
    <div className="flex justify-between">
      <Image src="/logo.png" alt="logo" width={150} height={100} />
      {!session?.user?.name || !session?.user?.email ? <Auth /> : <Menu />}
    </div>
  );
}
