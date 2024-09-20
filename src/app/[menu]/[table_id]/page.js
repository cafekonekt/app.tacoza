import { apiGet } from "@/handlers/apiHandler";
import { MenuAccordion } from "../MenuAccordion";
import { ItemAdded } from "../ItemAdded";
import { BreadCrumb } from "../Breadcrumb";
import { Gallery } from "../Gallery";
import { Header } from "../Header";
import { Call } from "../Call";
import { Footer } from "../Footer";
import { Details } from "../Details";
import { getTable } from "@/app/lib/tables/getTables";
import { notFound } from "next/navigation";

export default async function Home({ params }) {
  const table_id = params.table_id
  const itemsPromis = apiGet(`/api/shop/client-menu/${params.menu}`);
  const outletPromis = apiGet(`/api/shop/outlet/${params.menu}`);
  const waitPromisForLoader = new Promise((resolve) =>
    setTimeout(resolve, 1000),
  );
  const [items, outlet, table] = await Promise.all([
    itemsPromis,
    outletPromis,
    getTable(table_id),
    waitPromisForLoader,
  ]);
  if (!table) notFound();

  return (
    <>
      <main className="flex w-full min-h-screen flex-col gap-4 justify-evenly p-6 overflow-hidden">
        {/* Header */}
        <Header params={params} outlet={outlet} />
        {/* Breadcrumb */}
        <BreadCrumb params={params} />
        {/* Outlet Image */}
        <Gallery outlet={outlet} />
        {/* Restaurant Details */}
        <Details outlet={outlet} />
        {/* Call Waiter, Bookmark, Share */}
        <Call />
        {/* Menu and Filters */}
        <MenuAccordion items={items} />
        {/* Item Added */}
        <ItemAdded params={params} />
      </main>
      <Footer outlet={outlet} />
    </>
  );
}
