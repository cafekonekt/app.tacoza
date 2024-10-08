// components
import { Header } from "../Header";
import { BreadCrumb } from "../Breadcrumb";
import { Details } from "../Details";
import { Items } from "../Items";
import { OrderForm } from "../OrderForm";
// server actions
import { getOutlet } from "@/app/lib/outlet/getOutlet";
import { getTable } from "@/app/lib/tables/getTables";
import { getSession } from "@/app/lib/auth/session";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Cart - tacoza (Instant food Ordering)",
  description: "Scan, Crave and Order superfast",
};

export default async function Orders({ params }) {
  const menu = params.menu;
  const table_id = params.table_id;
  const [session, table, outlet] = await Promise.all([
    getSession(),
    getTable(table_id),
    getOutlet(menu),
  ]);
  if (table.status == 404 || outlet.status == 404) notFound();

  const tables = [table];
  return (
    <main className="max-w-md grid gap-4 py-4 bg-gray-100">
      {/* Header */}
      <Header params={params} session={session} />
      {/* Breadcrumb */}
      <BreadCrumb params={params} />
      {/* Restaurant Info */}
      <Details params={params} outlet={outlet} />
      {/* List Items */}
      <Items />
      {/* Order Form */}
      <OrderForm
        params={params}
        outlet={outlet}
        tables={tables}
        table={table}
        session={session}
      />
    </main>
  );
}
