"use server";
// components
import { Header } from "./Header";
import { BreadCrumb } from "./Breadcrumb";
import { Details } from "./Details";
import { Items } from "./Items";
import { OrderForm } from "./OrderForm";
// server actions
import { getOutlet } from "@/app/lib/outlet/getOutlet";
import { getTables } from "@/app/lib/tables/getTables";
import { getSession } from "@/app/lib/auth/session";
import { notFound } from "next/navigation";

// export const metadata = {
//   title: "Cart - tacoza (Instant food Ordering)",
//   description: "Scan, Crave and Order superfast",
// };

export default async function Orders({ params }) {
  const menu = params.menu;

  const [session, tables, outlet] = await Promise.all([
    getSession(),
    getTables(menu),
    getOutlet(menu),
  ]);

  if (tables.status==404 || outlet.status==404) return notFound();
  console.log(session);
  return (
    <main className="max-w-md grid gap-4 p-4">
      {/* Header */}
      <Header params={params} session={session} />
      {/* Breadcrumb */}
      <BreadCrumb params={params} />
      {/* Restaurant Info */}
      <Details params={params} outlet={outlet} />
      {/* List Items */}
      <Items />
      {/* Order Form */}
      <OrderForm params={params} outlet={outlet} tables={tables} session={session} />
    </main>
  );
}
