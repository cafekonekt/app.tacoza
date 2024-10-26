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
import { getOffers } from "@/app/lib/cart/offer";

export const metadata = {
  title: "Cart - tacoza (Instant food Ordering)",
  description: "Scan, Crave and Order superfast",
};

export default async function Orders({ params }) {
  const menu = params.menu;
  const [session, tables, outlet, offers] = await Promise.all([
    getSession(),
    getTables(menu),
    getOutlet(menu),
    getOffers(),
  ]);
  if (tables.status == 404 || outlet.status == 404) return notFound();
  console.log("Offers", offers);

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
        session={session}
      />
    </main>
  );
}
